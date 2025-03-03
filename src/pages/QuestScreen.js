import React, { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';

// Global style to ensure full screen coverage
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body, html, #root {
    width: 100%;
    height: 100%;
   overflow-y: auto;
    font-family: 'Rajdhani', sans-serif;
  }
`;
const complete_Pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
  }
`;  

// Define the list of daily lifestyle quests
const QUEST_NAMES = [
  "Protein Shake with Every Meal",
  "Cold Shower (3 minutes)",
  "Digital Detox (No phone for the first/last hour of the day)",
  "7–8 Hours of Sleep",
  "3–4 Liters of Water",
  "Prep and eat overnight protein oats (50g oats + 1 scoop protein + nuts).",
  "Follow intermittent fasting (first meal at lunch, around 1-2 pm, unless it’s oats).",
  "No junk: No sweets, fried food, soda, or extra chapatis."
];

const QuestSystem = () => {
  // Determine today's key (using getDay for consistency with workout)
  const today = new Date().getDay();

  const [loaded, setLoaded] = useState(false);
  
  // Add streak counter to state
  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem("questStreak");
    return savedStreak ? parseInt(savedStreak, 10) : 0;
  });

  // Lifestyle quests state stored with a key based on today.
  const [lifestyleQuests, setLifestyleQuests] = useState(() => {
    const lsKey = `lifestyleQuests-${today}`;
    const stored = localStorage.getItem(lsKey);
    return stored ? JSON.parse(stored) : Array(QUEST_NAMES.length).fill(false);
  });
  
  // Handle overall quest completion - updates streak only when both workout and lifestyle quests are done.
  const completeQuest = () => {
    alert(`Quest Completed! Streak: ${streak + 1} days`);
    localStorage.setItem("lastCompletion", new Date().getTime());
    setStreak(streak + 1);
    localStorage.setItem("questStreak", streak + 1);
  };

  // Checks if both sections are complete and updates the streak if not already updated.
  const checkOverallCompletion = () => {
    // Assume that workout completion is stored as "true" in localStorage by the workout page.
    const workoutCompleted = localStorage.getItem(`workoutCompleted-${today}`) === "true";
    const lifestyleCompleted = lifestyleQuests.every(q => q === true);
    const questCompletedKey = `questCompleted-${today}`;
    if (workoutCompleted && lifestyleCompleted && !localStorage.getItem(questCompletedKey)) {
      completeQuest();
      localStorage.setItem(questCompletedKey, "true");
    }
  };
  
  // Check for failure (24 hours passed without completion)
  const checkFailure = () => {
    const now = new Date();
    const lastReset = localStorage.getItem("lastReset");
    const currentMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
    if (!lastReset || parseInt(lastReset, 10) < currentMidnight) {
      resetQuest();
      localStorage.setItem("lastReset", currentMidnight);
    }
  };
  
  // Reset quest on failure - updated to reset streak and lifestyle quests.
  const resetQuest = () => {
    const today = new Date().getDay();
    localStorage.removeItem(`workout-${today}`);
    localStorage.removeItem(`workoutCompleted-${today}`);
    localStorage.removeItem(`lifestyleQuests-${today}`);
    localStorage.removeItem(`questCompleted-${today}`);
    
    // Reset the local state for daily quests
    setLifestyleQuests(Array(QUEST_NAMES.length).fill(false));
    
    // ALSO reset the streak to 0
    setStreak(0);
    localStorage.setItem("questStreak", 0);
    
    alert("You didn't complete your quests in time. Streak reset to 0!");
  };
  
  // Manual reset for testing
  const manualReset = () => {
    if (window.confirm("Are you sure you want to reset your quest progress?")) {
      resetQuest();
    }
  };
  
  const resetStreakForTesting = () => {
    if (window.confirm("Are you sure you want to reset your streak to 0 for testing?")) {
      setStreak(0);
      localStorage.setItem("questStreak", 0);
      alert("Streak reset to 0 for testing.");
    }
  };
  
  // Initialize and check for failures on load
  useEffect(() => {
    console.log("Component Mounted");
    setTimeout(() => {
      setLoaded(true);
      console.log("System Initialized");
    }, 1000);
  
    const interval = setInterval(() => {
      console.log("Checking for quest reset at midnight...");
      checkFailure();
    }, 60000);
  
    return () => clearInterval(interval);
  }, []);
  
  // Check overall completion when lifestyle quest progress changes.
  useEffect(() => {
    checkOverallCompletion();
  }, [lifestyleQuests]);
  
  return (
    <>
      <GlobalStyle />
      <SystemContainer>
        <BackgroundParticles />
        <GridOverlay />
        
        <AnimatePresence>
          {loaded && (
            <ContentContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <HeaderGlow
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <SystemInitText>
                  {"SYSTEM INITIALIZED".split("").map((letter, index) => (
                    <AnimatedLetter 
                      key={index}
                      delay={1.0 + (index * 0.1)}
                    >
                      {letter}
                    </AnimatedLetter>
                  ))}
                </SystemInitText>
                <GlowingHeader>GOAL</GlowingHeader>
              </HeaderGlow>
              
              <QuestContainer
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
              >
                

                

                {/* Daily Lifestyle Quests Section */}
                <DailyQuestHeader>Daily Lifestyle Quests</DailyQuestHeader>
                <StreakCounter>
                 {streak} {streak === 1 ? "day" : "days"}
                </StreakCounter>
<DailyQuestList>
  {QUEST_NAMES.map((quest, index) => (
    <DailyQuestItem
      key={index}
      onClick={() => {
        if (!lifestyleQuests[index]) {
          const newQuests = [...lifestyleQuests];
          newQuests[index] = true;
          setLifestyleQuests(newQuests);
          localStorage.setItem(`lifestyleQuests-${today}`, JSON.stringify(newQuests));
          checkOverallCompletion();
        }
      }}
      completed={lifestyleQuests[index]}
      disabled={lifestyleQuests[index]}
    >
      {quest}
    </DailyQuestItem>
  ))}
</DailyQuestList>

<ButtonsWrapper>
  <LinkButton to="/workout">Start Workout</LinkButton>
 {/* <ActionButton onClick={manualReset}>RESET QUEST</ActionButton>
  <ActionButton onClick={resetStreakForTesting}>RESET STREAK (TESTING)</ActionButton>*/}
</ButtonsWrapper>
                
              </QuestContainer>
              
              <StatusText
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
              >
               
              </StatusText>
            </ContentContainer>
          )}
        </AnimatePresence>
      </SystemContainer>
    </>
  );
};

