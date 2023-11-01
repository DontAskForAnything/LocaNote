import { useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import {
  Button,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const JsonModal = ({
  isModalVisible,
  jsonData,
  toggleModal,
}: {
  isModalVisible: boolean;
  jsonData: string;
  toggleModal: () => void;
}) => {
  return (
    <Modal visible={isModalVisible}>
      <View className="flex-1 bg-background-dark p-4">
        <ScrollView>
          <View>
            <Text className=" mb-4 font-open-sans-semibold text-white opacity-50">
              {JSON.stringify(JSON.parse(jsonData), null, 3)}
            </Text>
          </View>
        </ScrollView>
        <Button color={"#16a34a"} title="Close" onPress={toggleModal} />
      </View>
    </Modal>
  );
};

export default function AiErrorScreen(
  params: RootStackScreenProps<"AiErrorScreen">,
) {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex h-screen w-9/12 justify-center self-center bg-background dark:bg-background-dark">
        <Text className="self-stretch text-center font-open-sans-bold text-5xl text-white">
          Error {":<"}
        </Text>
        <Text className="self-stretch text-center font-open-sans-semibold text-sm text-white">
          An error has occurred. You have the option to view the error message
          for details, or simply click 'Go Back' and retry.
        </Text>
        <Pressable onPress={() => toggleModal()}>
          <Text className="mt-4 self-stretch text-center font-open-sans-semibold text-sm text-white opacity-60">
            See error message
          </Text>
        </Pressable>
        <TouchableOpacity
          onPress={() => params.navigation.goBack()}
          className="mt-2 items-center justify-center"
        >
          <View className="my-4 flex-row items-center rounded-xl bg-primary-dark p-4">
            <Text className="font-open-sans-bold text-xs text-white opacity-90">
              Go back
            </Text>
          </View>
        </TouchableOpacity>

        <JsonModal
          isModalVisible={isModalVisible}
          jsonData={params.route.params.error}
          toggleModal={toggleModal}
        />
      </SafeAreaView>
    </View>
  );
}
