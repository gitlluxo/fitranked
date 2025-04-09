// FitRanked Web App Code with Coaching, Streaks, XP, and Charts

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// 👇 Replace with your actual Supabase project info:
const supabase = createClient('https://sgrhzwdlquodmgjosswc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncmh6d2RscXVvZG1nam9zc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjg5MDgsImV4cCI6MjA1OTc0NDkwOH0.hG2vkjcuVnXl7w3O-qcwmvVH4zqVVcvTbIqqoomgexU');

const coachingPlans = {
  'Bronze I': [
    { name: 'Bicep Curl', sets: 3, reps: 8, weight: 20 },
    { name: 'Crunches', sets: 3, reps: 15, weight: 0 },
    { name: 'Plank', sets: 2, reps: 0, duration: 20 }
  ],
  'Bronze II': [
    { name: 'Bicep Curl', sets: 3, reps: 10, weight: 20 },
    { name: 'Crunches', sets: 3, reps: 20, weight: 0 },
    { name: 'Plank', sets: 3, reps: 0, duration: 30 }
  ],
  'Bronze III': [
    { name: 'Hammer Curl', sets: 3, reps: 10, weight: 20 },
    { name: 'Leg Raises', sets: 3, reps: 15, weight: 0 },
    { name: 'Plank', sets: 3, reps: 0, duration: 40 }
  ]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [dark, setDark] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        setProfile(data);
      });
      fetchXPData(user.id);
    }
  }, [user]);

  const fetchXPData = async (userId) => {
    const { data } = await supabase
      .from('workouts')
      .select('date,total_xp')
      .eq('user_id', userId)
      .order('date');

    if (data) {
      const labels = data.map(item => item.date);
      const values = data.map(item => item.total_xp);
      setChartData({
        labels,
        datasets: [
          {
            label: 'XP Over Time',
            data: values,
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99,102,241,0.2)',
            fill: true
          }
        ]
      });
    }
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Check your email to confirm sign-up.');
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setUser(data.user);
  };

  const logWorkout = async (plan) => {
    let totalXp = 0;
    for (const ex of plan) {
      const repsTotal = ex.reps * (ex.sets || 1);
      const base = ex.duration ? ex.duration * 1.5 : repsTotal * (ex.weight / 10);
      totalXp += Math.round(base);
    }

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const isStreak = profile?.last_active === yesterday;
    const newStreak = isStreak ? profile.streak + 1 : 1;

    await supabase.from('workouts').insert({
      user_id: user.id,
      total_xp: totalXp,
      date: today
    });

    const newXP = profile.current_xp + totalXp;
    const rank =
      newXP >= 5000 ? 'Bronze V' :
      newXP >= 3000 ? 'Bronze IV' :
      newXP >= 1500 ? 'Bronze III' :
      newXP >= 500 ? 'Bronze II' : 'Bronze I';

    await supabase.from('profiles').update({
      current_xp: newXP,
      rank,
      streak: newStreak,
      last_active: today
    }).eq('id', user.id);

    setProfile({ ...profile, current_xp: newXP, rank, streak: newStreak, last_active: today });
    setMessage(`Workout complete! Earned ${totalXp} XP.`);
    fetchXPData(user.id);
  };

  const toggleTheme = () => setDark(!dark);

  if (!user) {
    return (
      <div className={dark ? 'bg-gray-900 text-white min-h-screen p-6' : 'bg-white text-black min-h-screen p-6'}>
        <h1 className="text-3xl font-bold mb-4">Fit Ranked</h1>
        <button onClick={toggleTheme} className="mb-4">Toggle Theme</button>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="block mb-2" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="block mb-2" />
        <button onClick={signIn} className="bg-blue-500 px-4 py-2 text-white rounded mr-2">Log In</button>
        <button onClick={signUp} className="bg-green-500 px-4 py-2 text-white rounded">Sign Up</button>
        {message && <p className="mt-2 text-red-400">{message}</p>}
      </div>
    );
  }

  return (
    <div className={dark ? 'bg-gray-900 text-white min-h-screen p-6' : 'bg-white text-black min-h-screen p-6'}>
      <h1 className="text-3xl font-bold mb-4">🏋️ Fit Ranked</h1>
      <button onClick={toggleTheme} className="mb-4">Toggle Theme</button>
      <p><strong>Rank:</strong> {profile?.rank} — <strong>XP:</strong> {profile?.current_xp}</p>
      <p><strong>🔥 Streak:</strong> {profile?.streak || 0} days</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Today's Coaching Plan ({profile?.rank})</h2>
        <ul className="mb-4">
          {coachingPlans[profile?.rank]?.map((ex, idx) => (
            <li key={idx}>
              {ex.name} — {ex.sets || 1} sets x {ex.reps || ex.duration} {ex.reps ? 'reps' : 'sec'} @ {ex.weight || 0} lbs
            </li>
          )) || <li>No plan for this rank.</li>}
        </ul>
        <button onClick={() => logWorkout(coachingPlans[profile?.rank])} className="bg-purple-600 px-4 py-2 rounded">Complete Workout</button>
        {message && <p className="mt-2 text-green-400">{message}</p>}
      </div>
      {chartData && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Progress</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}
