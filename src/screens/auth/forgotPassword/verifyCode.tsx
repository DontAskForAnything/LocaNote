import React from "react";
import { RootStackScreenProps } from "../../../types/navigation";
import { CodeInput } from "../../../components/auth/codeInput";
import {
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { SafeAreaView } from "react-native-safe-area-context";
import useInterval from "../../../hooks/useInterval";
import { GoBackSignButton } from "../../../components/goBackSignButton";

const resendCodeDelay = 30;

export default function ForgotPasswordCodeVerifyScreen({
  navigation,
  route,
}: RootStackScreenProps<"ForgotPasswordCodeVerify">) {
  const [count, setCount] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  useInterval(
    () => {
      if (count <= 0) {
        setIsRunning(false);
        setCount(0);
      } else {
        setCount(count - 1);
      }
    },
    isRunning ? 1000 : null,
  );

  const { verificationType, identifier } = route.params;

  const [code, setCode] = React.useState("");
  const [codeError, setCodeError] = React.useState("");
  const [resendError, setResendError] = React.useState("");
  const { signIn } = useSignIn();

  const codeSubmit = async () => {
    setCodeError("");

    try {
      if (verificationType == "email") {
        await signIn?.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code,
        });
      } else {
        await signIn?.attemptFirstFactor({
          strategy: "reset_password_phone_code",
          code,
        });
      }
      navigation.navigate("ForgotPasswordRestart");
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.errors) {
          setCodeError(err.errors[0]?.longMessage || "Something went wrong.");
        }
      }
    }
  };

  const resendCode = async () => {
    setResendError("");

    if (!isRunning) {
      setCount(resendCodeDelay);
      setIsRunning(true);
    } else {
      return;
    }
    try {
      if (verificationType == "email") {
        await signIn?.create({
          strategy: "reset_password_email_code",
          identifier,
        });
      } else {
        await signIn?.create({
          strategy: "reset_password_phone_code",
          identifier,
        });
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.errors) {
          setResendError(err.errors[0]?.longMessage || "Something went wrong.");
        }
      }
    }
  };

  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <View className="h-screen bg-background px-5 pt-6 dark:bg-background-dark">
          <GoBackSignButton onPress={() => navigation.goBack()} />

          <Pressable
            className="flex  h-screen justify-center bg-background  dark:bg-background-dark"
            onPress={Keyboard.dismiss}
          >
            <Text className="text-center font-open-sans-semibold text-base text-black dark:text-white">
              Enter your code
            </Text>
            <Text className="text-x mb-4 p-2 text-center  dark:text-primary-dark">
              Please enter the code we sent to your phone or email
            </Text>
            <CodeInput
              length={6}
              code={code}
              setCode={setCode}
              error={codeError}
            />
            <TouchableOpacity
              className={`mb-2  mt-2 rounded-2xl bg-primary p-4   dark:bg-primary-dark ${
                code.length !== 6 && " opacity-60"
              }`}
              onPress={codeSubmit}
              disabled={code.length !== 6}
            >
              <Text className="text-center font-open-sans-semibold text-white">
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className=" p-2" onPress={resendCode}>
              <Text className="text-x  text-center dark:text-primary-dark">
                Didn't receive the code?{" "}
                {count > 0 && count < resendCodeDelay && ` (${count}s) `}
              </Text>
              {resendError && (
                <Text className=" text-center font-open-sans-bold text-xs text-red-500">
                  {resendError}
                </Text>
              )}
            </TouchableOpacity>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
