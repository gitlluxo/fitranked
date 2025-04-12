import { supabase } from './supabaseClient';
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import NutritionChart from './components/NutritionChart';



const tierColors = {
  Bronze: '#cd7f32',
  Silver: '#95a5a6',
  Gold: '#f1c40f',
  Platinum: '#1ABC9C',
  Diamond: '#3498DB'
};

const PROTEIN_GOAL = 120; // grams
const MOVE_GOAL = 720; // active calories

const calculateRingProgress = (value, goal) => {
  const percent = Math.min(100, (value / goal) * 100);
  return Math.floor(percent);
};

const launchConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};


// Full workout plans for all ranks (Bronze I to Diamond III), including XP needed for each next rank.
const RANKS = [
  { name: "Bronze I", xpNeeded: 100, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 10 },
      { name: "Dips", target: 8 },
      { name: "Shoulder Taps", target: 10 },
      { name: "Plank Ups", target: 5 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 12 },
      { name: "Lunges", target: 10 },
      { name: "Glute Bridges", target: 10 },
      { name: "Calf Raises", target: 15 },
      { name: "Step-ups", target: 10 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 15 },
      { name: "Leg Raises", target: 8 },
      { name: "Russian Twists", target: 10 },
      { name: "Bicycle Crunches", target: 20 },
      { name: "Superman", target: 10 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 20 },
      { name: "Mountain Climbers", target: 15 },
      { name: "High Knees", target: 20 },
      { name: "Burpees", target: 5 },
      { name: "Jump Squats", target: 5 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 3 },
      { name: "Inverted Rows", target: 10 },
      { name: "Bicep Curls", target: 8 },
      { name: "Bird Dogs", target: 10 }
    ]}
  ]},
  { name: "Bronze II", xpNeeded: 250, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 12 },
      { name: "Dips", target: 10 },
      { name: "Shoulder Taps", target: 12 },
      { name: "Plank Ups", target: 7 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 14 },
      { name: "Lunges", target: 12 },
      { name: "Glute Bridges", target: 12 },
      { name: "Calf Raises", target: 17 },
      { name: "Step-ups", target: 12 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 17 },
      { name: "Leg Raises", target: 10 },
      { name: "Russian Twists", target: 12 },
      { name: "Bicycle Crunches", target: 22 },
      { name: "Superman", target: 12 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 22 },
      { name: "Mountain Climbers", target: 17 },
      { name: "High Knees", target: 22 },
      { name: "Burpees", target: 7 },
      { name: "Jump Squats", target: 7 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 5 },
      { name: "Inverted Rows", target: 12 },
      { name: "Bicep Curls", target: 10 },
      { name: "Bird Dogs", target: 12 }
    ]}
  ]},
  { name: "Bronze III", xpNeeded: 450, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 14 },
      { name: "Dips", target: 12 },
      { name: "Shoulder Taps", target: 14 },
      { name: "Plank Ups", target: 9 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 16 },
      { name: "Lunges", target: 14 },
      { name: "Glute Bridges", target: 14 },
      { name: "Calf Raises", target: 19 },
      { name: "Step-ups", target: 14 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 19 },
      { name: "Leg Raises", target: 12 },
      { name: "Russian Twists", target: 14 },
      { name: "Bicycle Crunches", target: 24 },
      { name: "Superman", target: 14 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 24 },
      { name: "Mountain Climbers", target: 19 },
      { name: "High Knees", target: 24 },
      { name: "Burpees", target: 9 },
      { name: "Jump Squats", target: 9 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 7 },
      { name: "Inverted Rows", target: 14 },
      { name: "Bicep Curls", target: 12 },
      { name: "Bird Dogs", target: 14 }
    ]}
  ]},
  { name: "Silver I", xpNeeded: 700, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 16 },
      { name: "Dips", target: 14 },
      { name: "Shoulder Taps", target: 16 },
      { name: "Plank Ups", target: 11 },
      { name: "Pike Push-ups", target: 6 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 18 },
      { name: "Lunges", target: 16 },
      { name: "Glute Bridges", target: 16 },
      { name: "Calf Raises", target: 21 },
      { name: "Step-ups", target: 16 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 21 },
      { name: "Leg Raises", target: 14 },
      { name: "Russian Twists", target: 16 },
      { name: "Bicycle Crunches", target: 26 },
      { name: "Superman", target: 16 },
      { name: "Plank", target: 30 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 26 },
      { name: "Mountain Climbers", target: 21 },
      { name: "High Knees", target: 26 },
      { name: "Burpees", target: 11 },
      { name: "Jump Squats", target: 11 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 9 },
      { name: "Inverted Rows", target: 16 },
      { name: "Bicep Curls", target: 14 },
      { name: "Bird Dogs", target: 16 },
      { name: "Chin-ups", target: 5 }
    ]}
  ]},
  { name: "Silver II", xpNeeded: 1000, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 18 },
      { name: "Dips", target: 16 },
      { name: "Shoulder Taps", target: 18 },
      { name: "Plank Ups", target: 13 },
      { name: "Pike Push-ups", target: 8 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 20 },
      { name: "Lunges", target: 18 },
      { name: "Glute Bridges", target: 18 },
      { name: "Calf Raises", target: 23 },
      { name: "Step-ups", target: 18 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 23 },
      { name: "Leg Raises", target: 16 },
      { name: "Russian Twists", target: 18 },
      { name: "Bicycle Crunches", target: 28 },
      { name: "Superman", target: 18 },
      { name: "Plank", target: 40 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 28 },
      { name: "Mountain Climbers", target: 23 },
      { name: "High Knees", target: 28 },
      { name: "Burpees", target: 13 },
      { name: "Jump Squats", target: 13 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 11 },
      { name: "Inverted Rows", target: 18 },
      { name: "Bicep Curls", target: 16 },
      { name: "Bird Dogs", target: 18 },
      { name: "Chin-ups", target: 7 }
    ]}
  ]},
  { name: "Silver III", xpNeeded: 1350, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 20 },
      { name: "Dips", target: 18 },
      { name: "Shoulder Taps", target: 20 },
      { name: "Plank Ups", target: 15 },
      { name: "Pike Push-ups", target: 10 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 22 },
      { name: "Lunges", target: 20 },
      { name: "Glute Bridges", target: 20 },
      { name: "Calf Raises", target: 25 },
      { name: "Step-ups", target: 20 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 25 },
      { name: "Leg Raises", target: 18 },
      { name: "Russian Twists", target: 20 },
      { name: "Bicycle Crunches", target: 30 },
      { name: "Superman", target: 20 },
      { name: "Plank", target: 50 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 30 },
      { name: "Mountain Climbers", target: 25 },
      { name: "High Knees", target: 30 },
      { name: "Burpees", target: 15 },
      { name: "Jump Squats", target: 15 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 13 },
      { name: "Inverted Rows", target: 20 },
      { name: "Bicep Curls", target: 18 },
      { name: "Bird Dogs", target: 20 },
      { name: "Chin-ups", target: 9 }
    ]}
  ]},
  { name: "Gold I", xpNeeded: 1750, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 22 },
      { name: "Dips", target: 20 },
      { name: "Shoulder Taps", target: 22 },
      { name: "Plank Ups", target: 17 },
      { name: "Pike Push-ups", target: 12 },
      { name: "Clap Push-ups", target: 5 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 24 },
      { name: "Lunges", target: 22 },
      { name: "Glute Bridges", target: 22 },
      { name: "Calf Raises", target: 27 },
      { name: "Step-ups", target: 22 },
      { name: "Jump Lunges", target: 10 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 27 },
      { name: "Leg Raises", target: 20 },
      { name: "Russian Twists", target: 22 },
      { name: "Bicycle Crunches", target: 32 },
      { name: "Superman", target: 22 },
      { name: "Plank", target: 60 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 32 },
      { name: "Mountain Climbers", target: 27 },
      { name: "High Knees", target: 32 },
      { name: "Burpees", target: 17 },
      { name: "Jump Squats", target: 17 },
      { name: "Skaters", target: 10 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 15 },
      { name: "Inverted Rows", target: 22 },
      { name: "Bicep Curls", target: 20 },
      { name: "Bird Dogs", target: 22 },
      { name: "Chin-ups", target: 11 }
    ]}
  ]},
  { name: "Gold II", xpNeeded: 2200, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 24 },
      { name: "Dips", target: 22 },
      { name: "Shoulder Taps", target: 24 },
      { name: "Plank Ups", target: 19 },
      { name: "Pike Push-ups", target: 14 },
      { name: "Clap Push-ups", target: 7 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 26 },
      { name: "Lunges", target: 24 },
      { name: "Glute Bridges", target: 24 },
      { name: "Calf Raises", target: 29 },
      { name: "Step-ups", target: 24 },
      { name: "Jump Lunges", target: 12 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 29 },
      { name: "Leg Raises", target: 22 },
      { name: "Russian Twists", target: 24 },
      { name: "Bicycle Crunches", target: 34 },
      { name: "Superman", target: 24 },
      { name: "Plank", target: 70 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 34 },
      { name: "Mountain Climbers", target: 29 },
      { name: "High Knees", target: 34 },
      { name: "Burpees", target: 19 },
      { name: "Jump Squats", target: 19 },
      { name: "Skaters", target: 12 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 17 },
      { name: "Inverted Rows", target: 24 },
      { name: "Bicep Curls", target: 22 },
      { name: "Bird Dogs", target: 24 },
      { name: "Chin-ups", target: 13 }
    ]}
  ]},
  { name: "Gold III", xpNeeded: 2700, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 26 },
      { name: "Dips", target: 24 },
      { name: "Shoulder Taps", target: 26 },
      { name: "Plank Ups", target: 21 },
      { name: "Pike Push-ups", target: 16 },
      { name: "Clap Push-ups", target: 9 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 28 },
      { name: "Lunges", target: 26 },
      { name: "Glute Bridges", target: 26 },
      { name: "Calf Raises", target: 31 },
      { name: "Step-ups", target: 26 },
      { name: "Jump Lunges", target: 14 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 31 },
      { name: "Leg Raises", target: 24 },
      { name: "Russian Twists", target: 26 },
      { name: "Bicycle Crunches", target: 36 },
      { name: "Superman", target: 26 },
      { name: "Plank", target: 80 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 36 },
      { name: "Mountain Climbers", target: 31 },
      { name: "High Knees", target: 36 },
      { name: "Burpees", target: 21 },
      { name: "Jump Squats", target: 21 },
      { name: "Skaters", target: 14 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 19 },
      { name: "Inverted Rows", target: 26 },
      { name: "Bicep Curls", target: 24 },
      { name: "Bird Dogs", target: 26 },
      { name: "Chin-ups", target: 15 }
    ]}
  ]},
  { name: "Platinum I", xpNeeded: 3250, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 28 },
      { name: "Dips", target: 26 },
      { name: "Shoulder Taps", target: 28 },
      { name: "Plank Ups", target: 23 },
      { name: "Pike Push-ups", target: 18 },
      { name: "Clap Push-ups", target: 11 },
      { name: "Diamond Push-ups", target: 15 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 30 },
      { name: "Lunges", target: 28 },
      { name: "Glute Bridges", target: 28 },
      { name: "Calf Raises", target: 33 },
      { name: "Step-ups", target: 28 },
      { name: "Jump Lunges", target: 16 },
      { name: "Bulgarian Split Squats", target: 10 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 33 },
      { name: "Leg Raises", target: 26 },
      { name: "Russian Twists", target: 28 },
      { name: "Bicycle Crunches", target: 38 },
      { name: "Superman", target: 28 },
      { name: "Plank", target: 90 },
      { name: "V-ups", target: 15 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 38 },
      { name: "Mountain Climbers", target: 33 },
      { name: "High Knees", target: 38 },
      { name: "Burpees", target: 23 },
      { name: "Jump Squats", target: 23 },
      { name: "Skaters", target: 16 },
      { name: "Tuck Jumps", target: 8 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 21 },
      { name: "Inverted Rows", target: 28 },
      { name: "Bicep Curls", target: 26 },
      { name: "Bird Dogs", target: 28 },
      { name: "Chin-ups", target: 17 }
    ]}
  ]},
  { name: "Platinum II", xpNeeded: 3850, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 30 },
      { name: "Dips", target: 28 },
      { name: "Shoulder Taps", target: 30 },
      { name: "Plank Ups", target: 25 },
      { name: "Pike Push-ups", target: 20 },
      { name: "Clap Push-ups", target: 13 },
      { name: "Diamond Push-ups", target: 17 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 32 },
      { name: "Lunges", target: 30 },
      { name: "Glute Bridges", target: 30 },
      { name: "Calf Raises", target: 35 },
      { name: "Step-ups", target: 30 },
      { name: "Jump Lunges", target: 18 },
      { name: "Bulgarian Split Squats", target: 12 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 35 },
      { name: "Leg Raises", target: 28 },
      { name: "Russian Twists", target: 30 },
      { name: "Bicycle Crunches", target: 40 },
      { name: "Superman", target: 30 },
      { name: "Plank", target: 100 },
      { name: "V-ups", target: 17 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 40 },
      { name: "Mountain Climbers", target: 35 },
      { name: "High Knees", target: 40 },
      { name: "Burpees", target: 25 },
      { name: "Jump Squats", target: 25 },
      { name: "Skaters", target: 18 },
      { name: "Tuck Jumps", target: 10 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 23 },
      { name: "Inverted Rows", target: 30 },
      { name: "Bicep Curls", target: 28 },
      { name: "Bird Dogs", target: 30 },
      { name: "Chin-ups", target: 19 }
    ]}
  ]},
  { name: "Platinum III", xpNeeded: 4500, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 32 },
      { name: "Dips", target: 30 },
      { name: "Shoulder Taps", target: 32 },
      { name: "Plank Ups", target: 27 },
      { name: "Pike Push-ups", target: 22 },
      { name: "Clap Push-ups", target: 15 },
      { name: "Diamond Push-ups", target: 19 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 34 },
      { name: "Lunges", target: 32 },
      { name: "Glute Bridges", target: 32 },
      { name: "Calf Raises", target: 37 },
      { name: "Step-ups", target: 32 },
      { name: "Jump Lunges", target: 20 },
      { name: "Bulgarian Split Squats", target: 14 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 37 },
      { name: "Leg Raises", target: 30 },
      { name: "Russian Twists", target: 32 },
      { name: "Bicycle Crunches", target: 42 },
      { name: "Superman", target: 32 },
      { name: "Plank", target: 110 },
      { name: "V-ups", target: 19 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 42 },
      { name: "Mountain Climbers", target: 37 },
      { name: "High Knees", target: 42 },
      { name: "Burpees", target: 27 },
      { name: "Jump Squats", target: 27 },
      { name: "Skaters", target: 20 },
      { name: "Tuck Jumps", target: 12 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 25 },
      { name: "Inverted Rows", target: 32 },
      { name: "Bicep Curls", target: 30 },
      { name: "Bird Dogs", target: 32 },
      { name: "Chin-ups", target: 21 }
    ]}
  ]},
  { name: "Diamond I", xpNeeded: 5200, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 34 },
      { name: "Dips", target: 32 },
      { name: "Shoulder Taps", target: 34 },
      { name: "Plank Ups", target: 29 },
      { name: "Pike Push-ups", target: 24 },
      { name: "Clap Push-ups", target: 17 },
      { name: "Diamond Push-ups", target: 21 },
      { name: "One-arm Push-ups", target: 5 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 36 },
      { name: "Lunges", target: 34 },
      { name: "Glute Bridges", target: 34 },
      { name: "Calf Raises", target: 39 },
      { name: "Step-ups", target: 34 },
      { name: "Jump Lunges", target: 22 },
      { name: "Bulgarian Split Squats", target: 16 },
      { name: "Pistol Squats", target: 5 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 39 },
      { name: "Leg Raises", target: 32 },
      { name: "Russian Twists", target: 34 },
      { name: "Bicycle Crunches", target: 44 },
      { name: "Superman", target: 34 },
      { name: "Plank", target: 120 },
      { name: "V-ups", target: 21 },
      { name: "Hanging Leg Raises", target: 10 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 44 },
      { name: "Mountain Climbers", target: 39 },
      { name: "High Knees", target: 44 },
      { name: "Burpees", target: 29 },
      { name: "Jump Squats", target: 29 },
      { name: "Skaters", target: 22 },
      { name: "Tuck Jumps", target: 14 },
      { name: "Burpee Pull-ups", target: 5 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 27 },
      { name: "Inverted Rows", target: 34 },
      { name: "Bicep Curls", target: 32 },
      { name: "Bird Dogs", target: 34 },
      { name: "Chin-ups", target: 23 },
      { name: "Muscle-ups", target: 3 }
    ]}
  ]},
  { name: "Diamond II", xpNeeded: 5950, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 36 },
      { name: "Dips", target: 34 },
      { name: "Shoulder Taps", target: 36 },
      { name: "Plank Ups", target: 31 },
      { name: "Pike Push-ups", target: 26 },
      { name: "Clap Push-ups", target: 19 },
      { name: "Diamond Push-ups", target: 23 },
      { name: "One-arm Push-ups", target: 7 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 38 },
      { name: "Lunges", target: 36 },
      { name: "Glute Bridges", target: 36 },
      { name: "Calf Raises", target: 41 },
      { name: "Step-ups", target: 36 },
      { name: "Jump Lunges", target: 24 },
      { name: "Bulgarian Split Squats", target: 18 },
      { name: "Pistol Squats", target: 7 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 41 },
      { name: "Leg Raises", target: 34 },
      { name: "Russian Twists", target: 36 },
      { name: "Bicycle Crunches", target: 46 },
      { name: "Superman", target: 36 },
      { name: "Plank", target: 130 },
      { name: "V-ups", target: 23 },
      { name: "Hanging Leg Raises", target: 12 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 46 },
      { name: "Mountain Climbers", target: 41 },
      { name: "High Knees", target: 46 },
      { name: "Burpees", target: 31 },
      { name: "Jump Squats", target: 31 },
      { name: "Skaters", target: 24 },
      { name: "Tuck Jumps", target: 16 },
      { name: "Burpee Pull-ups", target: 7 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 29 },
      { name: "Inverted Rows", target: 36 },
      { name: "Bicep Curls", target: 34 },
      { name: "Bird Dogs", target: 36 },
      { name: "Chin-ups", target: 25 },
      { name: "Muscle-ups", target: 5 }
    ]}
  ]},
  { name: "Diamond III", xpNeeded: null, workouts: [
    { day: "Day 1", exercises: [
      { name: "Push-ups", target: 38 },
      { name: "Dips", target: 36 },
      { name: "Shoulder Taps", target: 38 },
      { name: "Plank Ups", target: 33 },
      { name: "Pike Push-ups", target: 28 },
      { name: "Clap Push-ups", target: 21 },
      { name: "Diamond Push-ups", target: 25 },
      { name: "One-arm Push-ups", target: 9 }
    ]},
    { day: "Day 2", exercises: [
      { name: "Squats", target: 40 },
      { name: "Lunges", target: 38 },
      { name: "Glute Bridges", target: 38 },
      { name: "Calf Raises", target: 43 },
      { name: "Step-ups", target: 38 },
      { name: "Jump Lunges", target: 26 },
      { name: "Bulgarian Split Squats", target: 20 },
      { name: "Pistol Squats", target: 9 }
    ]},
    { day: "Day 3", exercises: [
      { name: "Crunches", target: 43 },
      { name: "Leg Raises", target: 36 },
      { name: "Russian Twists", target: 38 },
      { name: "Bicycle Crunches", target: 48 },
      { name: "Superman", target: 38 },
      { name: "Plank", target: 140 },
      { name: "V-ups", target: 25 },
      { name: "Hanging Leg Raises", target: 14 }
    ]},
    { day: "Day 4", exercises: [
      { name: "Jumping Jacks", target: 48 },
      { name: "Mountain Climbers", target: 43 },
      { name: "High Knees", target: 48 },
      { name: "Burpees", target: 33 },
      { name: "Jump Squats", target: 33 },
      { name: "Skaters", target: 26 },
      { name: "Tuck Jumps", target: 18 },
      { name: "Burpee Pull-ups", target: 9 }
    ]},
    { day: "Day 5", exercises: [
      { name: "Pull-ups", target: 31 },
      { name: "Inverted Rows", target: 38 },
      { name: "Bicep Curls", target: 36 },
      { name: "Bird Dogs", target: 38 },
      { name: "Chin-ups", target: 27 },
      { name: "Muscle-ups", target: 7 }
    ]}
  ]}
];

