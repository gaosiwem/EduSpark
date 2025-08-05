import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChatHistoryApiResponse, ProcessedConversation } from '@/interfaces';
import { getConversationHistory } from '@/api-service/api-call';
import ChatInterface from '@/components/ChatInterface';
import { useLocalSearchParams } from 'expo-router';
import Learn from '../(tabs)/learn';




const History = () => {

  const { id } = useLocalSearchParams();

  return (
    // <View>
    //   <Text>History page</Text>
    //   <Text>{id.toString()}</Text>
    // </View>
    <Learn conversationId={id.toString()}  />
  )
}

export default History