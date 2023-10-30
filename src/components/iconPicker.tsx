import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';

const icons: Array<string> = [
    "book",
    "book-open",
    "dumbbell",
    "graduation-cap",
    "calculator",
    "laptop-code",
    "atom",
    "flask",
    "frog",
    "pen-nib",
];

interface iconPickerProps {
    selectedIcon: string;
    onPress: (icon: string) => void 
}


export const IconPicker = ({selectedIcon, onPress}: iconPickerProps) => {
  return (
    <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          numColumns={5}
          keyExtractor={(item) => item}
          data={icons}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                className={`m-1 h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-700 ${
                  selectedIcon === item && "border-primary"
                }`}
                onPress={() => onPress(item)}
              >
                <FontAwesome5
                  name={item}
                  size={32}
                  color={selectedIcon === item ? "#16a34a" : "white"}
                />
              </TouchableOpacity>
            );
          }}
        />
  )
}