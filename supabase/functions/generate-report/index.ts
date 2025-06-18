
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const { 
      clientId, 
      accountId, 
      startDate, 
      endDate, 
      reportType, 
      format = 'pdf' 
    } = await req.json()

    // Get user ID for authentication
    const authHeader = req.headers.get('Authorization')
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader?.replace('Bearer ', '') || '')
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Generating ${reportType} report for user ${user.id}`)

    // Generate report data based on type
    let reportData: any = {}

    if (reportType === 'portfolio') {
      // Get portfolio positions
      const { data: positions } = await supabaseClient
        .from('positions')
        .select(`
          *,
          securities(symbol, name, currency),
          accounts!inner(
            account_name,
            clients!inner(first_name, last_name, client_code)
          )
        `)
        .eq(accountId ? 'account_id' : 'accounts.client_id', accountId || clientId)
        .gt('quantity', 0)

      reportData = {
        type: 'Portfolio Report',
        positions: positions || [],
        totalValue: positions?.reduce((sum, pos) => sum + (pos.market_value || 0), 0) || 0,
        generatedAt: new Date().toISOString()
      }
    }

    if (reportType === 'performance') {
      // Get performance data (trades, returns, etc.)
      const { data: trades } = await supabaseClient
        .from('trades')
        .select(`
          *,
          securities(symbol, name),
          accounts!inner(
            account_name,
            clients!inner(first_name, last_name)
          )
        `)
        .eq(accountId ? 'account_id' : 'accounts.client_id', accountId || clientId)
        .gte('trade_date', startDate)
        .lte('trade_date', endDate)

      reportData = {
        type: 'Performance Report',
        period: { startDate, endDate },
        trades: trades || [],
        totalTrades: trades?.length || 0,
        generatedAt: new Date().toISOString()
      }
    }

    if (reportType === 'compliance') {
      // Get compliance data
      const { data: tasks } = await supabaseClient
        .from('compliance_tasks')
        .select(`
          *,
          clients(first_name, last_name, client_code),
          accounts(account_name)
        `)
        .eq(clientId ? 'client_id' : 'account_id', clientId || accountId)

      reportData = {
        type: 'Compliance Report',
        tasks: tasks || [],
        generatedAt: new Date().toISOString()
      }
    }

    // Mock report generation - in production, use a PDF library or external service
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const downloadUrl = `https://your-storage-service.com/reports/${reportId}.${format}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    console.log('Report generated:', { reportId, downloadUrl, expiresAt })

    // In a real implementation, you would:
    // 1. Generate the actual report file (PDF, Excel, CSV)
    // 2. Upload to cloud storage (AWS S3, Google Cloud Storage)
    // 3. Return the download URL

    return new Response(
      JSON.stringify({ 
        report: {
          reportId,
          downloadUrl,
          expiresAt
        },
        message: 'Report generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Report generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
