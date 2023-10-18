import React from "react";
import { Image, Pressable, Text, View, useColorScheme } from "react-native";
import { Entypo } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { RouterOutputs } from "../utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const CUT_ANSWER_LENGTH = 250;
export const ResponseCard = <T extends keyof RootStackParamList>({
  item,
  showRepliesOption = false,
  isAuthor = false,
  cutLongText = true,
  showRightCornerButton = true,
  showThreeDots = true,
  navigation,
  onCardPressed,
}: {
  item: RouterOutputs["questions"]["answers"][number];
  showRepliesOption?: boolean;
  isAuthor?: boolean;
  cutLongText?: boolean;
  showRightCornerButton?: boolean;
  showThreeDots?: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, T, undefined>;
  onCardPressed: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      key={item.id}
      onPress={onCardPressed}
      className="mb-4 flex w-full flex-col items-start justify-start rounded-2xl bg-card px-4 py-3 dark:bg-card-dark"
    >
      <View className="flex w-full flex-row items-center justify-between">
        <View className="flex flex-row items-center justify-start">
          <Image
            source={{ uri: item.user.profileImageUrl }}
            className="aspect-square h-6 rounded-full"
          />
          <Text className="ml-3 text-sm font-bold text-black dark:text-white">
            {item.user.username ?? "Anonymous"} said:
          </Text>
        </View>
        {showThreeDots && (
          <Menu>
            <MenuTrigger>
              <View className="flex h-5 w-10 items-center justify-center rounded-full bg-transparent">
                <Entypo
                  name="dots-three-horizontal"
                  size={16}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  backgroundColor:
                    colorScheme == "dark" ? "#383838" : "#D2D2D2",
                  padding: 4,
                  borderRadius: 18,
                  width: 160,
                  shadowColor: "rgba(0, 0, 0, 1)",
                },
              }}
            >
              <View className=" rounder-lg bg-moreOptions dark:bg-moreOptions-dark">
                {isAuthor ? (
                  <>
                    <MenuOption
                      onSelect={() => navigation.navigate("EditAnswer", item)}
                    >
                      <Text className="p-2 font-open-sans-regular text-xs text-black dark:text-white ">
                        Edit
                      </Text>
                    </MenuOption>
                    <View className="-mx-1 h-px w-40 bg-moreOptions-separator dark:bg-moreOptions-darkSeparator" />
                    <MenuOption onSelect={() => alert(`Delete`)}>
                      <Text className="p-2 font-open-sans-regular text-xs text-black dark:text-white">
                        Delete
                      </Text>
                    </MenuOption>
                  </>
                ) : (
                  <>
                    <MenuOption
                      onSelect={() =>
                        navigation.navigate("RespondAnswer", item)
                      }
                    >
                      <Text className="p-2 font-open-sans-regular text-xs text-black dark:text-white">
                        Respond
                      </Text>
                    </MenuOption>
                    <View className="-mx-1 h-px w-40 bg-moreOptions-separator dark:bg-moreOptions-darkSeparator" />
                    {showRepliesOption && (
                      <>
                        <MenuOption
                          onSelect={() =>
                            navigation.navigate("CommentDetails", {
                              answerId: item.id,
                            })
                          }
                        >
                          <Text className="p-2 font-open-sans-regular text-xs text-black dark:text-white">
                            View replies
                          </Text>
                        </MenuOption>
                        <View className="-mx-1 h-px w-40 bg-moreOptions-separator dark:bg-moreOptions-darkSeparator" />
                      </>
                    )}
                    <MenuOption
                      onSelect={() => {
                        navigation.navigate("ReportAnswer", item);
                      }}
                    >
                      <Text className="p-2 font-open-sans-regular text-xs text-black dark:text-white">
                        Report
                      </Text>
                    </MenuOption>
                  </>
                )}
              </View>
            </MenuOptions>
          </Menu>
        )}
      </View>
      <Text className="mt-2 font-open-sans-regular text-sm text-black dark:text-white">
        {(() => {
          if (cutLongText && item.answer.length > CUT_ANSWER_LENGTH) {
            return item.answer.slice(0, CUT_ANSWER_LENGTH) + "...";
          } else {
            return item.answer;
          }
        })()}
      </Text>
      <View className="mt-1 flex w-full flex-row items-center justify-end">
        {showRightCornerButton &&
          (() => {
            if (cutLongText && item.answer.length > CUT_ANSWER_LENGTH) {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate("CommentDetails", {
                      answerId: item.id,
                    });
                  }}
                >
                  <Text className="p-2 text-xs font-bold text-black dark:text-white">
                    See more
                  </Text>
                </Pressable>
              );
            } else {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate("RespondAnswer", item);
                  }}
                >
                  <Text className="p-2 text-xs font-bold text-lime-800 dark:text-lime-900">
                    Respond
                  </Text>
                </Pressable>
              );
            }
          })()}
      </View>
    </Pressable>
  );
};
