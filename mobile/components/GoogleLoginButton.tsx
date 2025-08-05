import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { useAuthRequest, ResponseType } from 'expo-auth-session';

// import { useAuth } from '../context/AuthContext';


WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton() {
  // const { setUser, storeAccessToken } = useAuth(); // Your auth context

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId: GOOGLE_CLIENT_ID,
  //   responseType: ResponseType.Token,
  //   scopes: ['profile', 'email'],
  // });

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { access_token } = response.params;

  //     // Fetch user info using token
  //     fetch('https://www.googleapis.com/userinfo/v2/me', {
  //       headers: { Authorization: `Bearer ${access_token}` },
  //     })
  //       .then(res => res.json())
  //       .then(async userInfo => {
  //         await storeAccessToken(access_token);
  //         setUser({
  //           email: userInfo.email,
  //           name: userInfo.name,
  //           avatar: userInfo.picture,
  //         });
  //         Alert.alert('Success', `Logged in as ${userInfo.email}`);
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         Alert.alert('Error', 'Failed to fetch user info');
  //       });
  //   } else if (response?.type === 'error') {
  //     Alert.alert('Error', 'Google login failed');
  //   }
  // }, [response]);

  return (
    <Button
      title="Login with Google"
      // onPress={() => promptAsync()}
      // disabled={!request}
    />
  );
}