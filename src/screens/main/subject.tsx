import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../types/navigation";
import { FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SubjectPulledItem, Topic } from "../../utils/types";
import { useClerk } from "@clerk/clerk-expo";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { database, firestore } from "../../utils/firebaseConfig";
import { topicsAPI } from "../../test/apiTemp";
import * as Crypto from "expo-crypto";

export const SubjectScreen = (
  params: RootStackScreenProps<"SubjectScreen">,
) => {
  const insets = useSafeAreaInsets();
  const { user } = useClerk();
  const [ topics, setTopics] = useState<Topic[] | []>([])
  const [ loading, setLoading] = useState<boolean>(false)
  
  const getData = async (): Promise<void> => {
    // setLoading(true);
    setTopics([]);
    if (user) {
      const ref = doc(firestore, "subjects", params.route.params.id);
      const userData = await getDoc(ref);
      if (userData.exists()) {
        if (userData.data().topics){
          setTopics(userData.data().topics as Topic[]);
          return;
        }
      }
    }

    // setLoading(false);
  };

  async function addAiTopics() {
//TODO: Get from api
if(topicsAPI){
  //@ts-ignore
  const csvLines = topicsAPI[Math.floor(Math.random() * topicsAPI.length)].split('\n');
  const newTopics : Topic[] = []  

  csvLines.forEach((line) => {
    const [key, value] = line.split(':');
    newTopics.push({
      id: Crypto.randomUUID() as string,
      title: key?.trim(),
      description: value?.trim(),
      flashcards: [],
      questions: [],
      notes: [],
    } as Topic);
  });  

    setDoc(doc(firestore, "subjects", params.route.params.id), {
      topics: [
        ...topics,
       ...newTopics,
      ]
    });
 }

  }  useEffect(()=>{
    // addAiTopics().then(()=>{getData();});

      getData();
      
  }, [])

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <View className="flex flex-row items-center justify-between ">
          <TouchableOpacity
            onPress={() => params.navigation.goBack()}
            className=" flex aspect-square h-full w-1/12 items-center justify-center "
          >
            <AntDesign name="left" size={20} color={"white"} />
          </TouchableOpacity>

          <Text className="w-8/12 py-4 text-center font-open-sans-bold text-white">
            {params.route.params.title}
          </Text>

          <TouchableOpacity
            //TODO: add edit screen
            // onPress={()=>params.navigation.goBack()}
            className=" flex aspect-square w-1/12 items-center justify-center"
          >
            <AntDesign name="edit" size={20} color={"white"} />
          </TouchableOpacity>

        </View>
        {(topics) ? (

<FlatList
            className="mb-2"
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
            keyExtractor={(el) => el.id}
            numColumns={1}
            renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    // onPress={() =>
                    //   // params.navigation.push("SubjectScreen", item)
                    // }
                    className="m-1 bg-card-dark  justify-center rounded-xl p-4"
                  >


                    <Text className=" font-open-sans-bold text-white ">
                      {item.title}
                    </Text>
                    <Text className="text-xs font-open-sans-bold text-white opacity-50">
                      {item.description}
                    </Text>

                    <View className="flex mt-4 flex-row justify-between w-1/2">
                      <View className="bg-red-500 p-2"><Text>Notatka</Text></View>
                      <View className="bg-green-500 h-4 w-9"><Text>Fiszki</Text></View>
                      <View className="bg-blue-500 h-4 w-9"><Text>quiz</Text></View>
                    </View>
                  </TouchableOpacity>
                );
              }
            }
          />
) : <></>}
          {
            // TODO: if not topics add ability to generate / write own
            // Pull from database given id
          }
      </SafeAreaView>
    </View>
  );
};
