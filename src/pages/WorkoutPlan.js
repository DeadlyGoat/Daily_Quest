import React, { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html, #root {
    width: 100%;
    height: 100%;
    font-family: 'Rajdhani', sans-serif;
  }
`;

const completePulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(0, 255, 136, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(0, 255, 136, 0.8); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(0, 255, 136, 0.4); }
`;

const workoutSchedule = {
  0: {
    name: "Sunday Workout (Cardio + Traps)",
    exercises: [
      "Run or brisk walk – 30 minutes",
      "Shrugs – 4 sets of 20",
      "Farmer’s Walks – 4 sets of 1 min",
      "Push-ups – 3 sets of 15"
    ]
  },
  1: { name: "Rest Day", exercises: [] },
  2: {
    name: "Tuesday Workout (Upper Body)",
    exercises: [
      "Push-ups – 4 sets of 15",
      "Pike push-ups – 3 sets of 12",
      "Pull-ups or rows – 3 sets to failure",
      "Shrugs – 4 sets of 20",
      "Bicep curls – 3 sets of 15"
    ]
  },
  3: {
    name: "Wednesday Workout (HIIT)",
    exercises: [
      "Burpees – 3 sets of 12",
      "Mountain climbers – 3 sets of 40 seconds",
      "Squats – 3 sets of 20",
      "Planks – 2 sets of 1 min"
    ]
  },
  4: {
    name: "Thursday Workout (Lower Body + Core)",
    exercises: [
      "Squats – 4 sets of 25",
      "Lunges – 3 sets of 15 per leg",
      "Calf raises – 4 sets of 30",
      "Shrugs – 3 sets of 20",
      "Planks – 3 sets of 1 min"
    ]
  },
  5: { name: "Rest Day", exercises: [] },
  6: {
    name: "Saturday Workout (Full Body + Traps)",
    exercises: [
      "Warm-up: 5 min jumping jacks",
      "Push-ups: 4 sets to failure",
      "Bodyweight squats: 4 sets of 25",
      "Pull-ups or inverted rows: 4 sets to failure",
      "Shrugs: 4 sets of 20",
      "Farmer’s Walks: 4 sets of 1 min",
      "Planks: 3 sets of 1 min",
      "Finisher: 50 burpees"
    ]
  }
};

const WorkoutPlan = () => {
  const today = new Date().getDay();
  const todayWorkout = workoutSchedule[today];
  const storageKey = `workout-${today}`;

  const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // If it's a rest day or all exercises are completed, mark workout as complete.
    if (todayWorkout.exercises.length === 0 || completedExercises.length === todayWorkout.exercises.length) {
      localStorage.setItem(`workoutCompleted-${today}`, "true");
    } else {
      localStorage.removeItem(`workoutCompleted-${today}`);
    }
  }, [completedExercises, todayWorkout.exercises.length, today]);

  // Added missing completeExercise function:
  const completeExercise = (exercise) => {
    if (!completedExercises.includes(exercise)) {
      const newList = [...completedExercises, exercise];
      setCompletedExercises(newList);
      localStorage.setItem(storageKey, JSON.stringify(newList));
    }
  };
  

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>{todayWorkout.name}</Header>

        {todayWorkout.exercises.length > 0 ? (
          <WorkoutList>
            {todayWorkout.exercises.map((exercise, index) => (
              <WorkoutItem
                key={index}
                onClick={() => completeExercise(exercise)}
                completed={completedExercises.includes(exercise)}
                disabled={completedExercises.includes(exercise)}
              >
                {exercise}
              </WorkoutItem>
            ))}
          </WorkoutList>
        ) : (
          <RestMessage>Rest day. Recover and prepare for tomorrow!</RestMessage>
        )}

        <BackButton>
          <Link to="/">← Back to Quest</Link>
        </BackButton>
      </Container>
    </>
  );
};

export default WorkoutPlan;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

const Header = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  text-shadow: 0 0 10px #00eaff, 0 0 20px #00eaff;
`;

const WorkoutList = styled.div`
  width: 100%;
  max-width: 500px;
`;

const WorkoutItem = styled.button`
  width: 100%;
  margin: 10px 0;
  padding: 15px;
  background: ${({ completed }) => (completed ? "rgba(0, 255, 136, 0.3)" : "rgba(0, 234, 255, 0.1)")};
  border: 1px solid rgba(0, 234, 255, 0.3);
  color: ${({ completed }) => (completed ? "#00ff88" : "white")};
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  cursor: ${({ completed }) => (completed ? "default" : "pointer")};
  box-shadow: ${({ completed }) =>
    completed ? "0 0 15px rgba(0, 255, 136, 0.6)" : "0 0 10px rgba(0, 234, 255, 0.2)"};
  animation: ${({ completed }) => (completed ? completePulse : "none")} 0.6s ease-in-out;
`;

const RestMessage = styled.p`
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
`;

const BackButton = styled.div`
  margin-top: 20px;
  a {
    padding: 10px 20px;
    background: rgba(0, 234, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-weight: bold;
    text-decoration: none;
  }
`;
