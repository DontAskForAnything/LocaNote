import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import SignInWithOAuthButton from "../../components/SignInWithOAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoBackSignButton } from "../../components/goBackSignButton";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { EmailLogInSchema } from "../../utils/schemas";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function LogInStrategyScreen({
  navigation,
}: RootStackScreenProps<"LogInStrategy">) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailLogInSchema),
    defaultValues: { emailAddress: "", password: "" },
  });

  const onSignInPress = async (values: z.infer<typeof EmailLogInSchema>) => {
    if (!isLoaded) return;

    try {
      values = values as z.infer<typeof EmailLogInSchema>;
      const completeSignIn = await signIn.create({
        identifier: values.emailAddress,
        password: values.password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.status !== 200 && err.status !== 422) {
          setError("emailAddress", { message: err.errors[0]?.message });
          return;
        }
        if (err.errors) {
          if (err.errors[0]?.code === "form_param_format_invalid") {
            setError("emailAddress", {
              message: "Invalid email.",
            });

            return;
          }

          if (err.errors[0]?.code === "form_identifier_not_found") {
            setError("emailAddress", {
              message: err.errors[0].longMessage,
            });

            return;
          }

          // Email error
          const emailError = err.errors.find(
            (error) => error.meta?.paramName === "email_address",
          );
          setError("emailAddress", {
            message: emailError ? emailError.longMessage : "",
          });

          const passwordError = err.errors.find(
            (error) => error.meta?.paramName === "password",
          );
          setError("password", {
            message: passwordError ? passwordError.longMessage : "",
          });
        }
      }
    }
  };

  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <View className="h-screen bg-background px-5 pt-6 dark:bg-background-dark">
          <GoBackSignButton onPress={() => navigation.goBack()} />

          <View className="flex  h-1/3 w-full items-center justify-end">
            <Text className="font-open-sans-semibold text-base text-gray-500">
              LocaNote
            </Text>
            <Text className="my-1 font-open-sans-bold text-4xl text-white">
              Sign In
            </Text>
            <Text className="font-open-sans-semibold text-sm text-gray-500">
              Please fill your informations
            </Text>
          </View>

          <View className="relative mt-12 h-2/3">
            <TouchableOpacity
              className="absolute bottom-10 h-24 w-full p-4"
              onPress={() => navigation.navigate("ForgotPasswordSendCode")}
            >
              <Text className="text-center font-open-sans-semibold text-xs text-black opacity-60 dark:text-white">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Controller
              control={control}
              name="emailAddress"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  autoCapitalize="none"
                  placeholder="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  placeholderTextColor="#6B7280"
                  className={`rounded-2xl bg-input p-4  font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
                    errors.emailAddress?.message && "border-2 border-red-500"
                  }`}
                />
              )}
            />
            {errors.emailAddress?.message && (
              <Text className="mt-2 font-open-sans-semibold text-red-500">
                {errors.emailAddress.message.toString()}
              </Text>
            )}

            {/* Password input and error */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  autoCapitalize="none"
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="#6B7280"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  className={`mt-3 rounded-2xl bg-input p-4 font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
                    errors.password?.message && "border-2 border-red-500"
                  }`}
                />
              )}
            />
            {errors.password?.message && (
              <Text className="mt-2 font-open-sans-semibold text-red-500">
                {errors.password.message.toString()}
              </Text>
            )}

            {/* Sign In button */}
            <TouchableOpacity
              className="mt-4  rounded-2xl bg-primary p-4 dark:bg-primary-dark"
              onPress={handleSubmit(onSignInPress)}
            >
              <Text className="text-center font-open-sans-bold text-white">
                Sign In
              </Text>
            </TouchableOpacity>

            <Text className="my-4 text-center font-open-sans-regular text-xs text-black dark:text-white">
              or
            </Text>
            <SignInWithOAuthButton
              oauth_strategy="oauth_google"
              themeVariant="google"
              text="Continue with Google"
              iconName="google"
              onNewAccount={() => navigation.navigate("UsernameChoose")}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
