import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../types/navigation";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Topic } from "../../utils/types";
import { useClerk } from "@clerk/clerk-expo";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";

export const SubjectScreen = ({
  route,
  navigation,
}: RootStackScreenProps<"SubjectScreen">) => {
  const insets = useSafeAreaInsets();
  const { user } = useClerk();
  const [topics, setTopics] = useState<Topic[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async (): Promise<void> => {
    setLoading(true);
    setTopics([]);
    if (user) {
      const ref = doc(firestore, "subjects", route.params.subject.id);
      const userData = await getDoc(ref);
      if (userData.exists()) {
        if (userData.data().topics) {
          setTopics(userData.data().topics as Topic[]);
          setLoading(false);

          return;
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <View className="flex flex-row items-center justify-between ">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className=" flex aspect-square h-full w-1/12 items-center justify-center "
          >
            <AntDesign name="left" size={20} color={"white"} />
          </TouchableOpacity>

          <Text className="w-8/12 py-4 text-center font-open-sans-bold text-white">
            {route.params.subject.title}
          </Text>

          <TouchableOpacity
            //TODO: add edit screen
            onPress={() =>
              navigation.navigate("EditSubjectScreen", {
                subject: route.params.subject,
                subjects: route.params.subjects,
              })
            }
            className=" flex aspect-square w-1/12 items-center justify-center"
          >
            <AntDesign name="edit" size={20} color={"white"} />
          </TouchableOpacity>
        </View>

        {topics && !loading ? (
          <FlatList
            className="mb-2"
            ListEmptyComponent={
              <>
                <View className=" items-center justify-center">
                  {/* //TODO: Open topic screen */}
                  {/* //TODO: Options on hold element or 3 dots */}
                  <Text className="mx-2 mt-8 text-center font-open-sans-bold text-3xl text-white">
                    You don't have any topics in this subject
                  </Text>
                  <Text className="mx-2 mt-4 text-center  font-open-sans-bold  text-sm text-white opacity-50">
                    Don't worry just start by clicking button below!
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("CreateTopic", {
                        subject: route.params.subject,
                        topics: topics,
                      })
                    }
                    className="mt-4 items-center justify-center"
                  >
                    <View className="my-4 flex-row items-center rounded-xl bg-primary-dark p-4">
                      <View className="opacity-90">
                        <FontAwesome5
                          name="lightbulb"
                          size={18}
                          color="white"
                        />
                      </View>
                      <Text className="ml-2 font-open-sans-bold text-sm text-white opacity-90">
                        Create your first topic
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            }
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
            data={topics}
            ListHeaderComponent={
              <Text className="mx-2 font-open-sans-bold text-base text-white opacity-50">
                {topics.length > 0 && "Topics:"}
              </Text>
            }
            keyExtractor={(el) => el.id}
            numColumns={1}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("TopicScreen", {
                      subjectID: route.params.subject.id,
                      topics: topics,
                      topic: item,
                    })
                  }
                  className="m-1 justify-center  rounded-xl bg-card-dark p-4 py-3"
                >
                  <Text className=" font-open-sans-bold text-white ">
                    {item.title}
                  </Text>
                  <Text className="font-open-sans-bold text-xs text-white opacity-50">
                    {item.description}
                  </Text>

                  <View className="mt-2 flex flex-row ">
                    <View
                      className={`rounded-full px-2 py-1 ${
                        item.notes.length > 0
                          ? "bg-green-700"
                          : "bg-neutral-800 opacity-50"
                      }`}
                    >
                      <Text
                        className="font-open-sans-semibold text-white"
                        style={{ fontSize: 10 }}
                      >
                        Notes
                      </Text>
                    </View>
                    <View
                      className={`ml-2 rounded-full px-2 py-1 ${
                        item.flashcards.length > 0
                          ? "bg-green-500"
                          : "bg-neutral-800 opacity-50"
                      }`}
                    >
                      <Text
                        className="font-open-sans-semibold text-white"
                        style={{ fontSize: 10 }}
                      >
                        Flashcards
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View className="flex-1 justify-center">
            <ActivityIndicator size="large" color={"#16a34a"} />
          </View>
        )}

        {topics.length > 0 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CreateTopic", {
                subject: route.params.subject,
                topics: topics,
              })
            }
            className="items-center justify-center"
          >
            <View className="my-4 flex-row items-center rounded-xl bg-primary-dark p-4">
              <View className=" opacity-90">
                <FontAwesome5 name="lightbulb" size={18} color="white" />
              </View>
              <Text className="ml-2 font-open-sans-bold text-xs text-white opacity-90">
                Create new topic
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};
