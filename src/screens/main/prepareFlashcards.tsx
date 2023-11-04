import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import { Flashcard } from "../../utils/types";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Dialog from "react-native-dialog";

type textType = "question" | "answer";
export const PrepareFlashcardsScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"PrepareFlashcardsScreen">) => {
  //ts-ignore because typescript cannot be sure but correct index is always passed
  const [currentFlashcards, setCurrentFlashcards] = useState<Array<Flashcard>>(
    route.params.topics[route.params.index]?.flashcards
      ? //@ts-ignore
        [...route.params.topics[route.params.index].flashcards]
      : [],
  );
  const [collapsedFlashcards, setCollapsedFlashcards] = useState<number[]>(
    route.params.topics[route.params.index]?.flashcards
      ? Array.from({ length: 11 }, (_, index) => index)
      : [],
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [displayDismissMessage, setDisplayDismissMessage] =
    useState<boolean>(false);
  const [lastState, setLastState] = useState<Array<Flashcard>>(
    route.params.topics[route.params.index]?.flashcards
      ? //@ts-ignore
        [...route.params.topics[route.params.index].flashcards]
      : [],
  );
  const handleTextChange = (
    textType: textType,
    index: number,
    value: string,
  ): void => {
    const tempCards = [...currentFlashcards];
    if (textType === "question") {
      //@ts-ignore
      tempCards[index].question = value;
    } else {
      //@ts-ignore
      tempCards[index].answer = value;
    }
    setIsChanged(JSON.stringify(tempCards) !== JSON.stringify(lastState));
    setCurrentFlashcards(tempCards);
  };
  const handleDeleteFlashcard = (index: number): void => {
    const tempCards = [...currentFlashcards];
    tempCards.splice(index, 1);
    setIsChanged(JSON.stringify(tempCards) !== JSON.stringify(lastState));
    setCurrentFlashcards(tempCards);
  };

  const handleSave = (): void => {
    const tempSubject = [...route.params.topics];
    const tempTopic = route.params.topics[route.params.index];
    if (tempTopic) {
      tempTopic.flashcards = currentFlashcards;
      tempSubject[route.params.index] = tempTopic;
      updateDoc(doc(firestore, "subjects", route.params.subjectID), {
        topics: tempSubject,
      }).then(() => {
        setIsChanged(false);
        setLastState(currentFlashcards);
      });
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <Dialog.Container
          contentStyle={{ backgroundColor: "#1B1B1B", borderRadius: 20 }}
          visible={displayDismissMessage}
        >
          <Dialog.Title>Dismiss all changes?</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to dismiss all changes?
          </Dialog.Description>
          <Dialog.Button
            bold={true}
            color="white"
            label="No"
            style={{}}
            onPress={() => {
              setDisplayDismissMessage(false);
            }}
          />
          <Dialog.Button
            bold={true}
            color="red"
            label="Yes"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </Dialog.Container>

        <View className="flex flex-row items-center justify-between pb-2">
          <TouchableOpacity
            onPress={() => {
              if (isChanged) {
                setDisplayDismissMessage(true);
              } else {
                navigation.goBack();
              }
            }}
            className=" flex aspect-square h-full w-1/12 items-center justify-center "
          >
            <AntDesign name="left" size={20} color={"white"} />
          </TouchableOpacity>

          <Text className="w-8/12 py-4 text-center font-open-sans-bold text-white">
            Your flashcards
          </Text>

          <TouchableOpacity
            className={`flex aspect-square h-10 items-center justify-center rounded-xl  bg-primary-dark ${
              !isChanged && "opacity-30"
            }`}
            onPress={handleSave}
            disabled={!isChanged}
          >
            <AntDesign name="save" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {currentFlashcards.length === 0 ? (
          <View className="mt-12 w-9/12 items-center self-center bg-background dark:bg-background-dark">
            <MaterialCommunityIcons
              name="cards-outline"
              size={54}
              color="#16a34a"
            />
            <Text className="mt-4 self-stretch text-center font-open-sans-bold text-3xl text-white">
              No flashcards!
            </Text>
            <Text className="mt-2 self-stretch text-center font-open-sans-semibold text-sm text-white opacity-70">
              No need to fret!{"\n"}Simply click the button below to create
              first flashcard!
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsChanged(true);
                setCurrentFlashcards([
                  ...currentFlashcards,
                  { question: "", answer: "" },
                ]);
              }}
              className="mt-6 flex-row items-center justify-center self-center rounded-xl  bg-primary-dark p-4"
            >
              <Text className="text-center font-open-sans-bold text-base text-white">
                Create flashcard
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView className={"mb-28 w-10/12 self-center"}>
            {currentFlashcards.map((flashcard, cardIndex) => {
              if (collapsedFlashcards.includes(cardIndex)) {
                return (
                  <Pressable
                    onPress={() =>
                      setCollapsedFlashcards((collapsed) =>
                        collapsed.filter((index) => index !== cardIndex),
                      )
                    }
                    key={cardIndex}
                    className={`${
                      cardIndex !== 0 ? "mt-4" : "mt-2"
                    } w-full flex-row self-center rounded-xl bg-cardLight-dark p-4 px-6`}
                  >
                    <View className="flex-row">
                      <Text className="font-open-sans-semibold text-base text-white">
                        #{cardIndex + 1}
                      </Text>
                      <Text className="pl-4 font-open-sans-semibold text-base text-white opacity-70">
                        {flashcard.question.trim().length > 0
                          ? flashcard.question
                          : "No question provided :<"}
                      </Text>
                    </View>
                  </Pressable>
                );
              }
              return (
                <Pressable
                  onPress={() =>
                    setCollapsedFlashcards((collapsed) => [
                      ...collapsed,
                      cardIndex,
                    ])
                  }
                  key={cardIndex}
                  className={`${
                    cardIndex !== 0 ? "mt-4" : "mt-2"
                  } aspect-square w-full justify-center self-center rounded-xl bg-cardLight-dark px-4 pb-6`}
                >
                  <Text className="mb-2 text-center  font-open-sans-semibold text-lg text-white">
                    Flashcard #{cardIndex + 1}
                  </Text>
                  <Text className="mb-2 font-open-sans-semibold text-sm text-white">
                    Question:
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Question"
                    value={flashcard.question}
                    onChangeText={(value) =>
                      handleTextChange("question", cardIndex, value)
                    }
                    placeholderTextColor="#6B7280"
                    className={`bg-input my-1 rounded-xl p-2 px-4 font-open-sans-regular text-black dark:bg-card-dark dark:text-white`}
                  />

                  <Text className="mb-2 mt-4 font-open-sans-semibold text-sm text-white">
                    Answer:
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Answer"
                    value={flashcard.answer}
                    onChangeText={(value) =>
                      handleTextChange("answer", cardIndex, value)
                    }
                    placeholderTextColor="#6B7280"
                    className={`bg-input my-1 rounded-xl p-2 px-4 font-open-sans-regular text-black dark:bg-card-dark dark:text-white`}
                  />
                  <TouchableOpacity
                    className="absolute bottom-4 w-full self-center"
                    onPress={() => handleDeleteFlashcard(cardIndex)}
                  >
                    <Text
                      className={
                        "text-center  font-open-sans-semibold text-base text-red-500"
                      }
                    >
                      Remove
                    </Text>
                  </TouchableOpacity>
                </Pressable>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setIsChanged(true);
                setCurrentFlashcards([
                  ...currentFlashcards,
                  { question: "", answer: "" },
                ]);
              }}
              className={
                "mt-4 w-full self-center rounded-xl bg-cardLight-dark  p-4"
              }
            >
              <Text className="text-center font-open-sans-bold text-base text-white opacity-70">
                Add flashcard
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        {currentFlashcards.length > 0 && (
          <View className={"absolute bottom-6 w-4/5 self-center"}>
            <TouchableOpacity
              onPress={() => {
                handleSave();
                navigation.navigate("FlashcardsScreen", currentFlashcards);
              }}
              className={"rounded-xl bg-primary p-4"}
            >
              <Text className={"text-center text-lg font-bold text-white"}>
                Show Flashcards
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};
