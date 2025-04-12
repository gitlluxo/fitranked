// supabase/functions/get-user-health/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  const { user_id } = await req.json()

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/fetch_user_health`, {
    method: "POST",
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user_id_param: user_id })

  })

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  })
})
