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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { accountId } = await req.json();

    console.log(
      "Updating portfolio values for account:",
      accountId || "all accounts",
    );

    // Get positions that need price updates
    let query = supabaseClient
      .from("positions")
      .select(
        `
        id,
        quantity,
        average_cost,
        securities!inner(id, symbol, current_price)
      `,
      )
      .gt("quantity", 0);

    if (accountId) {
      query = query.eq("account_id", accountId);
    }

    const { data: positions, error: positionsError } = await query;

    if (positionsError) {
      throw positionsError;
    }

    if (!positions || positions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No positions to update" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Update market values for each position
    const updates = positions.map((position) => {
      const currentPrice = position.securities.current_price || 0;
      const marketValue = position.quantity * currentPrice;
      const unrealizedPnL =
        marketValue - position.quantity * position.average_cost;

      return {
        id: position.id,
        market_value: marketValue,
        unrealized_pnl: unrealizedPnL,
        last_updated: new Date().toISOString(),
      };
    });

    // Batch update positions
    const { error: updateError } = await supabaseClient
      .from("positions")
      .upsert(updates, { onConflict: "id" });

    if (updateError) {
      throw updateError;
    }

    console.log(`Updated ${updates.length} positions`);

    return new Response(
      JSON.stringify({
        success: true,
        updatedPositions: updates.length,
        message: "Portfolio values updated successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Portfolio update error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
