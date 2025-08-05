import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import AnimatedQuiz from '@/components/AnimatedQuiz';
import Menu from '@/components/Menu';
import { useLocalSearchParams } from 'expo-router';
import { getQuiz } from '@/api-service/api-call';

type BackendQuizOption = {
  id: string;
  text: string;
  is_correct: boolean;
};

type BackendQuizQuestion = {
  id: string;
  question: string;
  options: BackendQuizOption[];
  explanation: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: Record<string, string>; // A: "Answer text"
  correct: string;                // "A"
  explanation: string;
};

const { height: screenHeight } = Dimensions.get('window');

const NewQuiz = () => {

  const { id } = useLocalSearchParams();
  const selectedFile = Array.isArray(id) ? id[0] : id;
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  // const generateQuizFromFile = async (selectedFile: any) => {
  //   setLoading(true);
  //   try {
      
  //     console.log("inside new quiz")

  //     const files = selectedFile.split(',')
      
  //     for (let i = 0; i < files.length; i++) {
  //       console.log(files[i])        
  //     }
  //     await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call

  //     const generatedQuestions = api-service.

  //   //   const generatedQuestions: QuizQuestion[] = [
  //   //     {
  //   //       id: 'q1',
  //   //       question: `What is one key topic from ?`,
  //   //       options: { A: 'Option 1', B: 'Option 2', C: 'Option 3', D: 'Option 4' },
  //   //       correct: 'A',
  //   //       explanation: 'Sample explanation for the generated quiz.',
  //   //     },
  //   //     {
  //   //       id: 'q2',
  //   //       question: `How isseful in science?`,
  //   //       options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
  //   //       correct: 'B',
  //   //       explanation: 'Another explanation.',
  //   //     },
  //   //   ];

  //     setQuestions(generatedQuestions);
  //   } catch (err) {
  //     console.error('Error generating quiz:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

    useEffect(() => {
    let isMounted = true;
  
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(id.toString());
        const formatted = data.questions.map((q: BackendQuizQuestion) => {
          const optionLetters = ['A', 'B', 'C', 'D', 'E'];
          const optionsMap: Record<string, string> = {};
          let correctLetter = '';

          q.options.forEach((opt, index) => {
            const letter = optionLetters[index];
            optionsMap[letter] = opt.text;
            if (opt.is_correct) correctLetter = letter;
          });

          return {
            id: q.id,
            question: q.question,
            options: optionsMap,
            correct: correctLetter,
            explanation: q.explanation || '',
          };
        });

        setQuestions(formatted);
      } catch (error) {
        console.error('Failed to load quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <LottieView
          source={require('@/assets/animations/loading_spinner.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
        <Text className="mt-4 text-lg text-gray-700">Generating quiz...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white relative">
      {/* Sticky Menu */}
      <View className="absolute top-0 left-0 right-0 z-20 bg-white shadow-md">
        <Menu />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="pt-20 px-4"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
    <SafeAreaView className="flex-1 bg-white">
        <AnimatedQuiz questions={questions} />
    </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default NewQuiz;