export default QuestSystem;

// Animation keyframes (unchanged)
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  8% { opacity: 0.8; }
  10% { opacity: 1; }
  20% { opacity: 0.8; }
  25% { opacity: 1; }
  60% { opacity: 0.8; }
  70% { opacity: 1; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const particleMovement = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100vh); }
`;

const breathe = keyframes`
  0%, 100% { box-shadow: 0 0 20px #00eaff, 0 0 40px #00eaff; }
  50% { box-shadow: 0 0 30px #00eaff, 0 0 60px #00eaff; }
`;

const letterFadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); filter: blur(10px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
`;

const letterGlitch = keyframes`
  0%, 100% { transform: translate(0); text-shadow: 0 0 4px #00eaff; }
  10% { transform: translate(-2px, -2px); text-shadow: 0 0 8px #00eaff; }
  20% { transform: translate(2px, 2px); text-shadow: 0 0 6px #00eaff; }
  30% { transform: translate(-2px, 2px); text-shadow: 0 0 5px #00eaff; }
  40% { transform: translate(2px, -2px); text-shadow: 0 0 7px #00eaff; }
  50% { transform: translate(0); text-shadow: 0 0 10px #00eaff; }
`;

// Styled Components
const AnimatedLetter = styled.span`
  display: inline-block;
  animation: ${letterFadeIn} 0.5s forwards, ${letterGlitch} 3s infinite 2s;
  animation-delay: ${props => props.delay}s;
  opacity: 0;
`;

const SystemContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #000428, #002152, #001428);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 overflow-y: auto
`;

const BackgroundParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, #000428 70%);
    background-image: 
      radial-gradient(white, rgba(255, 255, 255, 0.3) 2px, transparent 5px),
      radial-gradient(white, rgba(255, 255, 255, 0.2) 1px, transparent 6px),
      radial-gradient(white, rgba(255, 255, 255, 0.1) 1px, transparent 4px);
    background-size: 250px 250px, 200px 200px, 150px 150px;
    background-position: 0 0, 20px 30px, 50px 80px;
    animation: ${particleMovement} 120s linear infinite;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 234, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 234, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(180deg, #00eaff, transparent);
    opacity: 0.2;
    animation: ${scanline} 8s linear infinite;
    z-index: 3;
  }
`;

const ContentContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 10;
  padding: 20px;
`;

const SystemInitText = styled.div`
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.7);
`;

const HeaderGlow = styled(motion.div)`
  position: relative;
  margin-bottom: 40px;
  animation: ${float} 6s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -30px;
    left: -30px;
    right: -30px;
    bottom: -30px;
    background: radial-gradient(circle, rgba(0, 234, 255, 0.2) 0%, transparent 70%);
    z-index: -1;
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;

const GlowingHeader = styled.h1`
  font-size: 72px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 10px;
  color: white;
  text-shadow: 
    0 0 10px #00eaff,
    0 0 20px #00eaff,
    0 0 30px #00eaff,
    0 0 40px #00eaff,
    0 0 60px #00eaff;
`;

const QuestContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 600px;
  background: rgba(0, 20, 40, 0.7);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(0, 234, 255, 0.2);
  border: 1px solid rgba(0, 234, 255, 0.2);
  animation: ${breathe} 8s infinite ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 25%, 
                rgba(0, 234, 255, 0.05) 25%, 
                rgba(0, 234, 255, 0.05) 50%, 
                transparent 50%, transparent 75%, 
                rgba(0, 234, 255, 0.05) 75%, 
                rgba(0, 234, 255, 0.05));
    background-size: 20px 20px;
    pointer-events: none;
    z-index: -1;
  }
