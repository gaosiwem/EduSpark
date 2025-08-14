import React, { useEffect } from 'react';
import { Button, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const useProxy = true; // Needed for Expo Go in development
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const googleClientId = Constants.expoConfig?.extra?.clientId;  
const googleWebClientId = Constants.expoConfig?.extra?.clientWebId; 
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export default function GoogleLoginButton() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Platform.select({
      android: googleClientId,
      web: googleWebClientId,
    }),
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      fetch(`${apiUrl}/api/login/google-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: id_token })
      })
        .then(res => res.json())
        .then(data => {
          console.log("Backend response:", data);
          // Save access_token securely here
        })
        .catch(err => console.error("Error logging in:", err));
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login with Google"
      onPress={() => promptAsync()} // ✅ No useProxy here
    />
  );
}
