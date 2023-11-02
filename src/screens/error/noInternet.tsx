import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView, Text, View } from "react-native";

export const NoInternetScreen = () => {
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex h-screen w-9/12 items-center justify-center self-center bg-background dark:bg-background-dark">
        <FontAwesome5 name="wifi" size={54} color="#16a34a" />

        <Text className="mt-4 self-stretch text-center font-open-sans-bold text-5xl text-white">
          No internet
        </Text>
        <Text className="self-stretch text-center font-open-sans-semibold text-sm text-white opacity-70">
          Our application requires internet access.{"\n"} Please make sure you
          are connected to the internet.
        </Text>
        <Text className="absolute bottom-0 py-2 text-center font-open-sans-bold text-white opacity-30">
          LocaNote
        </Text>
      </SafeAreaView>
    </View>
  );
};
