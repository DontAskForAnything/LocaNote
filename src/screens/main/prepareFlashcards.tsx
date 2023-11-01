import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import { Flashcard } from "../../utils/types";
import { AntDesign } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";

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
  const [isChanged, setIsChanged] = useState<boolean>(false);
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
    console.log(JSON.stringify(tempCards));
    console.log(JSON.stringify(lastState[route.params.index]));
    setIsChanged(JSON.stringify(tempCards) !== JSON.stringify(lastState));
    setCurrentFlashcards(tempCards);
  };

  const handleSave = (): void => {
    const tempSubject = [...route.params.topics];
    const tempTopic = route.params.topics[route.params.index];
    if (tempTopic) {
      console.log(tempSubject);
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
  return (
    <View className={"flex flex-1 items-center bg-background-dark"}>
      <View className={"mb-4 flex w-4/5 flex-row items-center justify-between"}>
        <TouchableOpacity
          onPress={() => {
            if (isChanged) {
              Alert.alert(
                "Dismiss all changes?",
                "Are you sure you want to dismiss all changes?",
                [
                  { text: "Yes", onPress: () => navigation.goBack() },
                  {
                    text: "No",
                    onPress: () => {},
                    style: "cancel",
                  },
                ],
                { cancelable: true },
              );
            } else {
              navigation.goBack();
            }
          }}
          className="flex aspect-square h-full w-1/12 items-center justify-center "
        >
          <AntDesign name="left" size={20} color={"white"} />
        </TouchableOpacity>
        <Text className={"font-poppins-medium text-2xl text-white "}>
          Your flashcards
        </Text>
        {isChanged ? (
          <TouchableOpacity
            className={"rounded-lg bg-primary p-2"}
            onPress={handleSave}
          >
            <AntDesign name="save" size={31} color={"white"} />
          </TouchableOpacity>
        ) : (
          <View className={"h-12 w-12"}></View>
        )}
      </View>
      {currentFlashcards.length === 0 ? (
        <View>
          <Text className={"text-base text-white"}>
            You don't have any flashcards!
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsChanged(true);
              setCurrentFlashcards([
                ...currentFlashcards,
                { question: "", answer: "" },
              ]);
            }}
            className="mt-4 flex-row items-center justify-center self-center rounded-xl  bg-primary-dark p-4"
          >
            <Text className="text-center font-open-sans-bold text-base text-white">
              Add flashcard
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className={"mb-28 w-4/5"}>
          {currentFlashcards.map((flashcard, cardIndex) => {
            return (
              <View
                key={cardIndex}
                className={
                  "my-2 rounded-xl border-2 border-slate-500 bg-cardLight-dark p-2"
                }
              >
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
                  onPress={() => handleDeleteFlashcard(cardIndex)}
                >
                  <Text className={"p-2 text-center text-red-500"}>Remove</Text>
                </TouchableOpacity>
              </View>
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
            className="mt-4 items-center justify-center self-center rounded-xl  bg-primary-dark p-4"
          >
            <Text className="text-center font-open-sans-bold text-base text-white">
              Add flashcard
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      <View className={"absolute bottom-8 w-4/5"}>
        <TouchableOpacity
          onPress={() => {
            handleSave();
            navigation.navigate("FlashcardsScreen", currentFlashcards);
          }}
          className={"rounded-xl bg-primary p-4"}
        >
          <Text className={"text-center text-lg font-bold text-white"}>
            Start cards
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
