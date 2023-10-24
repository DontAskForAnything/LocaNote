import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {  FontAwesome5 } from "@expo/vector-icons";

export const MainScreen = ({
  navigation,
}: RootStackScreenProps<"MainScreen">) => {
  const insets = useSafeAreaInsets();
  // TODO: pull this from firebase
  const subjects = [
    { id: "ygfC", title: "P.E.", icon: "dumbbell", color: "#4287f5" },
    { id: "qONy", title: "Biology", icon: "frog", color: "#fcba03" },
    { id: "REXG", title: "EwogRq", icon: "dumbbell", color: "#64F9C4" },
    {
      id: "ScjL",
      title: "sJWzxoUUbHEvbeDqdqEa",
      icon: "frog",
      color: "#7EE040",
    },
    { id: "footer", title: "HEHEHE", icon: "house" },
  ];
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <Text className="my-4 font-open-sans-bold  text-xl text-neutral-600">
          Your subjects:
        </Text>
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.title}
          numColumns={3}
          renderItem={({ item }) => {
            if (item.id === "footer") {
              return (
                <TouchableOpacity
                  onPress={() => navigation.push("AddSubjectScreen")}
                  style={{ backgroundColor: "red" }}
                  className="m-1 flex aspect-square flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl p-4"
                >
                  <Text>Add new subject</Text>
                </TouchableOpacity>
              );
            } else {
              // Render the subjects
              return (
                <TouchableOpacity
                  onPress={() => navigation.push("SubjectScreen")}
                  style={{ backgroundColor: item.color }}
                  className="m-1 flex aspect-square  flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl p-4"
                >
                  <View className="absolute z-10 flex-1 opacity-30">
                    <FontAwesome5 name={item.icon} size={50} color={"white"} />
                  </View>

                  <Text className="z-20">{item.title}</Text>
                </TouchableOpacity>
              );
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
};
