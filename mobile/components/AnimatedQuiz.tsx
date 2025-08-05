// components/AnimatedQuiz.tsx
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { awardXP, submitQuizResults } from '@/api-service/api-call';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import XPBar from './XPBar';
import LevelUpAnimation from './LevelUpAnimation';
import Notification from './Notification';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProgress {
  current_xp: number;
  level: number;
  xp_for_next_level: number;
  progress_to_next_level: number;
  unlocked_badge?: string;
}

type QuizQuestion = {
  id: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
  selected?: string;
  isCorrect?: boolean;
};

interface Props {
  questions: QuizQuestion[];
  userId: string;
  grade: string;
  subject: string;
  quizId: string;
}

const AnimatedQuiz = ({ questions, userId, grade, subject, quizId }: Props) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<QuizQuestion[]>([]);
  const router = useRouter();

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [levelUpDetails, setLevelUpDetails] = useState<{ newLevel: number, unlockedBadge?: string } | null>(null);
  const [xpNotification, setXpNotification] = useState<string | null>(null);

  const answerAnimation = useRef(new Animated.Value(1)).current;
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);

  const animationRef = useRef<LottieView>(null);

  // useEffect(() => {
  //   const fetchProgress = async () => {
  //     try {
  //       const progress = await getUserProgress(userId);
  //       setUserProgress(progress);
  //     } catch (error) {
  //       console.error("Failed to fetch user progress:", error);
  //     }
  //   };
  //   fetchProgress();
  // }, [userId]);

  if (!questions || questions.length === 0 || index >= questions.length) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-500 text-lg">Loading quiz or no questions available...</Text>
      </View>
    );
  }

  const currentQuestion: QuizQuestion = questions[index];

  const handleAnswer = async (choice: string) => {
    if (selected !== null) return;

    const isCorrect = choice === currentQuestion.correct;
    let gainedScore = 0;

    if (isCorrect) gainedScore = 10;

    setScore(prev => prev + gainedScore);

    setAnswers(prev => [...prev, { ...currentQuestion, selected: choice, isCorrect }]);
    setSelected(choice);
    setXpNotification(`${isCorrect ? '+' : ''}${gainedScore} XP!`);

    if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    notificationTimeout.current = setTimeout(() => setXpNotification(null), 2000);

    Animated.sequence([
      Animated.timing(answerAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(answerAnimation, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = async () => {
    setSelected(null);
    setShowExplanation(false);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      try {
        const totalXpForQuiz = 50 + score;
        const xpResponse = await awardXP(userId, quizId, 'quiz', score);

        if (xpResponse) {
          setUserProgress({
            current_xp: xpResponse.current_xp,
            level: xpResponse.new_level || xpResponse.level,
            xp_for_next_level: xpResponse.xp_for_next_level,
            progress_to_next_level: xpResponse.progress_to_next_level,
            unlocked_badge: xpResponse.unlocked_badge
          });

          if (xpResponse.level_up) {
            setLevelUpDetails({
              newLevel: xpResponse.new_level,
              unlockedBadge: xpResponse.unlocked_badge,
            });
            setShowLevelUpAnimation(true);
          }
        }

        await submitQuizResults({
          user_id: userId,
          content_id: quizId,
          grade,
          subject,
          score,
          total_questions: questions.length,
          correct_answers: score / 10,
          questions: answers,
        });

        router.replace(`/quiz/result?score=${score}&total=${questions.length}&xpGained=${totalXpForQuiz}&levelUp=${xpResponse?.level_up || false}`);
      } catch (error) {
        console.error("Error during quiz completion:", error);
        setXpNotification("Error completing quiz!");
        if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
        notificationTimeout.current = setTimeout(() => setXpNotification(null), 3000);
      }
    }
  };

  return (
      <ScrollView contentContainerStyle={{ paddingBottom: 100  }} className="px-10">
        <View className="mb-4 items-center">
          <View className='flex flex-row items-center'>
            <LottieView
              ref={animationRef}
              source={require('@/assets/animations/rocket.json')}
              autoPlay
              loop
              style={{ width: 40, height: 40 }}
            />
            <Text className="text-2xl font-bold text-[#0C577D] ml-2">Let’s Learn!</Text>
          </View>
          <Text className="text-lg text-gray-800 font-semibold">{subject} - Grade {grade}</Text>
          <Text className="text-sm text-gray-600 mt-1 leading-relaxed">
            Answer questions to earn XP, level up and unlock badges. Good luck!
          </Text>
          <LottieView
            source={require('@/assets/animations/target.json')}
            autoPlay
            loop
            style={{ width: 40, height: 40 }}
          />
        </View>

        {userProgress && (
          <XPBar
            currentXp={userProgress.current_xp}
            currentLevel={userProgress.level}
            xpToNextLevel={userProgress.progress_to_next_level}
            totalXpForNextLevel={userProgress.xp_for_next_level}
          />
        )}

        {xpNotification && <Notification message={xpNotification} />}

        {showLevelUpAnimation && levelUpDetails && (
          <LevelUpAnimation
            newLevel={levelUpDetails.newLevel}
            unlockedBadge={levelUpDetails.unlockedBadge}
            onAnimationFinish={() => setShowLevelUpAnimation(false)}
          />
        )}

        <View className="py-5">
          <Text className="text-xl font-light mb-4 text-gray-800">Question {index + 1} of {questions.length}</Text>
          <Text className="text-lg mb-6 text-gray-900 font-semibold leading-relaxed">{currentQuestion.question}</Text>

          {Object.entries(currentQuestion.options).map(([key, value]) => {
            const isSelected = selected === key;
            const isCorrect = currentQuestion.correct === key;

            let bgColor = 'bg-primary';
            let textColor = 'text-white';
            let borderColor = 'border-primary';

            if (selected) {
              if (isSelected && isCorrect) {
                bgColor = 'bg-green-200';
                textColor = 'text-green-800';
                borderColor = 'border-green-400';
              } else if (isSelected && !isCorrect) {
                bgColor = 'bg-red-200';
                textColor = 'text-red-800';
                borderColor = 'border-red-400';
              } else if (isCorrect) {
                bgColor = 'bg-green-100';
                textColor = 'text-green-700';
                borderColor = 'border-green-300';
              } else {
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-500';
                borderColor = 'border-gray-200';
              }
            }

            return (
              <Animated.View key={key} style={{ transform: [{ scale: answerAnimation }] }}>
                <TouchableOpacity
                  className={`rounded-xl p-4 my-2 border-2 ${bgColor} ${borderColor} shadow-sm`}
                  disabled={!!selected}
                  onPress={() => handleAnswer(key)}
                >
                  <Text className={`text-base font-medium ${textColor}`}>{key}. {value}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {selected && (
            <View className="mt-8">
              <TouchableOpacity
                className="py-3 px-4 bg-yellow-400 rounded-lg shadow-md mb-4"
                onPress={() => setShowExplanation(!showExplanation)}
              >
                <Text className="text-center font-bold text-yellow-900">
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </Text>
              </TouchableOpacity>

              {showExplanation && (
                <View className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <Text className="text-sm text-gray-800 italic leading-relaxed">
                    {currentQuestion.explanation}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                className="py-4 px-4 bg-indigo-700 rounded-lg shadow-lg"
                onPress={handleNext}
              >
                <Text className="text-white text-center font-extrabold text-lg">
                  {index + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
  );
};

export default AnimatedQuiz;
