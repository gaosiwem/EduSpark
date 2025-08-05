import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import icons from "../constants/icons"
import { Controller, Control } from "react-hook-form";

type Props = {
  title: string;
  name: string;
  placeholder?: string;
  icon: any;
  control: any;
  error?: string
  otherStyles?: string;
};

const FormField = ({
  title,
  name,
  placeholder,
  otherStyles,
  control,
  icon,
  error,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 mt-5 ${otherStyles}`}>      
      
      <View>
        <Text className="text-lg text-black font-pmedium">{title}</Text>
      </View>
        
      <View className="bg-white w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-primary focus:border-secondary flex flex-row items-center align-middle">
        <View>
          {icon}
        </View>
        <Controller
          control={control}
          name={name}
            rules={{
            required: `${title} is required`,
            ...(title === 'Email' && {
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address',
              },
            }),
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-1 px-4 text-black font-regular text-xl"
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              secureTextEntry={title === "Password" && !showPassword}
              placeholderTextColor="#888"
            />
          )}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {(!showPassword ? icons.Eye : icons.EyeClosed) && (
              <View className="w-6 h-6 justify-center items-center">
                {(() => {
                  const IconComponent = !showPassword ? icons.Eye : icons.EyeClosed;
                  return <IconComponent color="#0C577D" />;
                })()}
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
        {error && (
        <Text className="text-red-500 text-sm font-pregular">{error}</Text>
      )}
    </View>
  );
};

export default FormField;