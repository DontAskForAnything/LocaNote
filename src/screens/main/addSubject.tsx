import { useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorPicker, fromHsv } from "react-native-color-picker";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { useClerk } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubjectNameSchema } from "../../utils/schemas";
import { z } from "zod";
import { SubjectItem } from "../../utils/types";

export const AddSubjectScreen = ({
  route,
  navigation,
}: RootStackScreenProps<"AddSubjectScreen">) => {
  const { user } = useClerk();
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
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
  //TODO: Walidacja ikon i koloru
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SubjectNameSchema),
    defaultValues: { lessonName: "" },
  });

  const addToDB = (values: z.infer<typeof SubjectNameSchema>): void => {
    if (selectedIcon !== "" && selectedColor !== "") {
      try {
        values = values as z.infer<typeof SubjectNameSchema>;
        const subjects: Array<SubjectItem> = [...route.params];
        subjects.pop();
        if (user) {
          updateDoc(doc(firestore, "users", user.id), {
            subjects: [
              ...subjects,
              {
                color: selectedColor,
                icon: selectedIcon,
                id: values.lessonName + selectedColor,
                title: values.lessonName,
              },
            ],
          }).then(() => {
            navigation.pop();
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background-dark p-4 pt-12">
      <Controller
        control={control}
        name="lessonName"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            value={value}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            placeholderTextColor="#6B7280"
            className={`bg-input rounded-2xl p-4  font-open-sans-regular text-black dark:bg-card-dark dark:text-white ${
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
        Choose an Icon:{" "}
      </Text>
      <View className={"gap-12"}>
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
        <ColorPicker
          onColorChange={(color) => setSelectedColor(fromHsv(color))}
          style={{ height: 250 }}
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
