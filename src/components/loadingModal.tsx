import React from "react";
import { View, Modal, ActivityIndicator } from "react-native";

const LoadingModal = ({ visible }: { visible: boolean }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <ActivityIndicator size="large" color={"#16a34a"} />
      </View>
    </Modal>
  );
};

export default LoadingModal;
