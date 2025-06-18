
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

    const { client_id, account_id, check_type = 'all' } = await req.json()

    // Get user and verify access
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const complianceIssues = []
    const tasksCreated = []

    // Check KYC compliance
    if (check_type === 'all' || check_type === 'kyc') {
      if (client_id) {
        const { data: client } = await supabaseClient
          .from('clients')
          .select('id, kyc_status, updated_at, first_name, last_name')
          .eq('id', client_id)
          .single()

        if (client) {
          if (client.kyc_status !== 'approved') {
            complianceIssues.push({
              type: 'kyc',
              severity: 'high',
              message: `KYC status is ${client.kyc_status} for ${client.first_name} ${client.last_name}`,
              client_id: client.id
            })

            // Create compliance task
            const { data: task } = await supabaseClient
              .from('compliance_tasks')
              .insert({
                client_id: client.id,
                title: 'KYC Documentation Required',
                description: `Complete KYC documentation for ${client.first_name} ${client.last_name}`,
                task_type: 'kyc_review',
                priority: 'high',
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days
                created_by: user.id
              })
              .select()
              .single()

            if (task) {
              tasksCreated.push(task)
            }
          }

          // Check for annual review
          const lastUpdate = new Date(client.updated_at)
          const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          
          if (lastUpdate < yearAgo) {
            complianceIssues.push({
              type: 'annual_review',
              severity: 'medium',
              message: `Annual review due for ${client.first_name} ${client.last_name}`,
              client_id: client.id
            })

            const { data: reviewTask } = await supabaseClient
              .from('compliance_tasks')
              .insert({
                client_id: client.id,
                title: 'Annual Client Review',
                description: `Conduct annual review for ${client.first_name} ${client.last_name}`,
                task_type: 'annual_review',
                priority: 'medium',
                due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
                created_by: user.id
              })
              .select()
              .single()

            if (reviewTask) {
              tasksCreated.push(reviewTask)
            }
          }
        }
      }
    }

    // Check position concentration limits
    if (check_type === 'all' || check_type === 'concentration') {
      if (account_id) {
        const { data: positions } = await supabaseClient
          .from('positions')
          .select(`
            id, quantity, market_value,
            securities(symbol, name, sector)
          `)
          .eq('account_id', account_id)
          .gt('quantity', 0)

        if (positions && positions.length > 0) {
          const totalValue = positions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
          
          // Check individual position concentration (>20%)
          positions.forEach(position => {
            const concentration = (position.market_value || 0) / totalValue
            if (concentration > 0.20) {
              complianceIssues.push({
                type: 'concentration',
                severity: 'medium',
                message: `High concentration (${(concentration * 100).toFixed(1)}%) in ${position.securities?.symbol}`,
                account_id: account_id
              })
            }
          })

          // Check sector concentration
          const sectorMap = new Map()
          positions.forEach(position => {
            const sector = position.securities?.sector || 'Unknown'
            const currentValue = sectorMap.get(sector) || 0
            sectorMap.set(sector, currentValue + (position.market_value || 0))
          })

          sectorMap.forEach((value, sector) => {
            const concentration = value / totalValue
            if (concentration > 0.30) {
              complianceIssues.push({
                type: 'sector_concentration',
                severity: 'low',
                message: `High sector concentration (${(concentration * 100).toFixed(1)}%) in ${sector}`,
                account_id: account_id
              })
            }
          })
        }
      }
    }

    // Check document expiry
    if (check_type === 'all' || check_type === 'documents') {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      
      const { data: expiringDocs } = await supabaseClient
        .from('documents')
        .select('id, title, expiry_date, client_id, account_id')
        .not('expiry_date', 'is', null)
        .lte('expiry_date', thirtyDaysFromNow.toISOString().split('T')[0])
        .eq('document_status', 'approved')

      if (expiringDocs && expiringDocs.length > 0) {
        expiringDocs.forEach(doc => {
          complianceIssues.push({
            type: 'document_expiry',
            severity: 'medium',
            message: `Document "${doc.title}" expires on ${doc.expiry_date}`,
            client_id: doc.client_id,
            account_id: doc.account_id
          })

          // Create renewal task
          supabaseClient
            .from('compliance_tasks')
            .insert({
              client_id: doc.client_id,
              account_id: doc.account_id,
              title: 'Document Renewal Required',
              description: `Renew document: ${doc.title}`,
              task_type: 'document_renewal',
              priority: 'medium',
              due_date: doc.expiry_date,
              created_by: user.id
            })
            .then(({ data: renewalTask }) => {
              if (renewalTask) {
                tasksCreated.push(renewalTask)
              }
            })
        })
      }
    }

    // Check overdue tasks
    if (check_type === 'all' || check_type === 'tasks') {
      const today = new Date().toISOString().split('T')[0]
      
      const { error: overdueError } = await supabaseClient
        .from('compliance_tasks')
        .update({ status: 'overdue' })
        .lt('due_date', today)
        .eq('status', 'pending')

      if (!overdueError) {
        const { data: overdueTasks } = await supabaseClient
          .from('compliance_tasks')
          .select('id, title, due_date')
          .eq('status', 'overdue')

        if (overdueTasks && overdueTasks.length > 0) {
          complianceIssues.push({
            type: 'overdue_tasks',
            severity: 'high',
            message: `${overdueTasks.length} compliance tasks are overdue`,
            details: overdueTasks
          })
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        compliance_issues: complianceIssues,
        tasks_created: tasksCreated,
        summary: {
          total_issues: complianceIssues.length,
          high_severity: complianceIssues.filter(i => i.severity === 'high').length,
          medium_severity: complianceIssues.filter(i => i.severity === 'medium').length,
          low_severity: complianceIssues.filter(i => i.severity === 'low').length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Compliance monitoring error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
