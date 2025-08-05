import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Menu from '@/components/Menu';
import { getQuizzes } from '@/api-service/api-call';

type QuizItem = {
  id: string;
  title: string;
  subject: string;
  grade: number;
  score: number;
  is_completed: boolean;
  created_at: string;
  user_id: string;
};

export default function QuizLandingPage() {
  const router = useRouter();

  const [completedQuizzes, setCompletedQuizzes] = useState<QuizItem[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [userXP, setUserXP] = useState(120);
  const [level, setLevel] = useState(2);
  const [streak, setStreak] = useState(4);

  const xpForNextLevel = 200;
  const xpProgress = Math.min((userXP / xpForNextLevel) * 100, 100);

  useEffect(() => {
  let isMounted = true;

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes("");
      if (isMounted) {
        setCompletedQuizzes([data]);
      }
    } catch (error) {
      console.log("Fetch error:", error);
      if (isMounted) setCompletedQuizzes([]);
    }
  };

  fetchQuizzes();

  return () => {
    isMounted = false;
  };
}, []);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);

    try {
      // Replace this with real API call to your FastAPI/OpenAI endpoint
      const newQuizId = `quiz-${Date.now()}`;
      router.push(`/(quiz)/file-selection`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="">
        <View className="absolute top-20 left-0 right-0 z-10">
        <Menu />
      </View>

        <View className='flex flex-1 mt-20 pl-5 pr-5 pt-30'>
        {/* 🎓 Header */}
        <View className="flex items-center mb-6 pt-20">
          <Text className="text-base font-psemibold text-gray-600 mt-1">
            Track your progress and earn rewards!
          </Text>
        </View>

        {/* 🧠 XP/Level Progress */}
        <View className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-primary">Level {level}</Text>
          <View className="w-full h-3 bg-primary/20 rounded-full mt-1">
            <View style={{ width: `${xpProgress}%` }} className="h-3 bg-primary rounded-full" />
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-sm text-primary">{userXP}/{xpForNextLevel} XP</Text>
            <Text className="text-sm text-primary">🔥 {streak} Day Streak</Text>
          </View>
        </View>

        {/* 🪄 Generate AI Quiz Button */}
        <TouchableOpacity
          className="bg-primary py-3 rounded-xl mb-6 shadow-md"
          onPress={handleGenerateQuiz}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">🪄 Generate AI Quiz</Text>
          )}
        </TouchableOpacity>

        {/* ✅ Completed Quizzes */}
        <Text className="text-xl font-bold text-gray-800 mb-3">✅ Completed Quizzes</Text>

        {completedQuizzes.length === 0 ? (
          <Text className="text-gray-500 italic">You haven't completed any quizzes yet.</Text>
        ) : (
          completedQuizzes.map((quiz) => (
            <View
              key={quiz.id}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
            >
              <Text className="text-lg font-bold text-primary">{quiz.title}</Text>
              <Text className="text-sm text-gray-600">
                Grade {quiz.grade} • {quiz.subject}
              </Text>
              <Text className="text-sm text-gray-700 mt-1">
                📝 Score: {quiz.score}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                📅 Taken: {new Date(quiz.created_at).toLocaleDateString()}
              </Text>
              <TouchableOpacity
                className="mt-3 bg-primary/90 py-2 px-4 rounded-lg"
                onPress={() => router.push(`/(quiz)/${quiz.id}`)}
              >
                <Text className="text-white text-center font-semibold">Review Quiz</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