`;

const StatusText = styled(motion.div)`
  position: absolute;
  bottom: 8%;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 5px #00eaff;
  animation: ${flicker} 3s infinite;
`;

const ResetButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: rgba(255, 50, 50, 0.2);
  border: 1px solid rgba(255, 50, 50, 0.5);
  border-radius: 8px;
  color: white;
  font-family: inherit;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 50, 50, 0.4);
    box-shadow: 0 0 15px rgba(255, 50, 50, 0.5);
  }
`;

const StreakCounter = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #00ff88;
  text-align: center;
  text-shadow: 0 0 5px #00ff88, 0 0 10px #00ff88;
  margin-bottom: 10px;
`;

const StartWorkoutButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: rgba(0, 234, 255, 0.2);
  border: 1px solid rgba(0, 234, 255, 0.5);
  border-radius: 8px;
  color: white;
  font-family: inherit;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 234, 255, 0.4);
    box-shadow: 0 0 15px rgba(0, 234, 255, 0.5);
  }
`;

/* New styled components for the Daily Lifestyle Quests section 
const LifestyleQuestsSection = styled.div`
  margin-top: 20px;
`;

*/
/*
const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 12px;
  text-align: center;
  color: #00eaff;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(0, 234, 255, 0.5);
  padding-bottom: 4px;
`;

const QuestItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 12px;
  background: ${({ completed }) =>
    completed
      ? "linear-gradient(45deg, #00c853, #64dd17)"
      : "linear-gradient(45deg, #00bcd4, #4dd0e1)"};
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ completed }) => (completed ? "default" : "pointer")};
  box-shadow: ${({ completed }) =>
    completed
      ? "0px 4px 10px rgba(0, 200, 0, 0.6)"
      : "0px 4px 10px rgba(0, 188, 212, 0.6)"};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: ${({ completed }) => (completed ? "none" : "scale(1.02)")};
    box-shadow: ${({ completed }) =>
      completed
        ? "0px 4px 10px rgba(0, 200, 0, 0.6)"
        : "0px 6px 14px rgba(0, 188, 212, 0.8)"};
  }
`;
const LifestyleQuestsSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 12px;
  text-align: center;
  color: #00eaff;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(0, 234, 255, 0.5);
  padding-bottom: 4px;
`;

const QuestItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 12px;
  background: ${({ completed }) =>
    completed
      ? "linear-gradient(45deg, #00c853, #64dd17)"
      : "linear-gradient(45deg, #00bcd4, #4dd0e1)"};
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ completed }) => (completed ? "default" : "pointer")};
  box-shadow: ${({ completed }) =>
    completed
      ? "0px 4px 10px rgba(0, 200, 0, 0.6)"
      : "0px 4px 10px rgba(0, 188, 212, 0.6)"};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: ${({ completed }) => (completed ? "none" : "scale(1.02)")};
    box-shadow: ${({ completed }) =>
      completed
        ? "0px 4px 10px rgba(0, 200, 0, 0.6)"
        : "0px 6px 14px rgba(0, 188, 212, 0.8)"};
  }
`;
*/
const ButtonsWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: rgba(0, 234, 255, 0.1);
  border: 2px solid #00eaff;
  border-radius: 8px;
  color: #00eaff;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  text-shadow: 0 0 5px #00eaff;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px #00eaff;
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background: rgba(255, 50, 50, 0.1);
  border: 2px solid rgba(255, 50, 50, 0.5);
  border-radius: 8px;
  color: #ff3232;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(255, 50, 50, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 50, 50, 0.5);
  }
