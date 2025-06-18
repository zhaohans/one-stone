
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { account_id, period_start, period_end, fee_type, fee_rate } = await req.json()

    // Validate inputs
    if (!account_id || !period_start || !period_end || !fee_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user and verify access
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify account access
    const { data: account, error: accountError } = await supabaseClient
      .from('accounts')
      .select('id, client_id, base_currency')
      .eq('id', account_id)
      .single()

    if (accountError || !account) {
      return new Response(
        JSON.stringify({ error: 'Account not found or no access' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let calculatedAmount = 0
    let feeDescription = ''

    switch (fee_type) {
      case 'management':
        // Calculate management fee using database function
        const { data: mgmtFee, error: mgmtError } = await supabaseClient
          .rpc('calculate_management_fee', {
            account_id_param: account_id,
            start_date: period_start,
            end_date: period_end,
            fee_rate: fee_rate || 1.0
          })

        if (mgmtError) {
          throw mgmtError
        }
        
        calculatedAmount = mgmtFee || 0
        feeDescription = `Management fee (${fee_rate || 1.0}% annually)`
        break

      case 'performance':
        // Get portfolio performance for the period
        const { data: positions } = await supabaseClient
          .from('positions')
          .select('quantity, average_cost, market_value')
          .eq('account_id', account_id)

        if (positions) {
          const totalValue = positions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
          const totalCost = positions.reduce((sum, pos) => sum + (pos.quantity * (pos.average_cost || 0)), 0)
          const performance = totalValue - totalCost
          
          if (performance > 0) {
            calculatedAmount = performance * ((fee_rate || 20) / 100)
            feeDescription = `Performance fee (${fee_rate || 20}% of gains)`
          }
        }
        break

      case 'transaction':
        // Calculate transaction fees for the period
        const { data: trades } = await supabaseClient
          .from('trades')
          .select('commission, fees')
          .eq('account_id', account_id)
          .gte('trade_date', period_start)
          .lte('trade_date', period_end)

        if (trades) {
          calculatedAmount = trades.reduce((sum, trade) => 
            sum + (trade.commission || 0) + (trade.fees || 0), 0
          )
          feeDescription = 'Transaction fees for the period'
        }
        break

      case 'custody':
        // Simple custody fee calculation
        const { data: custodyPositions } = await supabaseClient
          .from('positions')
          .select('market_value')
          .eq('account_id', account_id)

        if (custodyPositions) {
          const totalValue = custodyPositions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
          const days = Math.ceil((new Date(period_end).getTime() - new Date(period_start).getTime()) / (1000 * 60 * 60 * 24))
          calculatedAmount = (totalValue * (fee_rate || 0.1) / 100) * (days / 365)
          feeDescription = `Custody fee (${fee_rate || 0.1}% annually)`
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid fee type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // Create fee record
    const { data: newFee, error: feeError } = await supabaseClient
      .from('fees')
      .insert({
        account_id: account_id,
        fee_type: fee_type,
        fee_description: feeDescription,
        calculation_period_start: period_start,
        calculation_period_end: period_end,
        fee_rate: fee_rate,
        calculated_amount: calculatedAmount,
        currency: account.base_currency,
        created_by: user.id
      })
      .select()
      .single()

    if (feeError) {
      throw feeError
    }

    // Calculate retrocessions if applicable
    const retrocessions = []
    if (fee_type === 'management' && calculatedAmount > 0) {
      // Example: 25% retrocession to advisor
      const retrocessionAmount = calculatedAmount * 0.25
      
      const { data: retrocession, error: retroError } = await supabaseClient
        .from('retrocessions')
        .insert({
          fee_id: newFee.id,
          recipient_name: 'Financial Advisor',
          recipient_type: 'advisor',
          retrocession_rate: 25.0,
          amount: retrocessionAmount,
          currency: account.base_currency
        })
        .select()
        .single()

      if (!retroError) {
        retrocessions.push(retrocession)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        fee: newFee,
        retrocessions: retrocessions,
        message: 'Fee calculated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Fee calculation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
