import { Redirect, Stack } from 'expo-router'


export default function AuthRoutesLayout() {
  // const { isSignedIn } = useAuth()

  // if (isSignedIn) {
  //   return <Redirect href={'/'} />
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}