function App() {
  // State variables for current progress and viewing options
  const [currentRankIndex, setCurrentRankIndex] = useState(0);   // User's current rank index
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [viewRankIndex, setViewRankIndex] = useState(0);         // Currently viewed rank plan index
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("darkMode") === "true";
});
  // We’ll control day via currentDayIndex instead
  const selectedDayIndex = currentDayIndex;

  const [xp, setXp] = useState(0);                               // Current XP accumulated
  const [repInputs, setRepInputs] = useState([]);                // Input values for reps per exercise on current day
  const [rankUpMessage, setRankUpMessage] = useState("");        // Rank-up congratulatory message (if any)
  const [glowXpBar, setGlowXpBar] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [exerciseTotals, setExerciseTotals] = useState({});
  const [showBadges, setShowBadges] = useState(false);
  const [showHealthStats, setShowHealthStats] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [showNutritionStats, setShowNutritionStats] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);






useEffect(() => {
  const loadProgress = async () => {
    console.log("📦 Loading saved progress...");

    const { data, error } = await supabase
  .from('progress')
  .select('current_xp, current_rank, exercise_totals, current_day')
  .eq('user_id', '40f105cc-47d6-439a-9bad-4304386007e3')
  .single();


    if (error && error.code === 'PGRST116') {
      // Row doesn't exist yet, insert default one
      console.log("⚠️ No progress found, creating default row...");
      const { error: insertError } = await supabase.from('progress').insert({
        user_id: '40f105cc-47d6-439a-9bad-4304386007e3',
        current_xp: 0,
        current_rank: 0
      });

      if (insertError) {
        console.error("❌ Failed to insert new progress row:", insertError.message);
      } else {
        console.log("✅ Default progress row created.");
      }
   } else if (data) {
  console.log("✅ Loaded progress from Supabase:", data);
  setXp(data.current_xp);
  setCurrentRankIndex(data.current_rank);
  setViewRankIndex(data.current_rank);
  setCurrentDayIndex(data.current_day ?? 0);


  // 👇 Initialize exerciseTotals with empty totals for each exercise
  const totals = {};
  RANKS.forEach(rank => {
    rank.workouts.forEach(day => {
      day.exercises.forEach(ex => {
        if (!totals[ex.name]) totals[ex.name] = 0;
      });
    });
  });
  setExerciseTotals(data.exercise_totals || totals);


  setIsLoaded(true);
}

  };

  loadProgress();
const loadHealthData = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isoDate = today.toISOString();

  console.log("🔍 Fetching health data from Supabase...");

  const { data, error } = await supabase
    .from('health_data')
    .select('*')
    .eq('user_id', '40f105cc-47d6-439a-9bad-4304386007e3')
    .gte('timestamp', isoDate)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (error) {
    console.error('❌ Error fetching health data:', error.message);
  } else if (data && data.length > 0) {
    console.log("✅ Loaded health data:", data[0]);
    setHealthData(data[0]);
  } else {
    console.log('❓ No data found for today.');
  }
};



loadHealthData();
const loadNutritionData = async () => {
  console.log("🥗 Fetching nutrition data from Supabase...");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isoDate = today.toISOString();

  const { data, error } = await supabase
    .from('nutrition_data')
    .select('*')
    .eq('user_id', '40f105cc-47d6-439a-9bad-4304386007e3')
    .gte('timestamp', isoDate)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (error) {
    console.error("❌ Error fetching nutrition data:", error.message);
  } else if (data && data.length > 0) {
    console.log("✅ Loaded today's nutrition data:", data[0]);
    setNutritionData(data[0]);
  } else {
    console.log("❓ No nutrition data found for today.");
  }
};

loadNutritionData();

}, []);



  // Reset input fields whenever the viewed rank or day changes
  useEffect(() => {
    const exercises = RANKS[viewRankIndex].workouts[selectedDayIndex].exercises;
    setRepInputs(Array(exercises.length).fill(0));
  }, [viewRankIndex, selectedDayIndex]);
  
