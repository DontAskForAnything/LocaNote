import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../types/navigation";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Topic } from "../../utils/types";
import { useClerk } from "@clerk/clerk-expo";
import {
  arrayRemove,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Dialog from "react-native-dialog";

export const SubjectScreen = ({
  route,
  navigation,
}: RootStackScreenProps<"SubjectScreen">) => {
  const insets = useSafeAreaInsets();
  const { user } = useClerk();
  const [topics, setTopics] = useState<Topic[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [displayCode, setDisplayCode] = useState<boolean>(false);
  const [deleteTopic, setDeleteTopic] = useState<undefined | Topic>(undefined);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const getData = async (): Promise<void> => {
    setLoading(true);
    setTopics([]);
    if (user) {
      const ref = doc(firestore, "subjects", route.params.subject.id);
      const userData = await getDoc(ref);
      if (userData.exists()) {
        if (userData.data().topics) {
          setTopics(userData.data().topics as Topic[]);
          setIsDeleted(userData.data().deleted as boolean);
          setLoading(false);

          return;
        }
      }
    }
    setLoading(false);
  };
  const { showActionSheetWithOptions } = useActionSheet();

  const AudienceSelector = () => {
    const icons = [
      <AntDesign name="edit" size={20} color={"white"} />,
      <AntDesign name="delete" size={20} color={"red"} />,
      <Entypo name="cross" size={20} color="white" />,
    ];

    const options = ["Edit", "Delete", "Cancel"];
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;
    showActionSheetWithOptions(
      {
        textStyle: { color: "white", fontWeight: "bold" },
        containerStyle: { backgroundColor: "#1B1B1B", padding: 12 },
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined) {
          switch (selectedIndex) {
            case 0:
              navigation.navigate("EditSubjectScreen", {
                subject: route.params.subject,
                subjects: route.params.subjects,
              });

              break;
            case 1:
              setVisibleDelete(true);
              break;

            case cancelButtonIndex:
              break;
          }
        }
      },
    );
  };

  const TopicEditSelection = (item: Topic) => {
    const icons = [
      <AntDesign name="edit" size={20} color={"white"} />,
      <AntDesign name="delete" size={20} color={"red"} />,
      <Entypo name="cross" size={20} color="white" />,
    ];

    const options = ["Edit", "Delete", "Cancel"];
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;
    showActionSheetWithOptions(
      {
        textStyle: { color: "white", fontWeight: "bold" },
        containerStyle: { backgroundColor: "#1B1B1B", padding: 12 },
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined) {
          switch (selectedIndex) {
            case 0:
              navigation.navigate("EditTopicScreen", {
                subject: route.params.subject,
                topics: topics,
                topic: item,
              });

              break;
            case 1:
              setDeleteTopic(item);
              break;

            case cancelButtonIndex:
              break;
          }
        }
      },
    );
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

  if (isDeleted) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 items-center justify-center bg-background-dark"
      >
        <Text className={"text-2xl text-white"}>
          This subject has been deleted!
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (user) {
              updateDoc(doc(firestore, "shared", user?.id), {
                subjects: arrayRemove(route.params.subject),
              });
              navigation.navigate("MainShared", { refresh: Math.random() });
            }
          }}
          className="my-4 items-center justify-center rounded-2xl bg-primary p-4"
        >
          <Text className={"font-bold text-white"}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <Dialog.Container
          contentStyle={{ backgroundColor: "#1B1B1B", borderRadius: 20 }}
          visible={visibleDelete}
        >
          <Dialog.Title>Delete subject?</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this subject and all topics
            associated with it?
          </Dialog.Description>
          <Dialog.Button
            bold={true}
            color="white"
            label="No"
            style={{}}
            onPress={() => {
              setVisibleDelete(false);
            }}
          />
          <Dialog.Button
            bold={true}
            color="red"
            label="Yes"
            onPress={() => {
              setDoc(doc(firestore, "subjects", route.params.subject.id), {
                topics: [],
                deleted: true,
              }).then(() => {
                if (user) {
                  updateDoc(doc(firestore, "users", user?.id), {
                    subjects: arrayRemove(route.params.subject),
                  });
                  navigation.navigate("MainScreen", { refresh: Math.random() });
                }
              });
              setVisibleDelete(false);
            }}
          />
        </Dialog.Container>
        <Dialog.Container
          contentStyle={{ backgroundColor: "#1B1B1B", borderRadius: 20 }}
          visible={deleteTopic !== undefined}
        >
          <Dialog.Title>Delete topic?</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this topic and all flashcards
            associated with it?
          </Dialog.Description>
          <Dialog.Button
            bold={true}
            color="white"
            label="No"
            style={{}}
            onPress={() => {
              setDeleteTopic(undefined);
            }}
          />
          <Dialog.Button
            bold={true}
            color="red"
            label="Yes"
            onPress={() => {
              let tempTopics = [...topics];
              if (!deleteTopic) return;
              tempTopics = tempTopics.filter((el) => el.id !== deleteTopic.id);
              updateDoc(doc(firestore, "subjects", route.params.subject.id), {
                topics: tempTopics,
              });
              setTopics(tempTopics);
              setDeleteTopic(undefined);
            }}
          />
        </Dialog.Container>

        <CodeModal
          displayCode={displayCode}
          setDisplayCode={setDisplayCode}
          code={route.params.subject.id}
        />
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
            onPress={() => setDisplayCode(true)}
            className={`flex aspect-square w-1/12 items-center justify-center ${
              topics.length <= 0 && "opacity-20"
            }`}
            disabled={topics.length <= 0}
          >
            <Feather name="share" size={20} color="white" />
          </TouchableOpacity>
          {route.params.author && (
            <>
              <TouchableOpacity
                onPress={AudienceSelector}
                className=" flex aspect-square w-1/12 items-center justify-center"
              >
                <Entypo name="dots-three-vertical" size={20} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {topics && !loading ? (
          <FlatList
            className="mb-2"
            ListEmptyComponent={
              <>
                <View className=" items-center justify-center">
                  {!route.params.author ? (
                    <>
                      <Text className="mx-2 mt-8 text-center font-open-sans-bold text-3xl text-white">
                        This topic is empty.
                      </Text>
                      <Text className="mx-2 mt-8 text-center font-open-sans-bold text-xl text-white opacity-70">
                        Please get in touch with the subject's owner, if you
                        think this topic should not be empty.
                      </Text>
                      <Text className="mx-2 mt-4 text-center  font-open-sans-bold  text-sm text-white opacity-50">
                        Subject id:{" "}
                        <Text className="text-primary-dark">
                          {route.params.subject.id}
                        </Text>
                      </Text>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
                      author: route.params.author,
                    })
                  }
                  className="m-1 justify-center  rounded-xl bg-card-dark p-4 py-3"
                >
                  <View className={"flex-row justify-between"}>
                    <Text className=" font-open-sans-bold text-white ">
                      {item.title}
                    </Text>
                    {route.params.author && (
                      <TouchableOpacity
                        className="-mr-1 opacity-60"
                        onPress={() => TopicEditSelection(item)}
                      >
                        <Entypo
                          name="dots-three-vertical"
                          size={20}
                          color="white"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
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

        {topics.length > 0 && route.params.author && (
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

        {!route.params.author ? (
          <Text className="absolute bottom-1 self-center font-open-sans-semibold text-xs text-white opacity-50">
            You are not owner of this subject
          </Text>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

const CodeModal = ({
  displayCode,
  setDisplayCode,
  code,
}: {
  displayCode: boolean;
  setDisplayCode: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
}) => {
  return (
    <Modal visible={displayCode} transparent={true}>
      <Pressable
        className="flex-1 justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        onPress={() => setDisplayCode(false)}
      >
        <View className="w-8/12 items-center justify-center self-center rounded-xl bg-card-dark p-8">
          <Feather name="share" size={40} color="white" />

          <Text className="mt-2 text-center font-open-sans-bold text-lg text-white ">
            Share
          </Text>
          <Text className="mt-4 text-center font-open-sans-bold text-3xl text-primary-dark">
            {code}
          </Text>

          <Text className="mt-4 text-center font-open-sans-bold text-white opacity-70">
            Share this 6-character code to distribute all topics from this
            subject.
          </Text>

          <TouchableOpacity
            className="absolute right-4 top-4 opacity-70"
            onPress={() => setDisplayCode(false)}
          >
            <Entypo name="cross" size={24} color="white" />
          </TouchableOpacity>
          {/* <Button color={"#16a34a"} title="Close" onPress={() => setDisplayCode(false)} /> */}
        </View>
      </Pressable>
    </Modal>
  );
};
