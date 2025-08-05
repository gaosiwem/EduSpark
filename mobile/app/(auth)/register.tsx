import React, { useState } from 'react'
import { View, Text, Button, ScrollView,Image, Alert  } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants";
import icons from '../../constants/icons/index'

import { CustomButton, FormField, Loader, SocialMedialButton } from '../../components'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';

function Register() {

    const {control, handleSubmit, formState: { errors },
    } = useForm({
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
      mode: 'onTouched',
    });

  const [isSubmitting, setSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
      Alert.alert("Error", "Submitted");

      setSubmitting(true);
  }

  return (
  <SafeAreaView className='bg-secondary h-full'>
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="px-10 justify-center items-center h-full">
        <icons.Logo color={`red`} />
        <Text className='text-black text-2xl font-semibold '>Getting Started.!</Text>
        <Text className='text-black text-base font-pmedium'>Login to your account to continue</Text>

        <FormField
            title="Name"
            name="name"
            placeholder='Name'
            control={control}
            error={errors.name?.message}
            icon = {<icons.Name/>}
            otherStyles="mt-7 "
          />

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
            name= 'password'
            placeholder='Password'
            control={control}
            error={errors.password?.message}
            icon = {<icons.Password/>}
            otherStyles="mt-7 "
            />

        <BouncyCheckbox        
          size={30}
          fillColor="#0C577D"
          unFillColor="#ffffff"
          text="Agree to Terms & Conditions"

          iconStyle={{ borderColor: "#0C577D" }}
          innerIconStyle={{ borderWidth: 2 }}
          textStyle={{ fontFamily: "font-psemibold", color: "#000000" }}
           onPress={(isChecked: boolean) => {setIsChecked(isChecked)}}
          className='mt-5 font-pregular font-black'
        />   

        <CustomButton 
          title='Sign Up'
          handlePress={submit} />

          <View>
            <Text className='font-psemibold'>Or Continue with</Text>
          </View>
        <SocialMedialButton 
            title='Sign up with google'
            handlePress={submit}
            image={images.google}
        />
        <View className='mt-5'>
          <Text>Already have an Account? <Link href="/login" className='text-primary underline font-psemibold'>SIGN IN</Link></Text>          
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>)
}

export default Register