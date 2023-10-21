import {
  Alert,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
  Pressable,
  Keyboard,
} from "react-native";
import { RootStackScreenProps } from "../../../types/navigation";
import { useClerk } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsernameSchema } from "../../../utils/schemas";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as FileSystem from "expo-file-system";
import { GoBackSignButton } from "../../../components/goBackSignButton";
import LoadingModal from "../../../components/loadingModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Base64Images from "../../../../json/images.json";

export const SettingsScreen = ({
  navigation,
}: RootStackScreenProps<"Settings">) => {
  const { user, signOut } = useClerk();
  const insets = useSafeAreaInsets();

  const [profileUrl, setProfileUrl] = React.useState(user?.imageUrl ?? "");
  const [profileUrlError, setProfileUrlError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        username: UsernameSchema,
      }),
    ),

    defaultValues: { username: user?.username ?? "" },
  });
  const newUsername = watch("username");

  const { showActionSheetWithOptions } = useActionSheet();

  const updateProfileImage = async (uri: string) => {
    if (uri == user?.imageUrl) return;
    if (uri.includes("http://") || uri.includes("https://")) {
      await user?.setProfileImage({
        file: Base64Images.default_user,
      });
    } else {
      const base64Img = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem?.EncodingType?.Base64,
      });

      await user?.setProfileImage({
        file: `data:image/jpeg;base64,${base64Img}`,
      });
    }
  };

  const chooseImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.assets && result.assets[0]) {
        setProfileUrl(result.assets[0].uri);
      }
    } catch (e) {
      setProfileUrlError(true);
    }
  };

  const AudienceSelector = () => {
    const options = [
      "Choose from library",
      // "Take photo",
      "Remove current picture",
      "Cancel",
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined) {
          switch (selectedIndex) {
            case 0:
              chooseImageFromGallery();
              break;
            case 1:
              setProfileUrl(
                "https://img.clerk.com/preview.png?size=144&seed=1697799544504&initials=AD&isSquare=true&bgType=solid&bgColor=16a34a&fgType=silhouette&fgColor=FFFFFF&type=user",
              );
              break;
            // case 2:
            // openCamera();
            // break;
            case cancelButtonIndex:
              break;
          }
        }
      },
    );
  };

  return (
    <Pressable
      style={{ paddingTop: insets.top }}
      onPress={() => Keyboard.dismiss()}
      className="flex bg-background dark:bg-background-dark"
    >
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <View className="h-screen bg-background px-5 pt-6 dark:bg-background-dark">
          <GoBackSignButton onPress={() => navigation.goBack()} />
          <View className=" bg-background-dark">
            <TouchableOpacity
              className="mt-10 w-10"
              onPress={() => {
                if (
                  newUsername !== user?.username ||
                  profileUrl !== user.imageUrl
                ) {
                  Alert.alert(
                    "Discard all changes?",
                    "Are you sure you want to exit without saving?",
                    [
                      { text: "Yes", onPress: () => navigation.goBack() },
                      {
                        text: "No",
                        onPress: () => console.log("No Pressed"),
                        style: "cancel",
                      },
                    ],
                    { cancelable: true },
                  );
                } else {
                  navigation.goBack();
                }
              }}
            ></TouchableOpacity>
            <TouchableOpacity
              className="mb-2 self-center"
              onPress={AudienceSelector}
            >
              <Image
                source={{ uri: profileUrl }}
                className={`m-2  aspect-square h-28 animate-pulse self-center rounded-full bg-neutral-800 ${
                  profileUrlError && "border-4 border-red-500 "
                } `}
              />

              <Text className="text-center font-open-sans-semibold text-lg text-black dark:text-white">
                Edit picture
              </Text>
              {profileUrlError && (
                <Text className="mt-2 text-center font-open-sans-bold text-sm text-red-500">
                  Something went wrong, try again
                </Text>
              )}
            </TouchableOpacity>
            <View className="mt-2 flex h-14 w-full flex-row items-center rounded-xl bg-card-dark ">
              <View className=" flex h-full w-1/3 items-center justify-center rounded-l-xl bg-neutral-800">
                <Text className="font-open-sans-semibold text-lg text-black dark:text-white">
                  Username
                </Text>
              </View>

              <View className="w-2/3">
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Username"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      placeholderTextColor="#6B7280"
                      className={`ml-4 w-full pr-4 font-open-sans-regular text-lg text-black dark:text-white`}
                    />
                  )}
                />
              </View>
            </View>
            {errors.username?.message && (
              <Text className="mt-2 pb-4 font-open-sans-bold text-red-500">
                {errors.username.message.toString()}
              </Text>
            )}

            {(() => {
              if (
                newUsername !== user?.username ||
                profileUrl !== user?.imageUrl
              ) {
                return (
                  <TouchableOpacity
                    className={`mb-4  mt-4 flex h-14  w-full justify-center rounded-xl bg-card dark:bg-card-dark`}
                    onPress={handleSubmit(() => {
                      setLoading(true);
                      updateProfileImage(profileUrl)
                        .then(() => {
                          if (newUsername != user?.username) {
                            const params = {
                              username: newUsername,
                            };

                            user?.update(params);
                          }
                        })
                        .catch((e) => console.error(e))
                        .finally(() => navigation.goBack());
                    })}
                  >
                    <Text className="text-center font-open-sans-semibold text-lg dark:text-primary-dark">
                      Done
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Log Out?",
                        "Are you sure you want to log out?",
                        [
                          { text: "Yes", onPress: () => signOut() },
                          {
                            text: "No",
                            onPress: () => {},
                            style: "cancel",
                          },
                        ],
                        { cancelable: true },
                      );
                    }}
                    className={`mb-4  mt-4 flex h-14  w-full justify-center rounded-xl bg-card dark:bg-card-dark`}
                  >
                    <Text className=" text-center  align-middle font-open-sans-bold text-sm text-red-500">
                      Log Out
                    </Text>
                  </TouchableOpacity>
                );
              }
            })()}
          </View>
        </View>
        <LoadingModal visible={loading} />
      </SafeAreaView>
    </Pressable>
  );
};
