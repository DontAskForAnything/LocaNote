import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types/navigation";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { noteAPI } from "../../test/apiTemp";
import { useState } from "react";
import { Flashcard } from "../../utils/types";
const flashcards: Array<Flashcard> = [
  { question: "What is?", answer: "It is indeed" },
  { question: "What was?", answer: "Yes, It was" },
  { question: "Is taxation theft?", answer: "I don't think so" },
];
export const TopicScreen = (params: RootStackScreenProps<"TopicScreen">) => {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState<string | []>(params.route.params.notes);

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => params.navigation.goBack()}
            className="flex aspect-square h-full w-1/12 items-center justify-center "
          >
            <AntDesign name="left" size={20} color={"white"} />
          </TouchableOpacity>

          <Text className="w-8/12 py-4 text-center font-open-sans-bold text-white">
            {params.route.params.title}
          </Text>

          <View className=" flex aspect-square w-1/12 items-center justify-center"></View>
        </View>

        {note.length > 0 && (
          <View className="mb-4 flex flex-row overflow-hidden rounded-xl">
            {/* //TODO: navigate to flashcards */}
            <TouchableOpacity
              className="w-1/2 bg-primary-dark py-2"
              onPress={() =>
                params.navigation.navigate("FlashcardsScreen", flashcards)
              }
            >
              <Text className="text-center font-open-sans-bold text-white">
                Flashcards
              </Text>
            </TouchableOpacity>
            {/* //TODO: navigate to Quizz */}
            <TouchableOpacity
              className="w-1/2 py-2"
              style={{ backgroundColor: "#1CD05E" }}
            >
              <Text className="text-center font-open-sans-bold text-white">
                Quiz
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {note.length > 0 ? (
          <>
            <Text className="mx-2 font-open-sans-bold text-base text-white opacity-50">
              Note:
            </Text>

            <View className="mb-4 flex-1 p-2">
              <ScrollView className="h-1/2">
                <Text className="font-open-sans-semibold text-sm text-white opacity-80">
                  {note}
                </Text>
              </ScrollView>
            </View>
          </>
        ) : (
          <View className=" mt-12 items-center justify-center">
            <FontAwesome5 name="lightbulb" size={54} color="#16a34a" />
            <Text className="mt-4 text-center font-open-sans-bold text-2xl text-white">
              This topic is empty
            </Text>
            <Text className="mt-2 text-center font-open-sans-bold text-white opacity-50">
              Generate note, flashcards and quiz{"\n"} using button below...
            </Text>

            <TouchableOpacity
              //TODO: generate notes, flashcards and quiz
              //@ts-ignore
              onPress={() => setNote(noteAPI[0])}
              className="mt-4 flex-row items-center self-center rounded-xl bg-primary-dark p-2 py-3"
            >
              <Text className="px-8 font-open-sans-bold text-base text-white opacity-90">
                Generate
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};
