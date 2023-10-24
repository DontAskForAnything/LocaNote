import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { SubjectItem } from "../../utils/types";

type SubjectObject = SubjectItem[] | [];

export const MainScreen = ({
  navigation,
}: RootStackScreenProps<"MainScreen">) => {
  const { user } = useUser();
  const [subjects, setSubjects] = useState<SubjectObject>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const insets = useSafeAreaInsets();

  const getData = async (): Promise<void> => {
    setLoading(true);
    setSubjects([]);
    if (user) {
      const ref = doc(firestore, "users", user.id);
      const userData = await getDoc(ref);
      if (userData.exists()) {
        // Set the subjects data
        if (userData.data().subjects)
          setSubjects(userData.data().subjects as SubjectObject);

        // Now, add the "footer" object after subjects are set
        setSubjects((prevSubjects) => [
          ...prevSubjects,
          { id: "footer", title: "", icon: "", color: "" },
        ]);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getData(); //get fresh data each time this screen is visible
    });
  }, [navigation]);

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <Text className="my-4 font-open-sans-bold  text-xl text-neutral-500">
          Your subjects:
        </Text>
        {subjects.length > 0 && (
          <FlatList
            onRefresh={() => getData()}
            refreshing={loading}
            data={subjects}
            keyExtractor={(item) => item.title}
            numColumns={3}
            renderItem={({ item }) => {
              if (item.id === "footer") {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.push("AddSubjectScreen", subjects)
                    }
                    className="m-1 flex aspect-square  h-20 max-h-20 flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl bg-neutral-700 p-4"
                  >
                    <Text className="text-center  font-open-sans-bold text-white opacity-70">
                      {subjects.length == 1
                        ? `Add your first subject`
                        : `Add new subject`}
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.push("SubjectScreen")}
                    style={{ backgroundColor: item.color }}
                    className="m-1 flex h-20 flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl p-4"
                  >
                    <View className="absolute z-10 flex-1 opacity-30">
                      <FontAwesome5
                        name={item.icon}
                        size={50}
                        color={"white"}
                      />
                    </View>

                    <Text className="z-20  text-center font-open-sans-bold text-white">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};
