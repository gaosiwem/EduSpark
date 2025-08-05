import React, { useState } from 'react'
import { View, Text, Button, ScrollView,Image, Alert  } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants";
import icons from '../../constants/icons/index'

import { CustomButton, FormField, Loader, SocialMedialButton } from '../../components'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import Constants from 'expo-constants';
import { showMessage } from "react-native-flash-message";

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';


// Configure Google Sign-In

// const clientId = Constants.expoConfig?.extra?.clientId; 

// GoogleSignin.configure({
//   offlineAccess: true, // Request a refresh token (if needed for backend)
//   forceCodeForRefreshToken: true, // For PKCE flow
// });

function Login() {

  const {control, handleSubmit, formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: 'onTouched',
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (formData: any) => {
      try 
      {
        console.log("Form data", formData)
        setSubmitting(true);
        const apiUrl = Constants.expoConfig?.extra?.apiUrl;
        
        const url = `${apiUrl}/login`

        console.log("URL1:", url)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("data", data)

        if(response.ok) {

          showMessage({
            message: "Login Successful!",
            description: "You are now logged in",
            type: "success", // success | info | danger | warning
          });
        } else {
          showMessage({
            message: data.message || "Login failed",
            description: data.error || "Please check your credentials and try again.",
            type: "danger", // success | info | danger | warning
          });
        }
        

      } catch (err: any) {

          showMessage({
            message: "Something went wrong",
              type: "danger", // success | info | danger | warning
            });
            console.log("Error during login", err.message)
        }        

        setSubmitting(false);
};

  // const loginWithGoogle = async () => {

  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const idToken = userInfo.data?.idToken;

  //     const apiUrl = Constants.expoConfig?.extra?.apiUrl;     
          
  //     const url = `${apiUrl}/login/google-mobile`;

  //         // Make a request to your backend's Google login endpoint
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ idToken }),
  //     });

  //     const data = await response.json();
  //     console.log('Backend response:', data);

  //   // Handle the backend's response (e.g., navigate to a protected screen, store tokens)
  //   } catch (error: any) { // Use 'any' for error if not specifically typed, or add type guards
  //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //         console.log('User cancelled the login flow');
  //       } else if (error.code === statusCodes.IN_PROGRESS) {
  //         console.log('Sign in is in progress');
  //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //         console.log('Play services not available or outdated');
  //       } else {
  //         console.error('Google Sign-In Error:', error);
  //       }
  //   }
  // };

  return (
  <SafeAreaView className='bg-secondary h-full '>
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, }}>
      <View className="px-10 justify-center items-center">
        <icons.Logo color={`red`} />
        <Text className='text-black text-2xl font-semibold '>Lets Sign In.!</Text>
        <Text className='text-black text-base font-pmedium'>Create an Account to Continue</Text>

        <FormField
            title="Email"
            name="email"
            placeholder='Email'
            control={control}
            error={errors.email?.message}
            icon = {<icons.Email/>}
            otherStyles="mt-7 "
          />

        <FormField 
            title='Password' 
            name="password"
            placeholder='Password'
            control={control}
            error={errors.password?.message}
            icon = {<icons.Password/>}
            otherStyles='mt-1'/>


        <BouncyCheckbox        
          size={30}
          fillColor="#0C577D"
          unFillColor="#ffffff"
          text="Remember Me"

          iconStyle={{ borderColor: "#0C577D" }}
          innerIconStyle={{ borderWidth: 2 }} 
          textStyle={{
            fontFamily: 'font-pbold',
            color: '#000000',
            textDecorationLine: 'none'  // 👈 prevents strikethrough
          }}
          onPress={(isChecked: boolean) => {setIsChecked(isChecked)}}
          className='mt-5 text-xl font-black'
        />   

        <CustomButton 
            title={isSubmitting ? 'Signing in...' : 'Sign In'}
            handlePress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
           />

          <View>
            <Text className='font-psemibold'>Or Continue with</Text>
          </View>
        <SocialMedialButton 
            title='Sign in with google'
            // handlePress={() => loginWithGoogle()}
            handlePress={() => console.log("Google Sign-In Clicked")}
            image={images.google}
        />
        <View className='mt-5'>
          <Text>Don’t have an Account? <Link href="/register" className='text-primary underline font-psemibold'>SIGN UP</Link></Text>          
        </View>
      </View>
      <View>
      </View>
    </ScrollView>
  </SafeAreaView>)
}

export default Login
