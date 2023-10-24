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

interface SubjectItem {
  id: string;
  title: string;
  // Because this will be icon name if will be wrong big question mark will appear
  icon: any; // eslint-disable-line
  color: string;
}

export const AddSubjectScreen = ({
  route,
  navigation,
}: RootStackScreenProps<"AddSubjectScreen">) => {
  const { user } = useClerk();
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [lessonName, setLessonName] = useState<string>("");
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

  const addToDB = (): void => {
    const subjects: Array<SubjectItem> = [...route.params];
    subjects.pop();
    if (user) {
      updateDoc(doc(firestore, "users", user.id), {
        subjects: [
          ...subjects,
          {
            color: selectedColor,
            icon: selectedIcon,
            id: lessonName + selectedColor,
            title: lessonName,
          },
        ],
      }).then(() => {
        console.log(subjects);
        navigation.pop();
      });
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background-dark p-4">
      <TextInput
        className={
          "bg-input rounded-2xl p-4  font-open-sans-regular text-black dark:bg-card-dark dark:text-white"
        }
        placeholder="Lesson Name"
        value={lessonName}
        onChangeText={(name) => {
          setLessonName(name);
        }}
        placeholderTextColor="#6B7280"
      />
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
          // renderItem={(item) => <Icon icon={item}/>}
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
        className={`absolute bottom-0 left-0 right-0 m-4 rounded-2xl bg-slate-300 p-4 ${
          lessonName !== "" &&
          selectedIcon !== "" &&
          selectedColor !== "" &&
          "bg-primary"
        }`}
        onPress={() => {
          lessonName !== "" && selectedIcon !== "" && selectedColor !== ""
            ? addToDB()
            : () => {};
        }}
      >
        <Text className="text-center font-open-sans-bold text-white">
          Add Subject
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
