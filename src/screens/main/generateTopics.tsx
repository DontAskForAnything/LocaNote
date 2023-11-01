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

const availableCount = ["10", "5", "1"];

const TopicSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(4, "Description must be at least 4 characters.")
    .max(32, "Description must be shorter than 32 characters."),
});

export default function GenerateTopicsScreen(
  params: RootStackScreenProps<"GenerateTopics">,
) {
  const [selectedCount, setSelectedCount] = useState<string>(
    availableCount[0] as string,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TopicSchema),
    defaultValues: { topic: "" },
  });

  async function addAiTopics() {
    //TODO: Change this to let user create own topics
    // if (topicsAPI) {
    //   const csvLines =
    //     //@ts-ignore
    //     topicsAPI[Math.floor(Math.random() * topicsAPI.length)].split("\n");
    //   const newTopics: Topic[] = [];
    //   csvLines.forEach((line) => {
    //     const [key, value] = line.split(":");
    //     newTopics.push({
    //       id: Crypto.randomUUID() as string,
    //       title: key?.trim(),
    //       description: value?.trim(),
    //       flashcards: [],
    //       questions: [],
    //       notes: [],
    //     } as Topic);
    //   });
    //   setDoc(doc(firestore, "subjects", params.route.params.subject.id), {
    //     topics: [...params.route.params.topics, ...newTopics],
    //   });
    // }
  }

  const GenerateTopics = async ({ topic }: z.infer<typeof TopicSchema>) => {
    //TODO: Implement api call and ai to generate
    setLoading(true);
    console.log("Topic: ", topic);
    console.log("Count Of Lessons: ", selectedCount);
    addAiTopics();
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
                Go back and refresh topics...
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
                <FontAwesome5 name="robot" size={18} color="white" />
              </View>
              <Text className="ml-2 font-open-sans-bold text-lg text-white opacity-90">
                Generate new topics
              </Text>
            </View>
            <Text className="text-center font-open-sans-semibold text-xs text-white opacity-60">
              {params.route.params.subject.title}
            </Text>
          </View>

          <Text className="mt-2 font-open-sans-semibold text-base text-white opacity-70">
            What would you like to learn?
          </Text>

          <Controller
            control={control}
            name="topic"
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
          {errors.topic?.message && (
            <Text className="mt-2 font-open-sans-semibold text-red-500">
              {errors.topic.message.toString()}
            </Text>
          )}

          <Text className="mt-4 font-open-sans-semibold text-base text-white opacity-70">
            How many lessons related to this topic would you like?
          </Text>

          <View className=" mt-4 flex-row justify-around">
            {availableCount.map((el) => (
              <TouchableOpacity
                onPress={() => setSelectedCount(el)}
                key={el}
                className={`aspect-square h-14 rounded-lg ${
                  selectedCount !== el ? `bg-card-dark` : `bg-primary`
                } items-center justify-center`}
              >
                <Text className="font-open-sans-bold text-xl text-white opacity-70">
                  {el}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(GenerateTopics)}
          className="my-2  mt-8 flex-row items-center self-center rounded-xl bg-primary-dark p-4"
        >
          <Text className="px-8 font-open-sans-bold text-base text-white opacity-90">
            Generate!
          </Text>
        </TouchableOpacity>

        <Text className="absolute bottom-4 self-center font-open-sans-semibold text-xs text-white opacity-50">
          Note that AI may give inaccurate data!
        </Text>
      </SafeAreaView>
    </View>
  );
}
