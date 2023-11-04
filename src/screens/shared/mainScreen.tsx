import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { useEffect, useState } from "react";
import { CodeInputAlpha } from "../../components/auth/codeInputAlpha";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../utils/firebaseConfig";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubjectNameSchema } from "../../utils/schemas";
import { IconPicker } from "../../components/iconPicker";
import { ColorPicker } from "../../components/colorPicker";
import LoadingModal from "../../components/loadingModal";
import { z } from "zod";
import { SubjectItem } from "../../utils/types";
import LogoTop from "../../components/logoTop";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SubjectObject = SubjectItem[] | [];

export const MainSharedScreen = (
  params: RootStackScreenProps<"MainShared">,
) => {
  const [displayCode, setDisplayCode] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<SubjectObject>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useClerk();
  const getSharedSubjects = async () => {
    setLoading(true);
    const query = await getDoc(
      doc(firestore, "shared", user.user?.id as string),
    );
    if (query.exists()) {
      if (query.data().subjects) {
        setSubjects(query.data().subjects);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getSharedSubjects();
  }, []);
  useEffect(() => {
    if (params.route?.params?.refresh) {
      getSharedSubjects();
    }
  }, [params.route.params?.refresh]);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <LoadingModal visible={loading} />
      <CodeModal
        displayCode={displayCode}
        setDisplayCode={setDisplayCode}
        getSharedSubjects={getSharedSubjects}
      />
      {!loading && (
        <>
          {subjects.length > 0 ? (
            <SafeAreaView className="w-11/12 flex-1 self-center bg-background dark:bg-background-dark">
              <LogoTop />
              <TouchableOpacity
                onPress={() => {
                  setDisplayCode(true);
                }}
                className="absolute bottom-2 right-0 z-20 items-center justify-center"
              >
                <View className=" aspect-square flex-row items-center justify-center rounded-xl bg-primary-dark p-4 ">
                  <FontAwesome5 name={"plus"} size={20} color={"white"} />
                </View>
              </TouchableOpacity>
              <Text className="my-4 font-open-sans-bold  text-xl text-neutral-500">
                Your shared subjects:
              </Text>
              {!loading ? (
                <FlatList
                  className="mb-2"
                  refreshControl={
                    <RefreshControl
                      colors={["#16a34a"]}
                      progressBackgroundColor={"black"}
                      refreshing={loading}
                      onRefresh={() => getSharedSubjects()}
                    />
                  }
                  onRefresh={() => getSharedSubjects()}
                  refreshing={loading}
                  data={subjects}
                  keyExtractor={(i, id) => id.toString()}
                  numColumns={1}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          params.navigation.push("SubjectScreen", {
                            subject: item,
                            subjects: subjects,
                            author: false,
                          })
                        }
                        style={{ backgroundColor: item.color }}
                        className="m-1 flex h-14 flex-1  flex-row items-center rounded-xl p-4"
                      >
                        <FontAwesome5
                          name={item.icon}
                          size={20}
                          color={"white"}
                        />

                        <Text className="ml-8 text-center font-open-sans-bold text-white ">
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <ActivityIndicator size="large" color={"#16a34a"} />
              )}
            </SafeAreaView>
          ) : (
            <>
              <SafeAreaView className="flex h-screen w-9/12 items-center justify-center self-center bg-background dark:bg-background-dark">
                <FontAwesome5 name="wifi" size={54} color="#16a34a" />

                <Text className="mt-4 self-stretch text-center font-open-sans-bold text-3xl text-white">
                  No shared topics
                </Text>
                <Text className="mt-1 self-stretch text-center font-open-sans-semibold text-sm text-white opacity-70">
                  No one has shared any topics with you.
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setDisplayCode(true);
                  }}
                  className="mt-4 items-center justify-center"
                >
                  <View className=" flex-row items-center rounded-xl bg-primary-dark p-4">
                    <Text className="font-open-sans-bold text-sm text-white opacity-90">
                      I have code
                    </Text>
                  </View>
                </TouchableOpacity>
              </SafeAreaView>
            </>
          )}
        </>
      )}
    </View>
  );
};

