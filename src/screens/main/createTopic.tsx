import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
} from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingModal from "../../components/loadingModal";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { Topic } from "../../utils/types";
import { randomUUID } from "../../utils/random";
import { useUser } from "@clerk/clerk-expo";

const TopicSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(4, "Topic must be at least 4 characters.")
    .max(32, "Topic must be shorter than 32 characters."),
  description: z
    .string()
    .trim()
    .min(4, "Description must be at least 4 characters.")
    .max(32, "Description must be shorter than 32 characters."),
});

export default function CreateTopicScreen(
  params: RootStackScreenProps<"CreateTopic">,
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const user = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TopicSchema),
    defaultValues: { topic: "", description: "" },
  });

  const createTopic = async ({
    topic,
    description,
  }: z.infer<typeof TopicSchema>) => {
    setLoading(true);
    const newTopic: Topic = {
      id: randomUUID(15) as string,
      title: topic?.trim(),
      description: description?.trim(),
      flashcards: [],
      notes: [],
    };
    setDoc(doc(firestore, "subjects", params.route.params.subject.id), {
      authorId: user.user?.id as string,
      topics: [...params.route.params.topics, newTopic],
    });
    setSuccess(true);
    setLoading(false);
  };
  if (success) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-background-dark"
      >
        <SafeAreaView className="w-9/12 flex-1 justify-center self-center bg-background dark:bg-background-dark">
          <View>
            <View className=" items-center justify-center">
              <Feather name="check-circle" size={54} color="#16a34a" />
              <Text className="mt-4 text-center font-open-sans-bold text-2xl text-white">
                Successfully created!
              </Text>
              <Text className="mt-2 text-center font-open-sans-bold text-white opacity-50">
                Go back and enjoy your new topic...
              </Text>

              <TouchableOpacity
                onPress={() => params.navigation.goBack()}
                className="mt-4 flex-row items-center self-center rounded-xl bg-primary-dark p-2 py-3"
              >
                <Text className="px-8 font-open-sans-bold text-base text-white opacity-90">
                  Go back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <LoadingModal visible={loading} />
        <View className="flex flex-row items-center justify-between ">
          <TouchableOpacity
            onPress={() => params.navigation.goBack()}
            className=" flex aspect-square h-full w-1/12 items-center justify-center "
          >
            <AntDesign name="left" size={20} color={"white"} />
          </TouchableOpacity>

          <Text className="w-8/12 py-4 text-center font-open-sans-bold text-white"></Text>
        </View>

        <View className="w-full px-8">
          <View className="mb-4">
            <View className="mt-4 flex-row items-center justify-center ">
              <View className="opacity-90">
                {/* //TODO: add new topics */}
                <FontAwesome5 name="lightbulb" size={18} color="white" />
              </View>
              <Text className="ml-2 font-open-sans-bold text-lg text-white opacity-90">
                Create new topic
              </Text>
            </View>
            <Text className="text-center font-open-sans-semibold text-xs text-white opacity-60">
              {params.route.params.subject.title}
            </Text>
          </View>

          <Text className="mt-2 font-open-sans-semibold text-base text-white opacity-70">
            Topic name:
          </Text>

          <Controller
            control={control}
            name="topic"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                autoCapitalize="none"
                placeholder="Name it!"
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                placeholderTextColor="#6B7280"
                className={`mt-3 h-10 rounded-lg bg-card-dark px-2  font-open-sans-semibold text-base text-black dark:text-white`}
              />
            )}
          />
          {errors.topic?.message && (
            <Text className="mt-2 font-open-sans-semibold text-red-500">
              {errors.topic.message.toString()}
            </Text>
          )}

          <Text className="mt-8 font-open-sans-semibold text-base text-white opacity-70">
            Description:
          </Text>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                autoCapitalize="none"
                placeholder="Describe it!"
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                placeholderTextColor="#6B7280"
                className={`mt-3 h-10 rounded-lg bg-card-dark px-2  font-open-sans-semibold text-base text-black dark:text-white`}
              />
            )}
          />
          {errors.description?.message && (
            <Text className="mt-2 font-open-sans-semibold text-red-500">
              {errors.description.message.toString()}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(createTopic)}
          className="my-2  mt-8 flex-row items-center self-center rounded-xl bg-primary-dark p-4"
        >
          <Text className="px-8 font-open-sans-bold text-base text-white opacity-90">
            Create!
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