useEffect(() => {
  if (!isLoaded) return;

  const saveProgress = async () => {
    console.log('🔁 Trying to save to Supabase:', { xp, currentRankIndex, exerciseTotals });

    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: '40f105cc-47d6-439a-9bad-4304386007e3',
        current_xp: xp,
        current_rank: currentRankIndex,
        current_day: currentDayIndex,
        exercise_totals: exerciseTotals
      }, {
        onConflict: ['user_id']
      });

    if (error) {
      console.error('❌ Failed to save progress:', error.message);
    } else {
      console.log('✅ Successfully saved progress!');
    }
  };

  saveProgress();
}, [xp, currentRankIndex, currentDayIndex, exerciseTotals, isLoaded]);

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);


const handleComplete = () => {
  if (viewRankIndex !== currentRankIndex) return;

  const xpGained = repInputs.reduce((total, reps) => total + reps, 0);
  const newTotals = { ...exerciseTotals };
  const exercises = RANKS[viewRankIndex].workouts[selectedDayIndex].exercises;

  exercises.forEach((exercise, i) => {
    const reps = repInputs[i] || 0;
    const name = exercise.name;
    if (!newTotals[name]) newTotals[name] = 0;
    newTotals[name] += reps;
  });

  console.log("📊 Updated exerciseTotals:", newTotals);
  setExerciseTotals(newTotals);

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
  setCurrentDayIndex(0);
  setRankUpMessage(`🎉 Congratulations! You've reached ${RANKS[newRank].name}!`);
  setGlowXpBar(true);
  setTimeout(() => setGlowXpBar(false), 1000);
  launchConfetti();
} else {
  const totalDays = RANKS[currentRankIndex].workouts.length;
  const nextDay = (selectedDayIndex + 1) % totalDays;
  setCurrentDayIndex(nextDay);
  setRankUpMessage(""); // clear any previous message
}


  setRepInputs(Array(repInputs.length).fill(0));
};

