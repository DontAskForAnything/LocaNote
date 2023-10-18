import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Welcome } from "./screens/welcome";
import { RootStackParamList } from "./types/navigation";
import { useFonts } from "@expo-google-fonts/inter";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
  const [fontsLoaded] = useFonts({});
  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
