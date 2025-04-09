// FitRanked App: Gamified Arms & Abs Strength Program
// One-file implementation with XP system, rank tracking, and workout logging

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const XP_VALUES = {
  'Push-Ups': 6,
  'Sit-Ups': 4,
  'Curls': 1,
  'Dips': 4,
  'Plank (sec)': 0.1,
};

const RANKS = [
  { name: 'Bronze I', xp: 0 },
  { name: 'Bronze II', xp: 1500 },
  { name: 'Silver I', xp: 3000 },
  { name: 'Silver II', xp: 5000 },
  { name: 'Gold I', xp: 8000 },
  { name: 'Gold II', xp: 12000 },
  { name: 'Platinum I', xp: 17000 },
  { name: 'Platinum II', xp: 23000 },
  { name: 'Diamond', xp: 30000 },
];

export default function FitRankedApp() {
  const [totalXP, setTotalXP] = useState(0);
  const [entries, setEntries] = useState([]);
  const [feedback, setFeedback] = useState('');

  const [exercise, setExercise] = useState('Push-Ups');
  const [reps, setReps] = useState(0);

  const calculateRank = (xp) => {
    let currentRank = RANKS[0].name;
    for (let i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].xp) {
        currentRank = RANKS[i].name;
      } else {
        break;
      }
    }
    return currentRank;
  };

  const completeWorkout = () => {
    const baseXP = XP_VALUES[exercise] || 0;
    const gainedXP = Math.round(baseXP * parseFloat(reps));

    const newXP = totalXP + gainedXP;
    const newRank = calculateRank(newXP);
    const oldRank = calculateRank(totalXP);

    const entry = `${exercise}: ${reps} reps → ${gainedXP} XP earned`;
    setEntries([entry, ...entries]);
    setTotalXP(newXP);

    const levelUpMessage = newRank !== oldRank
      ? `🎉 You ranked up to ${newRank}!
💪 Total XP: ${newXP}`
      : `✅ Workout logged!
+${gainedXP} XP
Total XP: ${newXP} (${newRank})`;

    setFeedback(levelUpMessage);
    setReps(0);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">🎮 FitRanked Workout Tracker</h2>
          <div className="space-y-2">
            <label>Exercise</label>
            <select
              className="w-full border rounded p-2"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            >
              {Object.keys(XP_VALUES).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <label>Reps / Seconds</label>
            <Input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Enter reps or time"
            />

            <Button className="w-full" onClick={completeWorkout}>
              Complete Workout
            </Button>
          </div>

          <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-line">
            {feedback}
          </div>

          <div className="pt-4">
            <h3 className="font-bold">📜 Workout Log</h3>
            <ul className="list-disc list-inside space-y-1">
              {entries.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
