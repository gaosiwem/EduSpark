import Constants from "expo-constants";

  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  
  export const getUploadedFiles = async () => {
    try {
      const res = await fetch(`${apiUrl}/user-files/1`);
      const data = await res.json();
      return data
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
    }
  };

  export const getChatHistory = async () => {
     try {
      const res = await fetch(`${apiUrl}/get_chats/1`);
      const data = await res.json();
      return data
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
    }
  }

  export const getConversationHistory = async (conversation_id?: string) => {

      if (!conversation_id) {
        console.warn("No conversation ID provided");
        return null;
    }
     try {
      const res = await fetch(`${apiUrl}/get_conversations/${conversation_id}`);
      const data = await res.json();
      return data
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
    }
  }

  export async function awardXP(userId: number, xp: number){
    
    const res = await fetch(`${apiUrl}/xp/${userId}?xp=${xp}`, {
      method: "POST",
      headers: {
        "Content-TYpe": "application/json",
      },
    });
    
    if(!res.ok) throw new Error("Failed to award XP");

    return await res.json();
  }

  export async function submitQuizResults(payload: any) {

    const quiz = [
      {
        "question": "Which of the following is a renewable source of energy?",
        "options": {
          "A": "Coal",
          "B": "Oil",
          "C": "Solar power",
          "D": "Natural gas"
        },
        "correct": "C",
        "explanation": "Solar power is a renewable source of energy because it comes from the sun, which is constantly available and doesn't deplete natural resources."
      },
      {
        "question": "What is the main reason for using energy-efficient appliances at home?",
        "options": {
          "A": "They are more expensive",
          "B": "They reduce energy consumption",
          "C": "They use more water",
          "D": "They make more noise"
        },
        "correct": "B",
        "explanation": "Energy-efficient appliances use less electricity, which helps save money and reduce the environmental impact of energy production."
      },
      {
        "question": "Which of the following actions helps reduce your carbon footprint?",
        "options": {
          "A": "Driving more often",
          "B": "Using plastic bags",
          "C": "Recycling and using public transport",
          "D": "Leaving lights on when not in use"
        },
        "correct": "C",
        "explanation": "Recycling and using public transport reduce greenhouse gas emissions, which contributes to a lower carbon footprint."
      },
      {
        "question": "What type of energy is stored in a battery?",
        "options": {
          "A": "Kinetic energy",
          "B": "Light energy",
          "C": "Chemical energy",
          "D": "Thermal energy"
        },
        "correct": "C",
        "explanation": "A battery stores chemical energy which is converted into electrical energy when used."
      },
      {
        "question": "Why is coal considered a non-renewable resource?",
        "options": {
          "A": "It is found only in oceans",
          "B": "It can be reused many times",
          "C": "It takes millions of years to form",
          "D": "It is made from plants"
        },
        "correct": "C",
        "explanation": "Coal takes millions of years to form from ancient plant material, which makes it non-renewable."
      }
    ]

    // const res = await fetch(`${apiUrl}/submit_quiz_results`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // if (!res.ok) throw new Error("Quiz result submit failed");
    // return await res.json();

    return quiz;
  }

  export async function generateQuiz(fileName: string){
    
    // const res = await fetch(`${apiUrl}/submit_quiz_results`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // if (!res.ok) throw new Error("Quiz result submit failed");
    // return await res.json();
  }


  export const getQuizzes = async (userId: string) => {
     try {
      const res = await fetch(`${apiUrl}/get_quizzes/f02741c7-203e-461f-ac98-1920b18dbfe1`);
      const data = await res.json();
      console.log(data)
      return data
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
    }
  }

  export const getQuiz = async (quizId: string) => {
     try {
      const res = await fetch(`${apiUrl}/get_quiz/${quizId}`);
      const data = await res.json();
      return data
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
    }
  }


  