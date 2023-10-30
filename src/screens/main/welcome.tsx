import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { SubjectItem } from "../../utils/types";
import LogoTop from "../../components/logoTop";

type SubjectObject = SubjectItem[] | [];

export const MainScreen = (params: RootStackScreenProps<"MainScreen">) => {
  const { user, isLoaded } = useUser();
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
        if (userData.data().subjects)
          setSubjects(userData.data().subjects as SubjectObject);
      }
    }
    setSubjects((prevSubjects) => [
      ...prevSubjects,
      { id: "footer", title: "", icon: "", color: "" },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (params.route?.params?.refresh) {
      getData();
    }
  }, [params.route.params?.refresh]);

  useEffect(() => {
    getData();
  }, []);

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <LogoTop />

        <TouchableOpacity
          className="flex w-full flex-row justify-between rounded-xl bg-card-dark p-3"
          onPress={() => params.navigation.navigate("Settings")}
        >
          <Image
            source={{ uri: user.imageUrl }}
            className="aspect-square h-12 w-1/12 self-center rounded-full bg-neutral-800"
          />
          <View className="w-10/12 justify-center overflow-hidden whitespace-nowrap ">
            <Text className="font-open-sans-semibold text-base text-black opacity-70 dark:text-white">
              Hello,{" "}
              <Text className="font-open-sans-bold">{user.username}</Text>
            </Text>
            <View className="absolute right-1 top-1">
              <Ionicons name={`settings-outline`} size={16} color={"white"} />
            </View>
          </View>
        </TouchableOpacity>

        <Text className="my-4 font-open-sans-bold  text-xl text-neutral-500">
          Your subjects:
        </Text>
        {subjects.length > 0 && !loading ? (
          <FlatList
            className=" mb-2"
            refreshControl={
              <RefreshControl
                colors={["#16a34a"]}
                progressBackgroundColor={"black"}
                refreshing={loading}
                onRefresh={() => getData()}
              />
            }
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
                      params.navigation.push("AddSubjectScreen", subjects)
                    }
                    className="m-1 flex h-32 flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl bg-neutral-700 p-4"
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
                    onPress={() =>
                      params.navigation.push("SubjectScreen", {
                        subject: item,
                        subjects: subjects,
                      })
                    }
                    style={{ backgroundColor: item.color }}
                    className="m-1 flex h-32 flex-1 items-center justify-center rounded-xl p-4"
                  >
                    <View className="absolute z-10 flex-1 opacity-30">
                      <FontAwesome5
                        name={item.icon}
                        size={50}
                        color={"white"}
                      />
                    </View>

                    <Text className="z-20  text-center font-open-sans-bold text-white ">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
          />
        ) : (
          <ActivityIndicator size="large" color={"#16a34a"} />
        )}
      </SafeAreaView>
    </View>
  );
};
