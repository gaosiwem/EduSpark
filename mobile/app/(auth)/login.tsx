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
  const setToken = useAuth((state: any) => state.setToken);
  const setUser = useAuth((state: any) => state.setUser)

  const onSubmit = async (formData: any) => {
      try 
      {
        console.log("Form data", formData)
        setSubmitting(true);
        const apiUrl = Constants.expoConfig?.extra?.apiUrl;
        
        const url = `${apiUrl}/login`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        await setToken(data.access_token);
        await setUser(data.user);
        
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
        {/* <SocialMedialButton 
            title='Sign in with google'
            // handlePress={() => loginWithGoogle()}
            handlePress={() => console.log("Google Sign-In Clicked")}
            image={images.google}
        /> */}
        <GoogleLoginButton />
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
