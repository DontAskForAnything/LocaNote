import { useOAuth } from "@clerk/clerk-expo";
import React from "react";
import type { OAuthStrategy } from "@clerk/types";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

// According tailwindcss.com/docs/content-configuration#dynamic-class-names this is as it should be
type ColorVariants = {
  facebook: string;
  google: string;
  apple: string;
};

const backgroundColorVariants: ColorVariants = {
  facebook: "bg-blue-600 dark:bg-input-dark ",
  google: "bg-background dark:bg-blue-600",
  apple: "bg-black dark:bg-background",
};

const textColorVariants: ColorVariants = {
  facebook: "text-white dark:text-white",
  google: "text-black dark:text-white",
  apple: "text-white dark:text-black",
};

const SignInWithOAuthButton = ({
  themeVariant,
  oauth_strategy,
  text,
  iconName,
  onNewAccount,
}: {
  themeVariant: keyof ColorVariants;
  oauth_strategy: OAuthStrategy;
  text: string;
  iconName: string;
  onNewAccount: () => void;
}) => {
  const colorScheme = useColorScheme();
  const iconColor: ColorVariants = {
    facebook: "white",
    google: colorScheme == "dark" ? "white" : "black",
    apple: colorScheme == "dark" ? "black" : "white",
  };

  const { startOAuthFlow } = useOAuth({ strategy: oauth_strategy });

  const [error, setError] = React.useState("");

  const handleSignIn = React.useCallback(async () => {
    setError("");
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({});

      if (createdSessionId && setActive) {
        // Account do exist, set session
        setActive({ session: createdSessionId });
      } else if (signIn) {
        // Account do not exist, navigate to
        if (
          !signUp ||
          signIn?.firstFactorVerification.status !== "transferable"
        ) {
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        }

        onNewAccount();
      }
    } catch (err: unknown) {
      setError("Something went wrong, try again!");
      // console.log("SignInWithOAuth.tsx: ", JSON.stringify(err, null, 2));
    }
  }, []);
  return (
    <>
      <TouchableOpacity
        className={`rounded-2xl p-4 shadow-md shadow-black ${
          backgroundColorVariants[themeVariant]
        }  ${error && "border-2 border-red-500"}`}
        onPress={handleSignIn}
      >
        <View
          className={`absolute left-5 top-1/2 flex items-center justify-center`}
        >
          <FontAwesome5
            name={`${iconName}`}
            size={26}
            color={iconColor[themeVariant]}
          />
        </View>
        <Text
          className={`text-center font-open-sans-semibold ${textColorVariants[themeVariant]} `}
        >
          {text}
        </Text>
      </TouchableOpacity>
      <Text className="flex h-6 pt-0.5 text-center font-open-sans-semibold text-xs text-red-500">
        {error}
      </Text>
    </>
  );
};

export default SignInWithOAuthButton;
