
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

    const { action, symbols, symbol, startDate, endDate } = await req.json()

    // Get user ID for authentication
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'quotes') {
      // Mock market data service - replace with real API integration
      const quotes = symbols.map((sym: string) => ({
        symbol: sym,
        price: Math.random() * 100 + 50, // Mock price between 50-150
        change: (Math.random() - 0.5) * 10, // Mock change between -5 to +5
        changePercent: (Math.random() - 0.5) * 10, // Mock percentage change
        volume: Math.floor(Math.random() * 1000000), // Mock volume
        timestamp: new Date().toISOString(),
        currency: 'USD'
      }))

      return new Response(
        JSON.stringify({ quotes }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'historical') {
      // Mock historical data - replace with real API integration
      const prices = []
      const startDt = new Date(startDate)
      const endDt = new Date(endDate)
      let currentPrice = Math.random() * 100 + 50

      for (let dt = new Date(startDt); dt <= endDt; dt.setDate(dt.getDate() + 1)) {
        const dailyChange = (Math.random() - 0.5) * 5
        const open = currentPrice
        const close = currentPrice + dailyChange
        const high = Math.max(open, close) + Math.random() * 2
        const low = Math.min(open, close) - Math.random() * 2

        prices.push({
          date: dt.toISOString().split('T')[0],
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000)
        })

        currentPrice = close
      }

      return new Response(
        JSON.stringify({ prices }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Market data error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
