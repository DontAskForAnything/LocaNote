import {
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
import { isClerkAPIResponseError, useClerk } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
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
import Dialog from "react-native-dialog";

export const SettingsScreen = ({
  navigation,
}: RootStackScreenProps<"Settings">) => {
  const { user, signOut } = useClerk();
  const insets = useSafeAreaInsets();
  const [visibleLogOut, setVisibleLogOut] = useState(false);
  const [visibleDiscardChanges, setVisibleDiscardChanges] = useState(false);
  const [profileUrl, setProfileUrl] = React.useState(user?.imageUrl ?? "");
  const [profileUrlError, setProfileUrlError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    watch,
    handleSubmit,
    setError,
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
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 1;

    showActionSheetWithOptions(
      {
        textStyle: { color: "white", fontWeight: "bold" },
        containerStyle: { backgroundColor: "#1B1B1B", padding: 12 },

        options,
        cancelButtonIndex,
        destructiveButtonIndex,
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
        <Dialog.Container
          contentStyle={{ backgroundColor: "#1B1B1B", borderRadius: 20 }}
          visible={visibleLogOut}
        >
          <Dialog.Title>Log Out?</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to log out?
          </Dialog.Description>
          <Dialog.Button
            bold={true}
            color="white"
            label="No"
            style={{}}
            onPress={() => {
              setVisibleLogOut(false);
            }}
          />
          <Dialog.Button
            bold={true}
            color="red"
            label="Yes"
            onPress={() => signOut()}
          />
        </Dialog.Container>

        <Dialog.Container
          contentStyle={{ backgroundColor: "#1B1B1B", borderRadius: 20 }}
          visible={visibleDiscardChanges}
        >
          <Dialog.Title>Discard all changes?</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to exit without saving?
          </Dialog.Description>
          <Dialog.Button
            bold={true}
            color="white"
            label="No"
            style={{}}
            onPress={() => {
              setVisibleDiscardChanges(false);
            }}
          />
          <Dialog.Button
            bold={true}
            color="red"
            label="Yes"
            onPress={() => navigation.goBack()}
          />
        </Dialog.Container>

        <View className="h-screen bg-background px-5 pt-6 dark:bg-background-dark">
          <GoBackSignButton
            onPress={() => {
              if (
                newUsername !== user?.username ||
                profileUrl !== user.imageUrl
              ) {
                setVisibleDiscardChanges(true);
              } else {
                navigation.goBack();
              }
            }}
          />
          <View className=" bg-background-dark">
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
                <Text className="font-open-sans-semibold text-base text-black dark:text-white">
                  Username
                </Text>
              </View>

              <View className="w-2/3 pr-4">
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
                      className={`ml-4  font-open-sans-regular text-base text-black dark:text-white`}
                    />
                  )}
                />
              </View>
            </View>
            {errors.username?.message && (
              <Text className="mt-2 font-open-sans-bold text-red-500">
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

                            user
                              ?.update(params)
                              .then(() => navigation.goBack())
                              .catch((err: unknown) => {
                                if (isClerkAPIResponseError(err)) {
                                  setError("username", {
                                    message: err.errors[0]?.message,
                                  });
                                  return;
                                }
                              });
                          }
                        })
                        .catch((e) => console.error(e))
                        .finally(() => setLoading(false));
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
                      setVisibleLogOut(true);
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