`;
/* --- New Styled Components to Mirror WorkoutPlan’s Neon UI --- */

// A subtle neon pulse for completed items
const completePulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
  }
`;

/* A heading that looks similar to your WorkoutPlan's header */
const DailyQuestHeader = styled.h2`
  font-size: 36px;
  margin-bottom: 30px;
  color: #00eaff;
  text-shadow: 0 0 10px #00eaff, 0 0 20px #00eaff;
  text-align: center;
`;

/* A container (list) for daily quests */
const DailyQuestList = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

/* Each daily quest item styled similarly to your workout items */
const DailyQuestItem = styled.button`
  width: 100%;
  margin: 12px 0;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  background: ${({ completed }) => (completed ? "rgba(0, 255, 136, 0.1)" : "rgba(0, 234, 255, 0.1)")};
  border: 2px solid ${({ completed }) => (completed ? "#00ff88" : "#00eaff")};
  border-radius: 8px;
  cursor: ${({ completed }) => (completed ? "default" : "pointer")};
  text-shadow: 0 0 5px ${({ completed }) => (completed ? "#00ff88" : "#00eaff")};
  box-shadow: 0 0 10px
    ${({ completed }) => (completed ? "rgba(0, 255, 136, 0.6)" : "rgba(0, 234, 255, 0.2)")};
  animation: ${({ completed }) => (completed ? completePulse : "none")} 0.6s ease-in-out;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: ${({ completed }) => (completed ? "none" : "scale(1.02)")};
    box-shadow: 0 0 15px
      ${({ completed }) => (completed ? "rgba(0, 255, 136, 0.6)" : "rgba(0, 234, 255, 0.4)")};
  }

  &:disabled {
    opacity: 0.7;
  }
`;
