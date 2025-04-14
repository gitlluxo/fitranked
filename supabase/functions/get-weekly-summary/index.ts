import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { user_id } = await req.json();

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - ((now.getDay() + 1) % 7)); // Sunday 12:00 AM
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999); // Saturday 11:59 PM

  const rangeStart = start.toISOString();
  const rangeEnd = end.toISOString();

  const [nutritionRes, healthRes] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/nutrition_data?user_id=eq.${user_id}&timestamp=gte.${rangeStart}&timestamp=lte.${rangeEnd}&order=timestamp.asc`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }),
    fetch(`${supabaseUrl}/rest/v1/health_data?user_id=eq.${user_id}&timestamp=gte.${rangeStart}&timestamp=lte.${rangeEnd}&order=timestamp.asc`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }),
  ]);

  const nutrition = await nutritionRes.json();
  const health = await healthRes.json();

  return new Response(JSON.stringify({
    nutrition,
    health,
    start: rangeStart,
    end: rangeEnd
  }), {
    headers: { "Content-Type": "application/json" }
  });
});
