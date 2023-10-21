import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

export const AccountScreen = ({
  navigation,
}: RootStackScreenProps<"Account">) => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return null;
  }
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex bg-background dark:bg-background-dark"
    >
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <View className="mt-8 h-screen bg-background dark:bg-background-dark">
          <View className="flex w-full flex-row justify-between rounded-full bg-card-dark p-6">
            <View className="min-h-12 w-3/4 flex-row">
              <Image
                source={{ uri: user.imageUrl }}
                className="aspect-square h-12 rounded-full bg-neutral-800"
              />

              <View className="ml-8 h-14 w-3/4 overflow-hidden whitespace-nowrap ">
                <Text className="font-open-sans-semibold text-base text-black opacity-70 dark:text-white">
                  Hello,
                </Text>
                <Text className="flex font-open-sans-bold text-lg text-black dark:text-white">
                  {user.username}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="flex w-11 items-center justify-center"
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name={`settings-outline`} size={24} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
