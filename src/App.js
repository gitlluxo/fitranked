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
  const [viewRankIndex, setViewRankIndex] = useState(0);         // Currently viewed rank plan index
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);   // Selected day index for workout plan
  const [xp, setXp] = useState(0);                               // Current XP accumulated
  const [repInputs, setRepInputs] = useState([]);                // Input values for reps per exercise on current day
  const [rankUpMessage, setRankUpMessage] = useState("");        // Rank-up congratulatory message (if any)

useEffect(() => {
  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from('progress')
      .select('current_xp, current_rank')
      .eq('user_id', '40f105cc-47d6-439a-9bad-4304386007e3') // Replace with real user ID later
      .single();

    if (error) {
      console.error('Failed to fetch progress:', error);
    } else if (data) {
      setXp(data.current_xp);
      setCurrentRankIndex(data.current_rank);
      setViewRankIndex(data.current_rank);
    }
  };

  fetchProgress();
}, []);



  // Reset input fields whenever the viewed rank or day changes
  useEffect(() => {
    const exercises = RANKS[viewRankIndex].workouts[selectedDayIndex].exercises;
    setRepInputs(Array(exercises.length).fill(0));
  }, [viewRankIndex, selectedDayIndex]);
  
useEffect(() => {
  const saveProgress = async () => {
    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: '40f105cc-47d6-439a-9bad-4304386007e3', // Replace with real user ID later
        current_xp: xp,
        current_rank: currentRankIndex,
      });

    if (error) console.error('Failed to save progress:', error);
  };

  saveProgress();
}, [xp, currentRankIndex]);


  // Handle completing a workout day to gain XP
  const handleComplete = () => {
    // Only allow XP gain if the viewed rank is the user's current rank
    if (viewRankIndex !== currentRankIndex) return;
    // Calculate total XP gained as sum of reps entered
    const xpGained = repInputs.reduce((total, reps) => total + reps, 0);
    if (xpGained <= 0) return; // no XP gained if no reps entered
    const oldRank = currentRankIndex;
    let newRank = currentRankIndex;
    let newXp = xp + xpGained;
    // Check for rank-ups: if new XP meets or exceeds the threshold for the next rank, advance rank
    while (newRank < RANKS.length - 1 && RANKS[newRank].xpNeeded && newXp >= RANKS[newRank].xpNeeded) {
      newRank++;
    }
    setXp(newXp);
    if (newRank !== oldRank) {
      // If rank increased, update current rank and show rank-up message
      setCurrentRankIndex(newRank);
      setViewRankIndex(newRank);
      setSelectedDayIndex(0);
      setRankUpMessage(`🎉 Congratulations! You've reached ${RANKS[newRank].name}!`);
    } else {
      // No rank up, clear any previous messages
      setRankUpMessage("");
    }
    // Reset input fields (for repeating the workout or moving to next day)
    setRepInputs(Array(repInputs.length).fill(0));
  };

  // Calculate XP progress percentage for the current rank (for progress bar fill)
  let progressPercent = 100;
  if (RANKS[currentRankIndex].xpNeeded) {
    const prevThreshold = currentRankIndex === 0 ? 0 : RANKS[currentRankIndex - 1].xpNeeded;
    progressPercent = Math.floor(((xp - prevThreshold) / (RANKS[currentRankIndex].xpNeeded - prevThreshold)) * 100);
    if (progressPercent > 100) progressPercent = 100;
  }

  // Determine current tier name (Bronze, Silver, Gold, etc.) for styling color
  const currentTier = RANKS[currentRankIndex].name.split(' ')[0];

  // Determine next rank name for display in XP info (if any)
  const nextRankName = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1].name : null;

  return (
    <>
      {/* Embedded basic CSS styling for the app */}
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

      {/* Main Container for the app content */}
      <div className="container">
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
            <div className="progress-fill"></div>
          </div>
        </div>

        {/* Rank selection and Day selection controls */}
        <div className="selectors">
          {/* Rank Selector Dropdown */}
          <div className="rank-selector">
            <label htmlFor="rankSelect">View Rank Plan:</label>
            <select
              id="rankSelect"
              className="rank-select"
              value={viewRankIndex}
              onChange={(e) => {
                setViewRankIndex(Number(e.target.value));
                setSelectedDayIndex(0);
              }}
            >
              {RANKS.map((rank, i) => (
                <option value={i} key={i}>
                  {rank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Day Selector Buttons */}
          <div className="day-selector">
            <span>Day:</span>
            {RANKS[viewRankIndex].workouts.map((dayPlan, i) => (
              <button
                key={i}
                type="button"
                className={"day-button " + (i === selectedDayIndex ? 'active-day' : '')}
                onClick={() => setSelectedDayIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Plan Display for the selected rank and day */}
        <div className="workout-plan">
          <h3>
            {RANKS[viewRankIndex].name} &mdash; {RANKS[viewRankIndex].workouts[selectedDayIndex].day}
          </h3>
          <div className="exercises-list">
            {RANKS[viewRankIndex].workouts[selectedDayIndex].exercises.map((exercise, idx) => (
              <div className="exercise-line" key={idx}>
                <span>
                  {exercise.name} &mdash; {exercise.name === "Plank" ? `${exercise.target} sec` : `${exercise.target} reps`}
                </span>
                {/* Input field for reps appears only if viewing the current rank (to log progress) */}
                {viewRankIndex === currentRankIndex && (
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
                )}
              </div>
            ))}
          </div>
          {/* "Complete Workout" button appears only for current rank to gain XP */}
          {viewRankIndex === currentRankIndex && (
            <button className="complete-btn" onClick={handleComplete}>
              Complete Workout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
