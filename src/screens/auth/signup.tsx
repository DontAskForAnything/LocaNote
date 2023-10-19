import * as React from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types/navigation";
import { EmailSignUpSchema } from "../../utils/schemas";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoBackSignButton } from "../../components/goBackSignButton";

export default function SignUpScreen({
  navigation,
}: RootStackScreenProps<"SignUp">) {
  const { isLoaded, signUp } = useSignUp();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailSignUpSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
      passwordConfirm: "",
      username: "",
    },
  });

  const onSignUpPress = async (values: z.infer<typeof EmailSignUpSchema>) => {
    if (!isLoaded) return <></>;

    try {
      values = values as z.infer<typeof EmailSignUpSchema>;
      await signUp.create({
        emailAddress: values.emailAddress,
        password: values.password,
        username: values.username,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // change the UI to our code verification
      navigation.navigate("VerifyCode", { verificationType: "email" });
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.status !== 200 && err.status !== 422) {
          setError("emailAddress", { message: err.errors[0]?.message });
          return;
        }

        if (err.errors) {
          // Email error
          const emailError = err.errors.find(
            (error) => error.meta?.paramName === "email_address",
          );
          setError("emailAddress", {
            message: emailError ? emailError.longMessage : "",
          });

          // Password email
          const passwordError = err.errors.find(
            (error) => error.meta?.paramName === "password",
          );
          setError("password", {
            message: passwordError ? passwordError.longMessage : "",
          });

          // Username error
          const usernameError = err.errors.find(
            (error) => error.meta?.paramName === "username",
          );
          setError("username", {
            message: usernameError ? usernameError.longMessage : "",
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

          <KeyboardAvoidingView behavior={"position"}>
            <View className=" mt-20 ">
              <Text className="pb-8 text-center font-open-sans-semibold text-xl  text-black dark:text-white">
                Create account
              </Text>

              {/* email */}
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
                    className={`rounded-2xl bg-input  p-4 text-black dark:bg-input-dark  dark:text-white ${
                      errors.emailAddress?.message && "border-2 border-red-500"
                    }`}
                  />
                )}
              />
              {errors.emailAddress?.message && (
                <Text className="mt-2 font-open-sans-bold text-red-500">
                  {errors.emailAddress.message.toString()}
                </Text>
              )}

              {/* password */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    autoCapitalize="none"
                    secureTextEntry={true}
                    placeholder="Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholderTextColor="#6B7280"
                    className={`mt-3 rounded-2xl bg-input p-4  font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
                      errors.password?.message && "border-2 border-red-500"
                    }`}
                  />
                )}
              />
              {errors.password?.message && (
                <Text className="mt-2 font-open-sans-bold text-red-500">
                  {errors.password.message.toString()}
                </Text>
              )}

              {/* passwordConfirm */}
              <Controller
                control={control}
                name="passwordConfirm"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    autoCapitalize="none"
                    secureTextEntry={true}
                    placeholder="Confirm password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholderTextColor="#6B7280"
                    className={`mt-3 rounded-2xl bg-input  p-4 font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
                      errors.passwordConfirm?.message &&
                      "border-2 border-red-500"
                    }`}
                  />
                )}
              />
              {errors.passwordConfirm?.message && (
                <Text className="mt-2 font-open-sans-bold text-red-500">
                  {errors.passwordConfirm.message.toString()}
                </Text>
              )}

              {/* username */}
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Username"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    placeholderTextColor="#6B7280"
                    className={`mt-3 rounded-2xl bg-input p-4  font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
                      errors.username?.message && "border-2 border-red-500"
                    }`}
                  />
                )}
              />
              {errors.username?.message && (
                <Text className="mt-2 font-open-sans-bold text-red-500">
                  {errors.username.message.toString()}
                </Text>
              )}
              <TouchableOpacity
                className=" mt-4  w-full self-center rounded-2xl bg-primary p-4   dark:bg-primary-dark"
                onPress={handleSubmit(onSignUpPress)}
              >
                <Text className="text-center font-open-sans-bold text-white">
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
}
