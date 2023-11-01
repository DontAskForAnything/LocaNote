import { AntDesign, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types/navigation";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Flashcard } from "../../utils/types";
import { generateNote } from "../../utils/ai/note";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import Markdown from "react-native-marked";


const flashcards: Array<Flashcard> = [
  { question: "What is?", answer: "It is indeed" },
  { question: "What was?", answer: "Yes, It was" },
  { question: "Is taxation theft?", answer: "I don't think so" },
];


export const TopicScreen = (params: RootStackScreenProps<"TopicScreen">) => {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState<string | []>(params.route.params.topic.notes);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [ preview , setPreview ] = useState<boolean>(false)


  if (loading) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-background-dark"
      >
        <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
          <View className=" flex-1 items-center justify-center">
            <FontAwesome5 name="robot" size={54} color="#16a34a" />
            <Text className="mt-4 text-center font-open-sans-bold text-2xl text-white">
              AI is thinking
            </Text>

            <View className="mt-4 flex-row items-center justify-center">
              <ActivityIndicator size="small" color={"#16a34a"} />
              <Text className="ml-4  text-center font-open-sans-bold text-white opacity-70">
                Generating notes...
              </Text>
            </View>

          </View>

          <Text className="absolute bottom-4 self-center font-open-sans-semibold text-xs text-white opacity-50">
            AI generating may take around 1 min
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  function saveInDatabase(note: string) {
    const topics = params.route.params.topics;
    if (topics) {
      // Ignore because we use targetTopic but eslint doesn't see this
      // eslint-disable-next-line
      let targetTopic = topics.find(
        (topic) => topic.id === params.route.params.topic.id,
      );

      if (targetTopic) {
        targetTopic.notes = note;

        setDoc(
          doc(
            firestore,
            "subjects",
            params.route.params.subjectID,
          ),
          {
            topics: [...topics],
          },
        );
      }
    }

  }

// TODO: Add "are you sure you want to leave?"
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background-dark"
    >
      <SafeAreaView className="mx-12 w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => params.navigation.goBack()}
            className="flex aspect-square h-full w-1/12 items-center justify-center "
          >
            <AntDesign name="left" size={20} color={"white"} />
          </TouchableOpacity>

          <Text className="w-8/12 py-4 text-center font-open-sans-bold text-white">
            {params.route.params.topic.title}
          </Text>

          <TouchableOpacity className={`flex p-1 items-center justify-center rounded-xl bg-primary-dark ${note.length <= 0 && 'opacity-20'}`} onPress={() =>
            params.navigation.navigate("FlashcardsScreen", flashcards)
          } disabled={note.length <= 0}>
            <MaterialCommunityIcons name="cards-outline" size={20} color="white" />
            <Text className="font-open-sans-bold text-xs text-white">Flashcards</Text>
          </TouchableOpacity>
        </View>


          {(editing && !Array.isArray(note) )?   <>
  <View className="flex-row justify-between mb-4">
    <Pressable  onPress={()=>setPreview(true)}className={`w-1/2 p-1 justify-center items-center ${preview ? 'border-b-primary-dark' : "border-b-neutral-400"} border-b-2`}>
    <Text className="font-open-sans-semibold text-sm text-white text-center">Preview</Text>
    </Pressable>
    <Pressable onPress={()=>setPreview(false)} className={`w-1/2 p-1 justify-center items-center ${!preview ? 'border-b-primary-dark' : "border-b-neutral-400"} border-b-2`}>
    <Text className="font-open-sans-semibold text-sm text-white text-center">Edit</Text>
    </Pressable>
    </View>
  {preview ? 
  <View className="mb-4 flex-1 p-2">
  <Markdown
    value={note}
    flatListProps={{
      style: { backgroundColor: '#141416' },
      contentContainerStyle: { backgroundColor: "#141416" },
      initialNumToRender: 8,
    }}
  />
</View>  :
  <View className=" flex-1  rounded-2xl p-2 ">
    <TextInput
      autoCapitalize="none"
      placeholder="Notes"
      multiline={true}
      value={note}
      onChangeText={(value) => {setNote(value)}}
      placeholderTextColor="#6B7280"
      underlineColorAndroid="transparent"
      style={{ textAlignVertical: 'top' }}
      className={`flex-1 font-open-sans-regular dark:text-white`}
      />
</View>
}

<TouchableOpacity
          onPress={()=> {saveInDatabase(note); setEditing(false);}}
          className="my-2  flex-row items-center self-end rounded-xl bg-primary-dark p-3"
        >
          
          <Text className="px-4 font-open-sans-bold text-base text-white opacity-90">
            Save
          </Text>
        </TouchableOpacity>
      
</>
 : <>
        {!Array.isArray(note) ? (
          <>
            <Text className="mx-2 font-open-sans-bold text-base text-white opacity-50">
              Note:
            </Text>

            <View className="mb-4 flex-1 p-2">
              <Markdown
                value={note}
                flatListProps={{
                  style: { backgroundColor: '#141416' },
                  contentContainerStyle: { backgroundColor: "#141416" },
                  initialNumToRender: 8,
                }}
              />
            </View>
          </>
        ) : (
          <View className=" mt-12 items-center justify-center">
            <FontAwesome5 name="lightbulb" size={54} color="#16a34a" />
            <Text className="mt-4 text-center font-open-sans-bold text-2xl text-white">
              This topic is empty
            </Text>
            <Text className="mt-2 text-center font-open-sans-bold text-white opacity-50">
              What would you like to do?
            </Text>

            <View className="flex-row justify-center w-screen">

              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  generateNote(
                    params.route.params.topic.title as string,
                    params.route.params.topic.description as string,
                  ).then((note) => {
                    setNote(note);
                    saveInDatabase(note);
                  })
                    .finally(() => setLoading(false));

                }}
                className="mt-4  w-1/3 h-24 flex-row items-center self-center rounded-xl bg-primary-dark  p-2 justify-center"
              >
                <Text className="font-open-sans-bold text-base text-white text-center">
                  Generate note
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => setNote("A")}
                className="ml-12 mt-4  w-1/3 h-24  flex-row items-center self-center rounded-xl bg-primary-dark p-2 justify-center"
              >

                <Text className="font-open-sans-bold text-base text-white text-center">
                  Create own note
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )} 
        </>}
        {!editing  && 
        <TouchableOpacity
          onPress={()=> {setEditing(true);}}
          className="my-2 flex-row items-center self-start rounded-xl bg-primary-dark p-3"
        >
          
          <Text className="px-4 font-open-sans-bold text-base text-white opacity-90">
            Edit
          </Text>
        </TouchableOpacity>
}
      </SafeAreaView>
    </View>
  );
};


