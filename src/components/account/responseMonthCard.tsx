import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

export const ResponseMonthCard = <T extends keyof RootStackParamList>({
  item,
  navigation,
}: {
  item: {
    month: string;
    openDetails: boolean;
    questions: { question: string; date: string; answerId: string }[];
  };
  navigation: NativeStackNavigationProp<RootStackParamList, T, undefined>;
}) => {
  const [month, setMonth] = React.useState(item);

  return (
    <Pressable
      className="mb-4 rounded-xl bg-card-dark px-5 pb-5"
      onPress={() => {
        const copy = { ...month };
        copy.openDetails = !copy.openDetails;
        setMonth(copy);
      }}
    >
      <View className="flex flex-row items-center justify-between pt-5">
        <Text className="font-open-sans-regular text-base text-white">
          {month.month}
        </Text>
        <FontAwesome5
          name={month.openDetails ? "chevron-down" : "chevron-up"}
          color={"white"}
          size={20}
        />
      </View>

      {month.openDetails && (
        <>
          <View className="h-2" />
          {month.questions.map((question, index) => (
            <TouchableOpacity
              key={index}
              className="my-3 flex flex-row justify-around text-sm"
              onPress={() =>
                navigation.navigate("CommentDetails", {
                  answerId: question.answerId,
                })
              }
            >
              <Text className="w-4/6 pr-4 font-open-sans-regular text-xs text-white">
                {question.question}
              </Text>
              <Text className="w-2/6 self-center text-center font-open-sans-regular text-xs text-white">
                {question.date}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </Pressable>
  );
};
