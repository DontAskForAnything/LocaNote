import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainScreen } from "./screens/main/welcome";
import { RootStackParamList } from "./types/navigation";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import WelcomeScreen from "./screens/auth/welcome";
import LogInStrategyScreen from "./screens/auth/logInStrategy";
import SignUpStrategyScreen from "./screens/auth/singUpStrategy";
import UsernameChooseScreen from "./screens/auth/username";
import ForgotPasswordSendCodeScreen from "./screens/auth/forgotPassword/sendCode";
import ForgotPasswordCodeVerifyScreen from "./screens/auth/forgotPassword/verifyCode";
import ForgotPasswordRestartScreen from "./screens/auth/forgotPassword/passwordReset";
import VerifyCodeScreen from "./screens/auth/verifyCode";
import SignUpScreen from "./screens/auth/signup";
import { useFonts, Poppins_500Medium } from "@expo-google-fonts/poppins";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { AddSubjectScreen } from "./screens/main/addSubject";
import { SubjectScreen } from "./screens/main/subject";
import { SettingsScreen } from "./screens/account/settings/settings";
import GenerateTopicsScreen from "./screens/main/generateTopics";
import { EditSubjectScreen } from "./screens/main/EditSubjectScreen";
import { TopicScreen } from "./screens/main/topic";

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
  return (
    <ActionSheetProvider>
      <ClerkProvider
        publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      >
        <SignedIn>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="MainScreen"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="MainScreen" component={MainScreen} />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "fade_from_bottom",
                }}
                name="Settings"
                component={SettingsScreen}
              />
              {/* Subjects */}
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="AddSubjectScreen"
                component={AddSubjectScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="GenerateTopics"
                component={GenerateTopicsScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="SubjectScreen"
                component={SubjectScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="EditSubjectScreen"
                component={EditSubjectScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="TopicScreen"
                component={TopicScreen}
              />
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
    </ActionSheetProvider>
  );
};
