// store/transcriptStore.ts

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '@/interfaces';

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


export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
