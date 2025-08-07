// store/transcriptStore.ts

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranscriptState {
  transcript: string;
  fileName: string;
  filePath: string;
  setTranscriptData: (data: {
    transcript: string;
    fileName: string;
    filePath: string;
  }) => void;
  clear: () => void;
}

export const useTranscriptStore = create<TranscriptState>()(
  persist(
    (set) => ({
      transcript: '',
      fileName: '',
      filePath: '',
      setTranscriptData: ({ transcript, fileName, filePath }) =>
        set({ transcript, fileName, filePath }),
      clear: () => set({ transcript: '', fileName: '', filePath: '' }),
    }),
    {
      name: 'transcript-storage',
      storage: {
        getItem: async (key) => {
          const item = await AsyncStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);


export const useAuth = create(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: (user: any) => set({ user}),
      setToken: (token: any) => set({ token })
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
