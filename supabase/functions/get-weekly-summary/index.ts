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

  const [nutritionRes, healthRes, bodyMetricsRes, sleepRes] = await Promise.all([
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
    fetch(`${supabaseUrl}/rest/v1/rpc/fetch_user_body_metrics`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id_param: user_id }),
    }),
    fetch(`${supabaseUrl}/rest/v1/sleep_data?user_id=eq.${user_id}&start_time=gte.${rangeStart}&end_time=lte.${rangeEnd}&order=start_time.asc`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }),
  ]);
  
  

  const nutrition = await nutritionRes.json();
  const health = await healthRes.json();
  const body_metrics = await bodyMetricsRes.json();
  const sleep = await sleepRes.json();

  let totalSleepHours = 0;
let sleepDays = 0;

sleep.forEach(entry => {
  if (entry.duration_hours && entry.duration_hours > 0) {
    totalSleepHours += entry.duration_hours;
    sleepDays += 1;
  }
});

const averageSleepMinutes = sleepDays > 0
  ? Math.round((totalSleepHours / sleepDays) * 60)
  : 0;


  // ----- XP bonus for hitting protein goal -----
const proteinGoal = 120;
let proteinGoalDays = 0;
const seenDates = new Set();

nutrition.forEach(entry => {
  const day = new Date(entry.timestamp).toISOString().split("T")[0];
  if (!seenDates.has(day) && entry.protein >= proteinGoal) {
    seenDates.add(day);
    proteinGoalDays += 1;
  }
});

const bonusXpAwarded = proteinGoalDays >= 4 ? 25 : 0;

if (bonusXpAwarded > 0) {
  await fetch(`${supabaseUrl}/rest/v1/rpc/increment_xp`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id_input: user_id,
      xp_amount: bonusXpAwarded
    })
  });
}


return new Response(JSON.stringify({
    nutrition,
    health,
    body_metrics,
    start: rangeStart,
    end: rangeEnd,
    proteinGoalDays,
    bonusXpAwarded,
    averageSleepMinutes
  }), {
    headers: { "Content-Type": "application/json" }
  });
}); 



