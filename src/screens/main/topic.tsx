import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types/navigation";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { noteAPI } from "../../test/apiTemp";
import { useState } from "react";
import Markdown from "react-native-marked";

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
            <TouchableOpacity className="w-1/2 bg-primary-dark py-2">
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

        {note.length > 0 && !Array.isArray(note) ? (
          <>
            <Text className="mx-2 font-open-sans-bold text-base text-white opacity-50">
              Note:
            </Text>

            <View className="mb-4 flex-1 p-2">
              <Markdown
                value={note}
                flatListProps={{
                  contentContainerStyle: { backgroundColor: "#141416" },
                  initialNumToRender: 8,
                }}
              />
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
              onPress={() => {
                //@ts-ignore
                const lines = noteAPI[0].split("\n");

                // Define a regular expression pattern to match lines starting with '-'
                function removeStarsFromDashLines(line: string) {
                  if (/^[^\S\r\n]*-/.test(line)) {
                    console.log(line);
                    return line.replace(/\*\*/g, "");
                  }
                  return line;
                }

                const modifiedText = lines
                  .map(removeStarsFromDashLines)
                  .join("\n");

                setNote(modifiedText);
              }}
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
