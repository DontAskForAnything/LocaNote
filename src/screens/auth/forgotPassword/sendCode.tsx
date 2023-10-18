import React from "react";
import { RootStackScreenProps } from "../../../types/navigation";
import { NavigationBar } from "../../../components/navigationBar";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema, PhoneSchema } from "../../../utils/schemas";
import { z } from "zod";
import { useSignIn } from "@clerk/clerk-expo";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { SafeAreaView } from "react-native-safe-area-context";

const EmailSchemaObject = z.object({ emailAddress: EmailSchema });
const PhoneSchemaObject = z.object({ phoneNumber: PhoneSchema });

export default function ForgotPasswordSendCodeScreen({
  navigation,
}: RootStackScreenProps<"ForgotPasswordSendCode">) {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailSchemaObject),
    defaultValues: {
      emailAddress: "",
      phoneNumber: "",
    },
  });

  const { signIn } = useSignIn();
  const sendCode = async (
    values:
      | z.infer<typeof EmailSchemaObject>
      | z.infer<typeof PhoneSchemaObject>,
  ) => {
    let identifier: string;
    try {
      values = values as z.infer<typeof EmailSchemaObject>;
      identifier = values.emailAddress;
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier,
      });

      navigation.navigate("ForgotPasswordCodeVerify", {
        verificationType: "email",
        identifier,
      });
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.errors) {
          if (
            err.errors[0]?.code == "form_conditional_param_value_disallowed"
          ) {
            setError("emailAddress", {
              message:
                "Password reset unavailable. Please use your connected account's password recovery options.",
            });
            return;
          }
          setError("emailAddress", { message: err.errors[0]?.longMessage });
        }
      }
    }
  };

  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex bg-background dark:bg-background-dark">
        <NavigationBar title="Reset" onPress={() => navigation.goBack()} />
        <View className="flex h-screen bg-background px-5 pt-4 dark:bg-background-dark">
          <Text className="text-center font-open-sans-semibold text-base text-black dark:text-white">
            Enter your email
          </Text>
          <Text className="text-x mb-2 p-2 text-center font-open-sans-regular dark:text-blue-600">
            We will send a code to your email
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
                onChangeText={onChange}
                placeholderTextColor={"rgb(107,114,128)"}
                className={`rounded-2xl bg-input  p-4 font-open-sans-regular text-black  placeholder-gray-500  dark:bg-input-dark dark:text-white ${
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

          <TouchableOpacity
            className="mb-6 mt-4 rounded-2xl bg-primary p-4   dark:bg-primary-dark"
            onPress={handleSubmit(sendCode)}
          >
            <Text className="text-center font-open-sans-semibold text-white">
              Send code
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
