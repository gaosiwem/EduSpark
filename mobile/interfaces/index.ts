export interface RawChatEntry {
    content: string;
    conversation_id: string;
    conversation_title: string; // This is the title we want to display for the conversation
    role: 'user' | 'assistant';
    timestamp: Date;
}

// Interface for the structure of the API response
export interface ChatHistoryApiResponse {
    chats: RawChatEntry[];
}

// Interface for the processed conversation to be stored in state
export interface ProcessedConversation {
    conversation_id: string;
    title: string;
}
