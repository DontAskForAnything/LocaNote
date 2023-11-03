import React from "react";
import { TextInput, View, Text, Pressable } from "react-native";

export const CodeInputAlpha = ({
  length,
  code,
  setCode,
  error,
}: {
  length: number;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  error: string;
}) => {
  const OTPInput = ({
    character,
    current,
  }: {
    character: string;
    current: boolean;
  }) => {
    return (
      <View
        className={`bg-input flex h-12 w-11 items-center justify-center rounded-lg dark:bg-card-dark ${
          current && " bg-gray-400 dark:bg-zinc-600"
        } ${error && "border-2 border-red-500"}`}
      >
        <Text className="font-bold text-black dark:text-white">
          {character}
        </Text>
      </View>
    );
  };

  const TextInputRef = React.useRef<TextInput | null>(null);
  const [inputInFocus, setInputInFocus] = React.useState(false);
  const codeDigitsArray = new Array<number>(length).fill(0);

  const toCodeDigitInput = (_value: number, index: number) => {
    const digit = code[index] || " ";
    return (
      <OTPInput
        key={index}
        character={digit}
        current={
          (code?.length - 1 === index || (index == 0 && code?.length <= 0)) &&
          inputInFocus
        }
      />
    );
  };

  return (
    <View className="relative">
      <Pressable
        onPress={() => {
          setInputInFocus(true);
          TextInputRef.current?.focus();
        }}
        className="z-10 flex w-11/12 flex-row justify-around self-center"
      >
        {codeDigitsArray.map(toCodeDigitInput)}
      </Pressable>

      <TextInput
        value={code}
        autoCapitalize="none"
        maxLength={length}
        onChangeText={(code) => {
          setCode(code);
        }}
        className={`absolute z-0 h-12 w-11/12 self-center bg-red-500 opacity-0`}
        onBlur={() => setInputInFocus(false)}
        ref={TextInputRef}
      />
      <Text className="mt-2 text-center font-open-sans-bold text-red-500">
        {error}
      </Text>
    </View>
  );
};