// Handle logging only (no XP or day change)
const handleLogOnly = () => {
  if (viewRankIndex !== currentRankIndex) return;

  const newTotals = { ...exerciseTotals };
  const exercises = RANKS[viewRankIndex].workouts[selectedDayIndex].exercises;

  let xpGained = 0;
console.log("🔍 Calculating XP for Log Only...");

  exercises.forEach((exercise, i) => {
    const reps = repInputs[i] || 0;
    const name = exercise.name;
    if (!newTotals[name]) newTotals[name] = 0;
    newTotals[name] += reps;
    xpGained += reps;
    console.log("💥 XP to add from Log Only:", xpGained);

  });

  console.log("📊 Logged (XP but no advance):", newTotals);

    const oldRank = currentRankIndex;
  let newRank = currentRankIndex;
  let newXp = xp + xpGained;

  while (newRank < RANKS.length - 1 && RANKS[newRank].xpNeeded && newXp >= RANKS[newRank].xpNeeded) {
  newXp -= RANKS[newRank].xpNeeded;
  newRank++;
}


  setExerciseTotals(newTotals);
  setCurrentRankIndex(newRank);
  setViewRankIndex(newRank);
  setXp(newXp);
  setRepInputs(Array(repInputs.length).fill(0));

  if (newRank !== oldRank) {
    setCurrentDayIndex(0); // reset day progression on rank-up
    setRankUpMessage(`🎉 Congratulations! You've reached ${RANKS[newRank].name}!`);
    setGlowXpBar(true);
    setTimeout(() => setGlowXpBar(false), 1000);
    launchConfetti();
  } else {
    setRankUpMessage(""); // no message if no rank-up
  }

};

  // Calculate XP progress percentage for the current rank (for progress bar fill)
  let progressPercent = 100;
