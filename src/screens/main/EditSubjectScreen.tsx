import { useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native";
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
import { ColorPicker } from "../../components/colorPicker";
import { IconPicker } from "../../components/iconPicker";

export const EditSubjectScreen = ({
  route,
  navigation,
}: RootStackScreenProps<"EditSubjectScreen">) => {
  const { user } = useClerk();
  const [selectedIcon, setSelectedIcon] = useState<string>(
    route.params.subject.icon,
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    route.params.subject.color,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SubjectNameSchema),
    defaultValues: { lessonName: route.params.subject.title },
  });

  const addToDB = (values: z.infer<typeof SubjectNameSchema>): void => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      values = values as z.infer<typeof SubjectNameSchema>;
      const subjects: Array<SubjectItem> = [...route.params.subjects];
      subjects.pop();
      subjects.find((subject, index) => {
        if (subject.id === route.params.subject.id) {
          subjects[index] = {
            color: selectedColor,
            icon: selectedIcon,
            id: subject.id,
            title: values.lessonName,
            authorId: user?.id as string,
          };
          return true;
        }
      });

      if (user) {
        setDoc(doc(firestore, "users", user.id), {
          subjects: [...subjects],
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
            placeholder="Edit Subject Name"
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
      <View>
        <Text
          className={"my-6 text-center font-poppins-medium text-lg text-white"}
        >
          Choose an Icon:
        </Text>
        <IconPicker
          selectedIcon={selectedIcon}
          onPress={(icon) => setSelectedIcon(icon)}
        />
        <Text
          className={"mt-16 text-center font-poppins-medium text-lg text-white"}
        >
          Pick a color:
        </Text>
        <ColorPicker
          selectedColor={selectedColor}
          onPress={(value: string) => setSelectedColor(value)}
        />
      </View>
      <TouchableOpacity
        className={`absolute bottom-0 left-0 right-0 m-4 rounded-2xl bg-primary p-4`}
        onPress={handleSubmit(addToDB)}
      >
        <Text className="text-center font-open-sans-bold text-white">
          Update Subject
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
