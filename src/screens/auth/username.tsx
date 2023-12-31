import * as React from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types/navigation";
import { UsernameSchema } from "../../utils/schemas";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoBackSignButton } from "../../components/goBackSignButton";

export default function UsernameChooseScreen({
  navigation,
}: RootStackScreenProps<"UsernameChoose">) {
  const [usernameError, setUsernameError] = React.useState("");
  const [username, setUsername] = React.useState("");

  const { isLoaded, signUp, setActive } = useSignUp();

  const onSignUpPress = async () => {
    if (!isLoaded) return <></>;

    setUsernameError("");
    const result = UsernameSchema.safeParse(username);

    if (!result.success) {
      const errors = result.error.format();
      setUsernameError(errors?._errors[0] ?? "");
      return;
    }

    try {
      await signUp.update({ username: username });
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.status !== 200 && err.status !== 422) {
          setUsernameError(err.errors[0]?.message ?? "");
          return;
        }

        if (err.errors) {
          const usernameError = err.errors.find(
            (error) => error.meta?.paramName === "username",
          );
          setUsernameError(usernameError?.longMessage ?? "");

          return;
        }
      }
    }
    setActive({ session: signUp.createdSessionId });
  };
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <View className="h-screen bg-background  dark:bg-background-dark">
          <GoBackSignButton onPress={() => navigation.goBack()} />

          <Pressable className="flex h-screen justify-center bg-background  dark:bg-background-dark">
            <Text className="mb-4 text-center font-open-sans-bold text-black dark:text-white">
              Set your username
            </Text>
            <TextInput
              autoCapitalize="none"
              value={username}
              placeholder="Username"
              placeholderTextColor={"rgb(107,114,128)"}
              onChangeText={(username) => {
                setUsername(username);
              }}
              className="bg-input mx-4 rounded-2xl p-4 font-open-sans-regular text-gray-500 dark:bg-card-dark  dark:text-white"
            />
            {usernameError && (
              <Text className="mt-2 text-center font-open-sans-bold text-red-500">
                {usernameError}
              </Text>
            )}

            <TouchableOpacity
              className=" mt-4 w-6/12 self-center rounded-2xl bg-primary p-4   dark:bg-primary-dark"
              onPress={onSignUpPress}
            >
              <Text className="text-center font-open-sans-bold text-white">
                NEXT
              </Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
