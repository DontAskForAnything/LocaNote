import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Welcome } from "./screens/welcome";
import { RootStackParamList } from "./types/navigation";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import WelcomeScreen from "./screens/auth/welcome";
import LogInStrategyScreen from "./screens/auth/logInStrategy";
import ForgotPasswordStrategyScreen from "./screens/auth/forgotPassword/forgotPasswordStrategy";
import SignUpStrategyScreen from "./screens/auth/singUpStrategy";
import UsernameChooseScreen from "./screens/auth/username";
import ForgotPasswordSendCodeScreen from "./screens/auth/forgotPassword/sendCode";
import ForgotPasswordCodeVerifyScreen from "./screens/auth/forgotPassword/verifyCode";
import ForgotPasswordRestartScreen from "./screens/auth/forgotPassword/passwordReset";
import LogInScreen from "./screens/auth/loginIn";
import VerifyCodeScreen from "./screens/auth/verifyCode";
import SignUpScreen from "./screens/auth/signup";
import { useFonts, Poppins_500Medium } from "@expo-google-fonts/poppins";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_600SemiBold,
  });
  if (!fontsLoaded) {
    return <></>;
  }
  console.log(Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY);
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
    >
      <SignedIn>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={Welcome} />
          </Stack.Navigator>
        </NavigationContainer>
      </SignedIn>
      <SignedOut>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen
              name="LogInStrategy"
              component={LogInStrategyScreen}
            />
            <Stack.Screen name="LogIn" component={LogInScreen} />
            {/* Forgot password screens */}
            <Stack.Screen
              name="ForgotPasswordStrategy"
              component={ForgotPasswordStrategyScreen}
            />

            <Stack.Screen
              name="ForgotPasswordSendCode"
              component={ForgotPasswordSendCodeScreen}
            />

            <Stack.Screen
              name="ForgotPasswordCodeVerify"
              component={ForgotPasswordCodeVerifyScreen}
            />

            <Stack.Screen
              name="ForgotPasswordRestart"
              component={ForgotPasswordRestartScreen}
            />

            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen
              name="SignUpStrategy"
              component={SignUpStrategyScreen}
            />
            <Stack.Screen
              name="UsernameChoose"
              component={UsernameChooseScreen}
            />
            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SignedOut>
    </ClerkProvider>
  );
};
