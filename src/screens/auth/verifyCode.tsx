import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types/navigation";
import { NavigationBar } from "../../components/navigationBar";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { CodeInput } from "../../components/auth/codeInput";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyCodeScreen({
  navigation,
}: RootStackScreenProps<"VerifyCode">) {
  const { isLoaded, signUp, setActive } = useSignUp();

  // Input field value
  const [code, setCode] = React.useState("");

  // Error fields
  const [codeError, setCodeError] = React.useState("");

  const verifyCode = async () => {
    if (!isLoaded) return;

    if (!code) {
      setCodeError("Enter code");
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.status !== 200 && err.status !== 422) {
          setCodeError(err.errors[0]?.message ?? "");
          return;
        }

        const codeError = err.errors.find(
          (error) => error.meta?.paramName === "code",
        );
        setCodeError(codeError?.longMessage ? codeError.longMessage : "");
      }
    }
  };
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex bg-background dark:bg-background-dark">
        <NavigationBar
          title="Sign Up"
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Pressable className="flex h-screen bg-background px-5 pt-4 dark:bg-background-dark">
          <Text className=" mb-4 text-center font-open-sans-bold text-black dark:text-white">
            Enter your confirmation code
          </Text>

          <CodeInput
            length={6}
            code={code}
            setCode={setCode}
            error={codeError}
          />

          <TouchableOpacity
            className="mb-6 mt-4 w-6/12 self-center rounded-2xl bg-primary p-4   dark:bg-primary-dark"
            onPress={verifyCode}
          >
            <Text className="text-center font-open-sans-bold text-white">
              Sign up
            </Text>
          </TouchableOpacity>

          <Text className="text-center font-open-sans-regular text-black dark:text-white ">
            By signing up you agree to our
          </Text>
          {/* //TODO: Add links to website linear.app/LocaNote/issue/MIN-46/add-links-to-website */}
          <Text className="text-center font-open-sans-bold text-black dark:text-white ">
            Terms and Privacy Policy.
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
