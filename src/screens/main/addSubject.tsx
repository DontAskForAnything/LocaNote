import { useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { useClerk } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubjectNameSchema } from "../../utils/schemas";
import { z } from "zod";
import { SubjectItem } from "../../utils/types";
import LoadingModal from "../../components/loadingModal";
import { GoBackSignButton } from "../../components/goBackSignButton";
import * as Crypto from "expo-crypto";

const icons: Array<string> = [
  "book",
  "book-open",
  "dumbbell",
  "graduation-cap",
  "calculator",
  "laptop-code",
  "atom",
  "flask",
  "frog",
  "pen-nib",
];

const colors: Array<string> = [
  "#4287f5",
  "#00ccff",
  "#eb4034",
  "#ff00b3",
  "#72a872",
  "#16a34a",
  "#7a00ff",
  "#996cff",
];

export const AddSubjectScreen = ({
  route,
  navigation,
}: RootStackScreenProps<"AddSubjectScreen">) => {
  const { user } = useClerk();
  const [selectedIcon, setSelectedIcon] = useState<string>(icons[0] as string);
  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0] as string,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SubjectNameSchema),
    defaultValues: { lessonName: "" },
  });

  const addToDB = (values: z.infer<typeof SubjectNameSchema>): void => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      values = values as z.infer<typeof SubjectNameSchema>;
      const subjects: Array<SubjectItem> = [...route.params];
      subjects.pop();
      if (user) {
        const id = Crypto.randomUUID();
        setDoc(doc(firestore, "users", user.id), {
          subjects: [
            ...subjects,
            {
              color: selectedColor,
              icon: selectedIcon,
              id,
              title: values.lessonName,
            },
          ],
        }).then(() => {
          navigation.navigate("MainScreen", { refresh: Math.random() });
        });
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background-dark p-4 pt-12">
      <LoadingModal visible={loading} />
      {/* Temp solution design will be changed */}
      <GoBackSignButton onPress={() => navigation.goBack()} />
      <Controller
        control={control}
        name="lessonName"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            autoCapitalize="none"
            placeholder="Lesson Name"
            value={value}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            placeholderTextColor="#6B7280"
            className={`bg-input mt-10 rounded-2xl p-4 font-open-sans-regular text-black dark:bg-card-dark dark:text-white ${
              errors.lessonName?.message && "border-2 border-red-500"
            }`}
          />
        )}
      />
      {errors.lessonName?.message && (
        <Text className="mt-2 font-open-sans-semibold text-red-500">
          {errors.lessonName.message.toString()}
        </Text>
      )}
      <Text
        className={"my-6 text-center font-poppins-medium text-lg text-white"}
      >
        Choose an Icon:
      </Text>
      <View className={"flex gap-12"}>
        <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          numColumns={5}
          keyExtractor={(item) => item}
          data={icons}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                className={`m-1 h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-700 ${
                  selectedIcon === item && "border-primary"
                }`}
                onPress={() => {
                  setSelectedIcon(item);
                }}
              >
                <FontAwesome5
                  name={item}
                  size={32}
                  color={selectedIcon === item ? "#16a34a" : "white"}
                />
              </TouchableOpacity>
            );
          }}
        />
        <Text
          className={"mt-6 text-center font-poppins-medium text-lg text-white"}
        >
          Pick a color:
        </Text>
        <FlatList
          numColumns={4}
          keyExtractor={(item) => item}
          data={colors}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedColor(item);
                }}
                style={{ backgroundColor: item }}
                className={`m-1 flex h-20 flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl border-2 p-4 ${
                  selectedColor === item && "border-white"
                }`}
              ></TouchableOpacity>
            );
          }}
        />
      </View>
      <TouchableOpacity
        className={`absolute bottom-0 left-0 right-0 m-4 rounded-2xl bg-primary p-4`}
        onPress={handleSubmit(addToDB)}
      >
        <Text className="text-center font-open-sans-bold text-white">
          Add Subject
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
