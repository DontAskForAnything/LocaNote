import React from "react";
import { View, Modal, ActivityIndicator, useColorScheme } from "react-native";

const LoadingModal = ({ visible }: { visible: boolean }) => {
  const colorScheme = useColorScheme();
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <ActivityIndicator
          size="large"
          color={colorScheme == "dark" ? "white" : "black"}
        />
      </View>
    </Modal>
  );
};

export default LoadingModal;
