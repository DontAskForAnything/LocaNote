import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import { GoBackSignButton } from "../../components/goBackSignButton";

const letters = ["A", "B", "C", "D"];
type QuizAnswer = {
  questionIndex: number;
  answerIndex: number;
};
export const QuizScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"QuizScreen">) => {
  const [index, setIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Array<QuizAnswer>>([]);

  const handleCheckAnswer = (answerIndex: number): void => {
    if (!answers.some((el) => el.questionIndex === index)) {
      setAnswers([
        ...answers,
        { questionIndex: index, answerIndex: answerIndex },
      ]);
    }
  };

  return (
    <View className={"flex flex-1 bg-background-dark pt-12"}>
      <GoBackSignButton onPress={() => navigation.goBack()} />

      <View className={"flex-1"}>
        <Text className="text-center text-2xl font-bold text-white">
          Question
        </Text>
        <Text className="mb-12 text-center text-xl text-white">
          {route.params[index]?.question}
        </Text>
        <View className={"mx-8"}>
          {route.params[index]?.answers.map((answer, i) => {
            const isAnswered = answers.some((obj) => obj.questionIndex === index);
            const isCorrectAnswer = i === route.params[index]?.correctAnswerIndex;
            let isSelectedAnswer = false;
            answers.forEach((obj) => {
              if (obj.questionIndex === index && obj.answerIndex === i) {
                isSelectedAnswer = true;
              }
            });
            return (
              <Pressable
                className={`my-1 flex-row rounded bg-cardLight-dark p-2 ${
                  isAnswered &&
                  isSelectedAnswer &&
                  !isCorrectAnswer &&
                  "bg-red-500"
                } ${isAnswered && isCorrectAnswer && "bg-primary"}`}
                onPress={() => handleCheckAnswer(i)}
              >
                <Text className={"mr-4 text-lg text-white"}>{letters[i]}:</Text>
                <Text className={"text-lg text-white"}>{answer}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View className={"w-full flex-row items-center justify-between p-2"}>
        {index != 0 ? (
          <TouchableOpacity
            className={"m-4 w-28 rounded-xl bg-primary p-2"}
            onPress={() => setIndex(index - 1)}
          >
            <Text className={"text-center text-lg text-white"}>Previous</Text>
          </TouchableOpacity>
        ) : (
          <View className={"m-4 w-28 border-2"}></View>
        )}
        <Text className={"text-center text-xl font-bold text-white"}>
          {index + 1} / {route.params.length}
        </Text>
        {index != route.params.length - 1 ? (
          <TouchableOpacity
            className={"m-4 w-28 rounded-xl bg-primary p-2"}
            onPress={() => setIndex(index + 1)}
          >
            <Text className={"text-center text-lg text-white"}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View className={"m-4 w-28"}></View>
        )}
      </View>
    </View>
  );
};