const currentXpNeeded = RANKS[currentRankIndex].xpNeeded;

if (currentXpNeeded) {
  progressPercent = Math.floor((xp / currentXpNeeded) * 100);
  if (progressPercent > 100) progressPercent = 100;
}


  // Determine current tier name (Bronze, Silver, Gold, etc.) for styling color
  const currentTier = RANKS[currentRankIndex].name.split(' ')[0];

  // Determine next rank name for display in XP info (if any)
  const nextRankName = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1].name : null;
  const canCompleteWorkout = () => {
  const exercises = RANKS[currentRankIndex].workouts[currentDayIndex].exercises;

  for (let i = 0; i < exercises.length; i++) {
    const required = exercises[i].target;
    const entered = repInputs[i] || 0;
    if (entered < required) return false;
  }

  return true;
};



  return (
    <>
      {/* Embedded basic CSS styling for the app */}
      <style>{`
  body {
    background: ${darkMode ? "#121212" : "#f9f9f9"};
    color: ${darkMode ? "#eee" : "#000"};
    margin: 0;
    font-family: Arial, sans-serif;
    transition: background 0.3s, color 0.3s;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
  }
  h1, h2 {
    text-align: center;
  }
  h2 {
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
    background: #555;
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
    background: ${darkMode ? "#333" : "#fff"};
    color: ${darkMode ? "#eee" : "#000"};
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
    background: ${darkMode ? "#333" : "#f0f0f0"};
    color: ${darkMode ? "#eee" : "#000"};
    cursor: pointer;
  }
  .day-button:hover {
    background: ${darkMode ? "#444" : "#e0e0e0"};
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
    background: ${darkMode ? "#222" : "white"};
    color: ${darkMode ? "#eee" : "#000"};
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

  @keyframes glow {
    0% {
      box-shadow: 0 0 10px 2px gold;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .glow-rankup {
    animation: glow 1s ease-out;
  }
`}</style>


      {/* Main Container for the app content */}
{!settingsOpen && (
  <button
    onClick={() => setSettingsOpen(true)}
    style={{
      position: "fixed",
      top: "15px",
      left: "10px",
      background: "transparent",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      zIndex: 1101
    }}
  >
    ☰
  </button>
)}





<div className="container">


      {settingsOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "250px",
      height: "100%",
      background: darkMode ? "#222" : "#f5f5f5",
      color: darkMode ? "white" : "black",
      padding: "20px",
      boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
      zIndex: 1000
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px" }}>
  <button
    onClick={() => setSettingsOpen(false)}
    style={{
      background: "transparent",
      border: "none",
      fontSize: "20px",
      cursor: "pointer"
    }}
  >
    ✖️
  </button>
  <h3 style={{ margin: 0 }}>Settings</h3>
</div>


    <div style={{ marginBottom: "15px" }}>
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => {
            setDarkMode(e.target.checked);
            localStorage.setItem("darkMode", e.target.checked);
          }}
        />
        &nbsp; Dark Mode
      </label>
    </div>
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to reset all progress?")) {
          setXp(0);
          setCurrentRankIndex(0);
          setViewRankIndex(0);
          setCurrentDayIndex(0);

          const resetTotals = {};
          RANKS.forEach(rank => {
            rank.workouts.forEach(day => {
              day.exercises.forEach(ex => {
                resetTotals[ex.name] = 0;
              });
            });
          });
          setExerciseTotals(resetTotals);
        }
      }}
      style={{
        backgroundColor: "#dc3545",
        color: "white",
        padding: "8px 12px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      Reset All Progress
    </button>
  </div>
)}

        {/* App Title and current rank display */}
        <h1>FitRanked</h1>
        

        <h2>Current Rank: {RANKS[currentRankIndex].name}</h2>
        {/* Rank-up message (displayed only when rank increases) */}
        {rankUpMessage && <div className="rank-up-message">{rankUpMessage}</div>}

 {/* XP Bar and Progress Info */}
