import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useClerk, useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../../types/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "../../../utils/schemas";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoBackSignButton } from "../../../components/goBackSignButton";

export default function ForgotPasswordRestartScreen({
  navigation,
}: RootStackScreenProps<"ForgotPasswordRestart">) {
  const { isLoaded, signIn } = useSignIn();
  const { signOut } = useClerk();
  const [successRestart, setSuccessRestart] = React.useState(false);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { passwordConfirm: "", password: "" },
  });

  const onPasswordReset = async (
    values: z.infer<typeof ResetPasswordSchema>,
  ) => {
    if (!isLoaded) return;

    try {
      await signIn?.resetPassword({ password: values.password });
      signOut();
      setSuccessRestart(true);
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setError("password", { message: err.errors[0]?.longMessage });
      }
    }
  };

  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <View className="h-screen bg-background px-5 pt-6 dark:bg-background-dark">
          {!successRestart && (
            <GoBackSignButton onPress={() => navigation.goBack()} />
          )}
          <View className="flex h-screen justify-center bg-background  dark:bg-background-dark">
            {!successRestart ? (
              <>
                <Text className="text-center font-open-sans-semibold text-base text-black dark:text-white">
                  Enter your new password
                </Text>

                {/* password */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      autoCapitalize="none"
                      secureTextEntry={true}
                      placeholder="New Password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholderTextColor="#6B7280"
                      className={`mt-4 rounded-2xl bg-input p-4  font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
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

                {/* confirm password */}
                <Controller
                  control={control}
                  name="passwordConfirm"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      autoCapitalize="none"
                      secureTextEntry={true}
                      placeholder="Confirm New Password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholderTextColor="#6B7280"
                      className={`mt-4 rounded-2xl bg-input  p-4 font-open-sans-regular text-black dark:bg-input-dark dark:text-white ${
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

                {/* Sign In button */}
                <TouchableOpacity
                  className="mb-6 mt-4  rounded-2xl bg-primary p-4   dark:bg-primary-dark"
                  onPress={handleSubmit(onPasswordReset)}
                >
                  <Text className="text-center font-open-sans-semibold text-white">
                    Reset Password
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className="p-4 text-center font-open-sans-bold text-base dark:text-primary-dark">
                  Successfully changed password!
                </Text>
                <TouchableOpacity
                  className="mb-6 mt-2  rounded-2xl bg-primary p-4   dark:bg-primary-dark"
                  onPress={() => {
                    navigation.navigate("LogInStrategy");
                  }}
                >
                  <Text className="text-center font-open-sans-semibold text-white">
                    Log In
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
