import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types/navigation";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import Markdown from "react-native-marked";
import { generateNote } from "../../utils/ai/note";
import { generateFlashcards } from "../../utils/ai/flashcards";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { Flashcard } from "../../utils/types";

export const TopicScreen = (params: RootStackScreenProps<"TopicScreen">) => {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState<string | []>(
    params.route.params.topic.notes,
  );
  const [flashcards, setFlashcards] = useState<Flashcard[] | []>(
    params.route.params.topic.flashcards,
  );
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-background-dark"
      >
        <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
          <View className=" flex-1 items-center justify-center">
            <FontAwesome5 name="robot" size={54} color="#16a34a" />
            <Text className="mt-4 text-center font-open-sans-bold text-2xl text-white">
              AI is thinking
            </Text>

            {note.length > 0 ? (
              <View className="mt-4 flex-row items-center justify-center">
                <FontAwesome5 name="check" size={20} color="green" />
                <Text className="ml-4  text-center font-open-sans-bold text-white opacity-70">
                  Notes: generated!
                </Text>
              </View>
            ) : (
              <View className="mt-4 flex-row items-center justify-center">
                <ActivityIndicator size="small" color={"red"} />
                <Text className="ml-4  text-center font-open-sans-bold text-white opacity-70">
                  Notes: generating...
                </Text>
              </View>
            )}

            {note.length > 0 ? (
              <>
                {flashcards.length > 0 ? (
                  <View className="mt-4 flex-row items-center justify-center">
                    <FontAwesome5 name="check" size={20} color="green" />
                    <Text className="mt-2 text-center font-open-sans-bold text-white opacity-70">
                      Flashcards: generated!
                    </Text>
                  </View>
                ) : (
                  <View className="mt-4 flex-row items-center justify-center">
                    <ActivityIndicator size="small" color={"red"} />
                    <Text className="ml-4  text-center font-open-sans-bold text-white opacity-70">
                      Flashcards: generating...
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text className="ml-4 mt-4  text-center font-open-sans-bold text-white opacity-70">
                Flashcards: waiting...
              </Text>
            )}
          </View>

          <Text className="absolute bottom-4 self-center font-open-sans-semibold text-xs text-white opacity-50">
            AI generating make take around 1 - 1:30 min
          </Text>
        </SafeAreaView>
      </View>
    );
  }
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
            {params.route.params.topic.title}
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
              //TODO: quiz
              onPress={() => {
                setLoading(true);
                generateNote(
                  params.route.params.topic.title as string,
                  params.route.params.topic.description as string,
                ).then((note) => {
                  console.log(note);
                  setNote(note);
                  generateFlashcards(note)
                    .then((flash) => {
                      console.log(flash);
                      const topics = params.route.params.topics;
                      if (topics) {
                        // Ignore because we use targetTopic but eslint doesn't see this
                        // eslint-disable-next-line
                        let targetTopic = topics.find(
                          (topic) => topic.id === params.route.params.topic.id,
                        );

                        if (targetTopic) {
                          targetTopic.notes = note;
                          targetTopic.flashcards = flash;

                          setDoc(
                            doc(
                              firestore,
                              "subjects",
                              params.route.params.subjectID,
                            ),
                            {
                              topics: [...topics],
                            },
                          );

                          setFlashcards(flash);
                        }
                      }
                    })
                    .finally(() => setLoading(false));
                });
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
