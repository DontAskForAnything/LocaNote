import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types/navigation";
import { NavigationBar } from "../../components/navigationBar";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailLogInSchema } from "../../utils/schemas";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogInScreen({
  navigation,
}: RootStackScreenProps<"LogIn">) {
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
      <SafeAreaView className="flex bg-background dark:bg-background-dark">
        <NavigationBar title="Log In" onPress={() => navigation.goBack()} />
        <View className="h-screen bg-background px-5 pt-3 dark:bg-background-dark">
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
                className={`rounded-2xl bg-input  p-4  font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
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
            <Text className="mt-2 font-open-sans-bold text-red-500">
              {errors.password.message.toString()}
            </Text>
          )}

          {/* Sign In button */}
          <TouchableOpacity
            className="mb-6 mt-4  rounded-2xl bg-primary p-4   dark:bg-primary-dark"
            onPress={handleSubmit(onSignInPress)}
          >
            <Text className="text-center font-open-sans-bold text-white">
              Log In
            </Text>
          </TouchableOpacity>

          {/* Forgotten password  */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPasswordStrategy")}
          >
            <Text className="text-center font-open-sans-bold text-black dark:text-white">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