<div className="xp-bar">
  <div className="xp-info">
    {xp}
    {RANKS[currentRankIndex].xpNeeded ? <> / {RANKS[currentRankIndex].xpNeeded} XP</> : <> XP</>}
    {RANKS[currentRankIndex].xpNeeded ? <> (Next: {nextRankName})</> : <> (Max Rank)</>}
  </div>
  <div className="progress-container">
    <div className={`progress-fill ${glowXpBar ? 'glow-rankup' : ''}`}></div>
  </div>
</div>

<div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "20px" }}>
  {/* 🔴 Move Ring (active calories) */}
  <div style={{ textAlign: "center" }}>
    <svg width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#ddd"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#ff3b30"
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${2 * Math.PI * 40}`}
        strokeDashoffset={`${
          2 * Math.PI * 40 *
          (1 - calculateRingProgress(healthData?.activeCalories ?? 0, MOVE_GOAL) / 100)
        }`}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="13"
        fill="#333"
      >
        {`${healthData?.activeCalories ?? 0}`}
      </text>
    </svg>
    <div style={{ marginTop: "4px", fontSize: "14px", fontWeight: "bold" }}>
      Move ({calculateRingProgress(healthData?.activeCalories ?? 0, MOVE_GOAL)}%)
    </div>
  </div>

  {/* 🟠 Protein Ring */}
  <div style={{ textAlign: "center" }}>
    <svg width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#ddd"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#ff9500"
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${2 * Math.PI * 40}`}
        strokeDashoffset={`${
          2 * Math.PI * 40 *
          (1 - calculateRingProgress(nutritionData?.protein ?? 0, PROTEIN_GOAL) / 100)
        }`}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="13"
        fill="#333"
      >
        {`${nutritionData?.protein ?? 0}g`}
      </text>
    </svg>
    <div style={{ marginTop: "4px", fontSize: "14px", fontWeight: "bold" }}>
      Protein ({calculateRingProgress(nutritionData?.protein ?? 0, PROTEIN_GOAL)}%)
    </div>
  </div>
