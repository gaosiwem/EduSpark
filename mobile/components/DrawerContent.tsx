import React, { useEffect, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { icons } from '@/constants';
import { getChatHistory } from '@/api-service/api-call';
import { ChatHistoryApiResponse, ProcessedConversation } from '@/interfaces';


export default function DrawerContent(props: any) {

  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ProcessedConversation[]>([]);

    useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const fetchChats = async () => {
      try {
        // IMPORTANT: You need to pass a user_id to your getChatHistory function.
        // Replace '123' with the actual user ID from your authentication system or context.
        const userId = '123'; // Placeholder: Replace with actual user_id
        const apiResponse: ChatHistoryApiResponse = await getChatHistory(); // Expect the object structure

        // Log the received data to inspect its structure
        //console.log("Raw API response from getChatHistory:", apiResponse);

        // Check if the API response contains the 'chats' array and it's actually an array
        if (isMounted && apiResponse && Array.isArray(apiResponse.chats)) {
          const rawChats = apiResponse.chats;

          // Process raw chat entries to get unique conversations
          const uniqueConversationsMap = new Map<string, ProcessedConversation>();
          rawChats.forEach(chat => {
            if (!uniqueConversationsMap.has(chat.conversation_id)) {
              uniqueConversationsMap.set(chat.conversation_id, {
                conversation_id: chat.conversation_id,
                title: chat.conversation_title,
              });
            }
          });

          // Convert map values to an array and set the state
          setChatHistory(Array.from(uniqueConversationsMap.values()));
        } else if (isMounted) {
          console.warn("API returned data in an unexpected format or 'chats' is not an array:", apiResponse);
          setChatHistory([]); // Ensure chatHistory is an empty array if data is malformed
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        if (isMounted) {
            setChatHistory([]); // Clear history on error to prevent issues
        }
      }
    };

    fetchChats();

    // Cleanup: Set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 40 }}>
  <View className="flex-1 flex-col justify-between px-4">
    {/* Main Top Content */}
    <View className='gap-2'>
      {/* Avatar */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>Hi, Mpho</Text>
      </View>

      {/* Home Link */}
      <TouchableOpacity onPress={() => router.push('/(main)')} className="mb-4">
        <View className="flex flex-row gap-2">
          <icons.Home />
          <Text className="text-lg font-bold text-primary">Home</Text>
        </View>
      </TouchableOpacity>

      {/* Collapsible History Chats */}
      <View>
        <TouchableOpacity
          onPress={() => setShowHistory(!showHistory)}
          className="mb-2 flex-row items-center justify-between py-2"
        >
          <View className="flex-row items-center gap-2">
            <icons.Chat />
            <Text className="text-lg font-bold text-primary">Chats</Text>
          </View>
          <View>
            {showHistory ? (
              <icons.ChevronUp className="text-gray-500" />
            ) : (
              <icons.ChevronDown className="text-gray-500" />
            )}
          </View>
        </TouchableOpacity>

        {showHistory && (
          <View className="pl-4">
            {chatHistory.map((chat) => (
              <TouchableOpacity
                key={chat.conversation_id}
                onPress={() => router.push(`/(main)/(chats)/${chat.conversation_id}`)}
                className="py-1"
              >
                <Text className="text-base text-gray-700">• {chat.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

       {/* Quiz Link */}
      <TouchableOpacity
        onPress={() => router.push('/(main)/(quiz)')}
      >
        <View className="flex-row items-center gap-2">
          <icons.Document />
          <Text className="text-lg font-bold text-primary">Quiz</Text>
        </View>
      </TouchableOpacity>

      {/* Profile Link */}
      <TouchableOpacity
        onPress={() => router.push('/(main)/(tabs)/profile')}
      >
        <View className="flex-row items-center gap-2">
          <icons.User />
          <Text className="text-lg font-bold text-primary">Profile</Text>
        </View>
      </TouchableOpacity>
    </View>

    {/* Bottom Logout Button */}
    <View className="mt-auto pt-6 border-t border-gray-200">
      <TouchableOpacity onPress={() => router.push('/(main)')}>
        <View className="flex flex-row gap-2">
          <icons.LogOut />
          <Text className="text-lg font-bold text-red-600">Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
</DrawerContentScrollView>
  );
}