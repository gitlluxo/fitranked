import { supabase } from './supabaseClient';
import React, { useState, useEffect } from 'react';

const tierColors = {
  Bronze: '#cd7f32',
  Silver: '#95a5a6',
  Gold: '#f1c40f',
  Platinum: '#1ABC9C',
  Diamond: '#3498DB'
};

// Full workout plans for all ranks (Bronze I to Diamond III), including XP needed for each next rank.
const RANKS = [
  // [... the full RANKS data remains here, unchanged for brevity]
];

function App() {
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  const [viewRankIndex, setViewRankIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [repInputs, setRepInputs] = useState([]);
  const [rankUpMessage, setRankUpMessage] = useState("");

  useEffect(() => {
    const exercises = RANKS[viewRankIndex].workouts[selectedDayIndex].exercises;
    setRepInputs(Array(exercises.length).fill(0));
  }, [viewRankIndex, selectedDayIndex]);

  useEffect(() => {
    const loadProgress = async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', 'ethan')
        .single();

      if (data) {
        setXp(data.current_xp);
        const rankIndex = RANKS.findIndex(rank => rank.name === data.current_rank);
        if (rankIndex !== -1) {
          setCurrentRankIndex(rankIndex);
          setViewRankIndex(rankIndex);
        }
      }
    };
    loadProgress();
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: 'ethan',
          current_xp: xp,
          current_rank: RANKS[currentRankIndex].name
        });

      if (error) console.error('Failed to save progress:', error);
    };
    saveProgress();
  }, [xp, currentRankIndex]);

  const handleComplete = () => {
    if (viewRankIndex !== currentRankIndex) return;
    const xpGained = repInputs.reduce((total, reps) => total + reps, 0);
    if (xpGained <= 0) return;
    const oldRank = currentRankIndex;
    let newRank = currentRankIndex;
    let newXp = xp + xpGained;
    while (newRank < RANKS.length - 1 && RANKS[newRank].xpNeeded && newXp >= RANKS[newRank].xpNeeded) {
      newRank++;
    }
    setXp(newXp);
    if (newRank !== oldRank) {
      setCurrentRankIndex(newRank);
      setViewRankIndex(newRank);
      setSelectedDayIndex(0);
      setRankUpMessage(`🎉 Congratulations! You've reached ${RANKS[newRank].name}!`);
    } else {
      setRankUpMessage("");
    }
    setRepInputs(Array(repInputs.length).fill(0));
  };

  let progressPercent = 100;
  if (RANKS[currentRankIndex].xpNeeded) {
    const prevThreshold = currentRankIndex === 0 ? 0 : RANKS[currentRankIndex - 1].xpNeeded;
    progressPercent = Math.floor(((xp - prevThreshold) / (RANKS[currentRankIndex].xpNeeded - prevThreshold)) * 100);
    if (progressPercent > 100) progressPercent = 100;
  }

  const currentTier = RANKS[currentRankIndex].name.split(' ')[0];
  const nextRankName = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1].name : null;

  return (
    <>
      <style>{`
        body {
          background: #f9f9f9;
          margin: 0;
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 5px;
        }
        h2 {
          text-align: center;
          margin-top: 0;
          font-size: 1.2em;
        }
        .rank-up-message {
          text-align: center;
          color: #28a745;
          font-weight: bold;
          margin: 10px 0;
        }
        .xp-bar {
          margin: 20px 0;
        }
        .xp-info {
          text-align: center;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .progress-container {
          background: #ddd;
          border-radius: 10px;
          overflow: hidden;
          height: 20px;
          width: 100%;
        }
        .progress-fill {
          height: 100%;
          width: ${progressPercent}%;
          background-color: ${tierColors[currentTier]};
          transition: width 0.3s;
        }
        .selectors {
          margin-bottom: 20px;
        }
        .rank-selector {
          margin: 5px 0;
          text-align: center;
        }
        .rank-select {
          margin-left: 5px;
          padding: 5px;
          border: 1px solid #aaa;
          border-radius: 4px;
        }
        .day-selector {
          text-align: center;
          margin: 10px 0;
        }
        .day-selector span {
          margin-right: 8px;
          font-weight: bold;
        }
        .day-button {
          padding: 5px 10px;
          margin: 2px;
          border: 1px solid #aaa;
          border-radius: 4px;
          background: #f0f0f0;
          cursor: pointer;
        }
        .day-button:hover {
          background: #e0e0e0;
        }
        .active-day {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
        }
        .active-day:hover {
          background: #007bff;
        }
        .workout-plan h3 {
          margin: 15px 0 10px;
          font-size: 1.1em;
          text-align: center;
        }
        .exercise-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin: 5px 0;
        }
        .exercise-line span {
          flex: 1 1 60%;
          margin-right: 10px;
        }
        .exercise-line input {
          flex: 1 1 30%;
          max-width: 60px;
          margin-left: auto;
          padding: 3px;
          border: 1px solid #aaa;
          border-radius: 4px;
          text-align: center;
        }
        .complete-btn {
          display: block;
          width: 100%;
          margin: 15px 0;
          padding: 10px;
          background: #007bff;
          color: #fff;
          font-size: 1em;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .complete-btn:hover {
          background: #0069d9;
        }
      `}</style>

      <div className="container">
        <h1>FitRanked</h1>
        <h2>Current Rank: {RANKS[currentRankIndex].name}</h2>
        {rankUpMessage && <div className="rank-up-message">{rankUpMessage}</div>}

        <div className="xp-bar">
          <div className="xp-info">
            {xp} {RANKS[currentRankIndex].xpNeeded ? <>/ {RANKS[currentRankIndex].xpNeeded} XP</> : <> XP</>}
            {RANKS[currentRankIndex].xpNeeded ? <> (Next: {nextRankName})</> : <> (Max Rank)</>}
          </div>
          <div className="progress-container">
            <div className="progress-fill"></div>
          </div>
        </div>

        <div className="selectors">
          <div className="rank-selector">
            <label htmlFor="rankSelect">View Rank Plan:</label>
            <select id="rankSelect" className="rank-select" value={viewRankIndex} onChange={(e) => {
              setViewRankIndex(Number(e.target.value));
              setSelectedDayIndex(0);
            }}>
              {RANKS.map((rank, i) => (
                <option value={i} key={i}>{rank.name}</option>
              ))}
            </select>
          </div>

          <div className="day-selector">
            <span>Day:</span>
            {RANKS[viewRankIndex].workouts.map((_, i) => (
              <button
                key={i}
                type="button"
                className={"day-button " + (i === selectedDayIndex ? 'active-day' : '')}
                onClick={() => setSelectedDayIndex(i)}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="workout-plan">
          <h3>{RANKS[viewRankIndex].name} &mdash; {RANKS[viewRankIndex].workouts[selectedDayIndex].day}</h3>
          <div className="exercises-list">
            {RANKS[viewRankIndex].workouts[selectedDayIndex].exercises.map((exercise, idx) => (
              <div className="exercise-line" key={idx}>
                <span>
                  {exercise.name} &mdash; {exercise.name === "Plank" ? `${exercise.target} sec` : `${exercise.target} reps`}
                </span>
                {viewRankIndex === currentRankIndex && (
                  <input
                    type="number"
                    min="0"
                    value={repInputs[idx] || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setRepInputs(prev => {
                        const updated = [...prev];
                        updated[idx] = isNaN(val) ? 0 : val;
                        return updated;
                      });
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {viewRankIndex === currentRankIndex && (
            <button className="complete-btn" onClick={handleComplete}>Complete Workout</button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