const CodeModal = ({
  displayCode,
  setDisplayCode,
  getSharedSubjects,
}: {
  displayCode: boolean;
  setDisplayCode: React.Dispatch<React.SetStateAction<boolean>>;
  getSharedSubjects: () => void;
}) => {
  const user = useUser();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [subjectCreate, setSubjectCreate] = useState(false);
  const codeSubmit = async () => {
    setCodeError("");
    const query = await getDoc(doc(firestore, "subjects", code));
    if (query.exists()) {
      if (query.data().authorId === (user.user?.id as string)) {
        setCodeError("You can't add your own subject");
      } else {
        setAuthorId(query.data().authorId);
        setSubjectCreate(true);
      }
      return;
    }
    setCodeError("This code is invalid");
  };
  const closeModule = () => {
    setDisplayCode(false);
    setCodeError("");
    setCode("");
    setSubjectCreate(false);
  };

  return (
    <Modal visible={displayCode} transparent={true}>
      {subjectCreate ? (
        <SubjectModal
          code={code}
          closeModule={closeModule}
          getSharedSubjects={getSharedSubjects}
          authorId={authorId}
        />
      ) : (
        <Pressable
          className="flex-1 justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onPress={closeModule}
        >
          <Pressable className="w-11/12 items-center justify-center self-center rounded-xl bg-cardLight-dark p-4">
            <Text className="mb-6 mt-2 text-center font-open-sans-bold text-lg text-white ">
              Enter code
            </Text>

            <CodeInputAlpha
              length={6}
              code={code}
              setCode={setCode}
              error={codeError}
            />

            <TouchableOpacity
              onPress={codeSubmit}
              className={`mt-2 items-center justify-center ${
                code.length !== 6 && " opacity-60"
              }`}
              disabled={code.length !== 6}
            >
              <View className=" flex-row items-center rounded-xl bg-primary-dark p-4 px-12">
                <Text className="font-open-sans-bold text-sm text-white opacity-90">
                  Confirm
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="absolute right-4 top-4 opacity-70"
              onPress={() => setDisplayCode(false)}
            >
              <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </Modal>
  );
};

const SubjectModal = ({
  code,
  authorId,
  closeModule,
  getSharedSubjects,
}: {
  code: string;
  authorId: string;
  closeModule: () => void;
  getSharedSubjects: () => void;
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string>("book");
  const [selectedColor, setSelectedColor] = useState<string>("#4287f5");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useClerk();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SubjectNameSchema),
    defaultValues: { lessonName: "" },
  });

  const addToDatabase = async (values: z.infer<typeof SubjectNameSchema>) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      values = values as z.infer<typeof SubjectNameSchema>;
      if (user) {
        let subjects: Array<SubjectItem> = [];
        const query = await getDoc(doc(firestore, "shared", user.id));
        if (query.exists()) {
          if (query.data().subjects) {
            subjects = query.data().subjects;
          }
        }

        setDoc(doc(firestore, "shared", user.id), {
          subjects: [
            ...subjects,
            {
              color: selectedColor,
              icon: selectedIcon,
              id: code,
              title: values.lessonName,
              authorId: authorId ? authorId : "",
            },
          ],
        }).then(() => {
          getSharedSubjects();
          closeModule();
        });
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  return (
    <Pressable
      className="flex-1 justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onPress={() => {}}
    >
      <Pressable className="mt-8 w-full flex-1 self-center rounded-t-xl bg-cardLight-dark p-4">
        <LoadingModal visible={loading} />
        <TouchableOpacity
          className="absolute right-4 top-4 opacity-70"
          onPress={closeModule}
        >
          <Entypo name="cross" size={24} color="white" />
        </TouchableOpacity>
        <Text className="mt-4 text-center font-open-sans-bold text-lg text-white ">
          Give shared subject own style!
        </Text>
        <Text className="mt-1 text-center font-open-sans-bold text-xs text-white opacity-70">
          This style will only be visible to you!
        </Text>

        <Controller
          control={control}
          name="lessonName"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              autoCapitalize="none"
              placeholder="Subject name"
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              placeholderTextColor="#6B7280"
              className={`bg-input mt-6 rounded-2xl p-4 font-open-sans-regular text-black dark:bg-card-dark dark:text-white ${
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
            className={
              "mb-1 mt-3 text-center font-poppins-medium text-lg text-white"
            }
          >
            Choose an Icon:
          </Text>
          <IconPicker
            selectedIcon={selectedIcon}
            onPress={(icon: string) => setSelectedIcon(icon)}
          />
          <Text
            className={
              "mb-1 mt-8 text-center font-poppins-medium text-lg text-white"
            }
          >
            Pick a color:
          </Text>
        </View>
        <ColorPicker
          selectedColor={selectedColor}
          onPress={(color: string) => setSelectedColor(color)}
        />
        <TouchableOpacity
          className={`absolute bottom-0 left-0 right-0 m-4 rounded-2xl bg-primary p-4`}
          onPress={handleSubmit(addToDatabase)}
        >
          <Text className="text-center font-open-sans-bold text-white">
            Add Subject
          </Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  );
};
