import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { trade } = await req.json();

    // Validate trade data
    if (
      !trade.account_id ||
      !trade.security_id ||
      !trade.quantity ||
      !trade.trade_type
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required trade fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate trade type
    const validTradeTypes = [
      "buy",
      "sell",
      "transfer_in",
      "transfer_out",
      "dividend",
      "fee",
    ];
    if (!validTradeTypes.includes(trade.trade_type)) {
      return new Response(JSON.stringify({ error: "Invalid trade type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user ID
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if account exists and user has access
    const { data: account, error: accountError } = await supabaseClient
      .from("accounts")
      .select("id, client_id, account_status")
      .eq("id", trade.account_id)
      .single();

    if (accountError || !account) {
      return new Response(
        JSON.stringify({ error: "Account not found or no access" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (account.account_status !== "active") {
      return new Response(JSON.stringify({ error: "Account is not active" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate security exists
    const { data: security, error: securityError } = await supabaseClient
      .from("securities")
      .select("id, symbol, currency, is_active")
      .eq("id", trade.security_id)
      .single();

    if (securityError || !security || !security.is_active) {
      return new Response(
        JSON.stringify({ error: "Invalid or inactive security" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Calculate trade amounts
    const price = trade.price || 0;
    const quantity = parseFloat(trade.quantity);
    const grossAmount = price * quantity;
    const commission = trade.commission || grossAmount * 0.001; // 0.1% default commission
    const fees = trade.fees || 0;
    const tax = trade.tax || 0;
    const netAmount =
      trade.trade_type === "buy"
        ? grossAmount + commission + fees + tax
        : grossAmount - commission - fees - tax;

    // Insert trade record
    const { data: newTrade, error: tradeError } = await supabaseClient
      .from("trades")
      .insert({
        account_id: trade.account_id,
        security_id: trade.security_id,
        trade_date: trade.trade_date || new Date().toISOString().split("T")[0],
        settlement_date: trade.settlement_date,
        trade_type: trade.trade_type,
        quantity: quantity,
        price: price,
        gross_amount: grossAmount,
        commission: commission,
        fees: fees,
        tax: tax,
        net_amount: netAmount,
        currency: trade.currency || security.currency,
        exchange_rate: trade.exchange_rate || 1,
        trade_status: "pending",
        reference_number: trade.reference_number,
        counterparty: trade.counterparty,
        notes: trade.notes,
        created_by: user.id,
      })
      .select()
      .single();

    if (tradeError) {
      console.error("Trade creation error:", tradeError);
      return new Response(
        JSON.stringify({
          error: "Failed to create trade",
          details: tradeError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Auto-settle if requested
    if (trade.auto_settle) {
      const { error: settleError } = await supabaseClient
        .from("trades")
        .update({
          trade_status: "settled",
          settlement_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", newTrade.id);

      if (settleError) {
        console.error("Settlement error:", settleError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        trade: newTrade,
        message: "Trade processed successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Trade processing error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