</div>

{/*
<div style={{ marginTop: "30px" }}>
  <h3 style={{ textAlign: "center" }}>📊 Past 7 Days: Calories vs. Protein</h3>
  <NutritionChart
    data={[
      { date: "Mon", activeCalories: 430, protein: 75 },
      { date: "Tue", activeCalories: 580, protein: 92 },
      { date: "Wed", activeCalories: 300, protein: 45 },
      { date: "Thu", activeCalories: 720, protein: 128 },
      { date: "Fri", activeCalories: 610, protein: 103 },
      { date: "Sat", activeCalories: 690, protein: 117 },
      { date: "Sun", activeCalories: 400, protein: 65 }
    ]}
  />
</div>
*/}




<button
  onClick={() => setShowBadges(prev => !prev)}
  style={{
    display: "block",
    margin: "20px auto 10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  {showBadges ? "Hide Badges" : "Show Badges"}
</button>

<button
  onClick={() => setShowHealthStats(prev => !prev)}
  style={{
    display: "block",
    margin: "10px auto 10px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  {showHealthStats ? "Hide Apple Health Stats" : "Show Apple Health Stats"}
</button>
<button
  onClick={() => setShowNutritionStats(prev => !prev)}
  style={{
    display: "block",
    margin: "10px auto 10px",
    padding: "10px 20px",
    backgroundColor: "#ff6f61",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  {showNutritionStats ? "Hide Nutrition Stats" : "Show Nutrition Stats"}
</button>

<button
  onClick={() => window.open("https://chat.openai.com/g/g-67fa2535ad048191982ec452e7d79f51-fitranked-coach", "_blank")}
  style={{
    display: "block",
    margin: "10px auto",
    padding: "10px 20px",
    backgroundColor: "#6f42c1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  💬 Ask FitRanked Coach (GPT)
</button>


<div
  style={{
    maxHeight: showHealthStats ? "1000px" : "0px",
    opacity: showHealthStats ? 1 : 0,
    overflow: "hidden",
    pointerEvents: showHealthStats ? "auto" : "none",
    transition: "max-height 0.4s ease, opacity 0.3s ease",
    margin: showHealthStats ? "30px 0" : "0"
  }}
>
  <div>
    <h3 style={{ textAlign: "center", marginBottom: "10px" }}>🍏 Apple Health Stats</h3>
    {healthData ? (
      <div>
        <p><strong>Steps: </strong>{healthData.steps}</p>
        <p><strong>Active Calories: </strong>{healthData.activeCalories}</p>
        <p><strong>Move Goal: </strong>{healthData.moveGoal}</p>
        <p><strong>Last Synced: </strong>{new Date(healthData.timestamp).toLocaleString()}</p>
      </div>
    ) : (
      <p>Loading Apple Health data...</p>
    )}
  </div>
</div>

<div
  style={{
    maxHeight: showNutritionStats ? "1000px" : "0px",
    opacity: showNutritionStats ? 1 : 0,
    overflow: "hidden",
    pointerEvents: showNutritionStats ? "auto" : "none",
    transition: "max-height 0.4s ease, opacity 0.3s ease",
    margin: showNutritionStats ? "30px 0" : "0"
  }}
>
  <div>
    <h3 style={{ textAlign: "center", marginBottom: "10px" }}>🍽️ Nutrition Today</h3>
    {nutritionData ? (
  <div>
    <p><strong>Calories: </strong>{nutritionData.dietCalories ?? 0}</p>
    <p><strong>Protein: </strong>{nutritionData.protein ?? 0}g</p>
    <p><strong>Carbs: </strong>{nutritionData.carbs ?? 0}g</p>
    <p><strong>Fat: </strong>{nutritionData.fat ?? 0}g</p>
    <p><strong>Sugar: </strong>{nutritionData.sugar ?? 0}g</p>
    <p><strong>Last Synced: </strong>{new Date(nutritionData.timestamp).toLocaleString()}</p>
  </div>
) : (
  <p>Loading nutrition data...</p>
)}

  </div>
</div>

{/* Milestone Badge Progress Section */}
<div
  style={{
    maxHeight: showBadges ? "1000px" : "0px",
    opacity: showBadges ? 1 : 0,
    overflow: "hidden",
    pointerEvents: showBadges ? "auto" : "none",
    transition: "max-height 0.4s ease, opacity 0.3s ease",
    margin: showBadges ? "30px 0" : "0"
  }}
>
  <div>
    <h3 style={{ textAlign: "center", marginBottom: "10px" }}>🏅 Milestone Badges</h3>
    {Object.entries(exerciseTotals)
  .map(([exerciseName, totalReps]) => {
    let nextGoal = 50;
    let level = 0;

    if (totalReps >= 150) {
      level = 4;
      nextGoal = 200;
    } else if (totalReps >= 100) {
      level = 3;
      nextGoal = 150;
    } else if (totalReps >= 75) {
      level = 2;
      nextGoal = 100;
    } else if (totalReps >= 50) {
      level = 1;
      nextGoal = 75;
    }

    const percent = Math.min(100, Math.floor((totalReps / nextGoal) * 100));
    const remaining = Math.max(0, nextGoal - totalReps);

    return { exerciseName, totalReps, level, nextGoal, percent, remaining };
  })
  .sort((a, b) => a.remaining - b.remaining)
  .map(({ exerciseName, totalReps, level, nextGoal, percent }) => (
    <div key={exerciseName} style={{ marginBottom: "12px" }}>
      <strong>
  {exerciseName} Lv. {level} — {totalReps} / {nextGoal} ({percent}%)
</strong>

      <div style={{ height: "10px", background: "#ddd", borderRadius: "5px", overflow: "hidden" }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: "#007bff",
          transition: "width 0.3s"
        }} />
      </div>
    </div>
))}

  </div>
</div>






        {/* Rank selection and Day selection controls */}

          {/* Day Selector Buttons */}
          <div className="day-selector">
  <span>Day:</span>
  {RANKS[currentRankIndex].workouts.map((dayPlan, i) => (
  <button
    key={i}
    type="button"
    className={"day-button " + (i === currentDayIndex ? 'active-day' : '')}
    disabled
  >
    {i + 1}
  </button>
))}

</div>

        {/* Workout Plan Display for the selected rank and day */}
        <div className="workout-plan">
          <h3>
  {RANKS[currentRankIndex].name} &mdash; {RANKS[currentRankIndex].workouts[currentDayIndex].day}
</h3>
<div className="exercises-list">
  {RANKS[currentRankIndex].workouts[currentDayIndex].exercises.map((exercise, idx) => (
    <div className="exercise-line" key={idx}>
      <span>
        {exercise.name} &mdash; {exercise.name === "Plank" ? `${exercise.target} sec` : `${exercise.target} reps`}
      </span>
      <input
        type="number"
        min="0"
        value={repInputs[idx] || 0}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          setRepInputs(prevInputs => {
            const newInputs = [...prevInputs];
            newInputs[idx] = isNaN(val) ? 0 : val;
            return newInputs;
          });
        }}
      />
    </div>
  ))}
</div>

          {/* "Complete Workout" button appears only for current rank to gain XP */}
         {viewRankIndex === currentRankIndex && (
  <>
        <button
      className="complete-btn"
      onClick={handleComplete}
      disabled={!canCompleteWorkout()}
      style={{
        opacity: canCompleteWorkout() ? 1 : 0.5,
        cursor: canCompleteWorkout() ? "pointer" : "not-allowed"
      }}
    >
      ✅ Complete Workout
    </button>

    <button
      className="complete-btn"
      onClick={handleLogOnly}
      style={{ backgroundColor: "#6c757d" }}
    >
      📝 Log Only These Exercises
    </button>
  </>
)}

        </div>
        </div>
    </>
  );
}

export default App;
