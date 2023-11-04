import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { Fragment, useCallback, useRef, useState } from "react";
import { RootStackScreenProps } from "../../types/navigation";
import { Flashcard } from "../../utils/types";
import { GoBackSignButton } from "../../components/goBackSignButton";

const { height } = Dimensions.get("screen");

export const FlashcardsScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"FlashcardsScreen">) => {
  // const [index, setIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [cards, setCards] = useState<Array<Flashcard>>([...route.params]);
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltCard = useRef(new Animated.Value(1)).current;
  const [index, setIndex] = useState<number>(1);

  // PanResponder configuration
  const panResponder = PanResponder.create({
    // Allow pan responder to activate
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return dx > 20 || dx < -20 || dy > 20 || dy < -20;
    },

    onMoveShouldSetPanResponderCapture: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return dx > 20 || dx < -20 || dy > 20 || dy < -20;
    },
    // Handle card movement while dragging
    onPanResponderMove: (_, { dx, dy, y0 }) => {
      swipe.setValue({ x: dx, y: dy });
      tiltCard.setValue(y0 > (height * 0.9) / 2 ? -1 : 1);
    },

    // Handle card release after dragging
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 100;

      if (isActionActive) {
        // Swipe the card off the screen
        Animated.timing(swipe, {
          duration: 100,
          toValue: {
            x: direction * 500,
            y: dy,
          },
          useNativeDriver: true,
        }).start(() => {
          setShowAnswer(false);
          if (dx < 0) {
            const tempCards = [...cards];
            const currentCard = tempCards.shift() as Flashcard;
            tempCards.push(currentCard);
            setCards(tempCards);
            swipe.setValue({ x: 0, y: 0 });
          } else {
            removeTopCard();
          }
        });
      } else {
        // Return the card to its original position
        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });
  const removeTopCard = useCallback(() => {
    setCards((prevState) => prevState.slice(1));
    setIndex((index) => index + 1);
    swipe.setValue({ x: 0, y: 0 });
  }, [swipe]);

  // Opacity animation for the "like" button
  const likeOpacity = swipe.x.interpolate({
    inputRange: [25, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Opacity animation for the "nope" button
  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-100, -25],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Function to render the "like" and "nope" buttons conditionally
  const renderChoice = useCallback(() => {
    return (
      <Fragment>
        <Animated.View
          className={"absolute left-12 top-8 "}
          style={{   shadowColor: 'green',
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 20, opacity: likeOpacity }}
        >
          <Text className="text-3xl font-bold text-primary">Got It</Text>
        </Animated.View>
        <Animated.View
          className={"absolute right-12 top-8"}
          style={{ opacity: nopeOpacity }}
        >
          <Text className="text-3xl font-bold text-red-500">
            Needs{"\n"}Revision
          </Text>
        </Animated.View>
      </Fragment>
    );
  }, [likeOpacity, nopeOpacity]);
  return (
    <View
      className={"flex flex-1 items-center justify-center bg-background-dark"}
    >
      <GoBackSignButton onPress={() => navigation.goBack()} />
      {cards
        .map(({ question, answer }, index) => {
          const isFirst = index === 0;
          const dragHandler = panResponder;
          const rotate = Animated.multiply(swipe.x, tiltCard).interpolate({
            inputRange: [-100, 0, 100],
            outputRange: ["8deg", "0deg", "-8deg"],
          });

          // Animated style for the card with rotation and translation
          const animatedCardStyle = {
            transform: [...swipe.getTranslateTransform(), { rotate }],
          };
          return (
            <Animated.View
              key={index}
              className={
                "absolute h-3/5 w-4/5 rounded-3xl bg-cardLight-dark p-4 border-2 border-card-dark "
              }
              {...dragHandler.panHandlers}
              style={[isFirst && animatedCardStyle]}
            >
              <Pressable
                onPress={() => setShowAnswer(!showAnswer)}
                className="flex h-full w-full items-center justify-center p-4"
              >
                <Fragment>
                  {isFirst && renderChoice()}
                  <Text
                    className={
                      "absolute top-0 text-xl font-open-sans-semibold text-white"
                    }
                  >
                    {showAnswer && isFirst ? "Answer:" : "Question: "}
                  </Text>
                  <Text className={"text-center text-2xl font-open-sans-bold text-white"}>
                    {showAnswer && isFirst ? answer : question}
                  </Text>
                </Fragment>
              </Pressable>
            </Animated.View>
          );
        })
        .reverse()}

<Animated.View
      style={{ shadowColor: 'green',
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 50, opacity:likeOpacity}}
      className={
        "absolute -z-50 h-3/5 w-4/5 justify-center rounded-3xl p-4"
      }
      />
<Animated.View
      style={{ shadowColor: 'red',
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 50, opacity:nopeOpacity}}
      className={
        "absolute -z-50 h-3/5 w-4/5 justify-center rounded-3xl border-2 p-4"
      }
      />

      <View
      className={
        "absolute -z-50 h-3/5 w-4/5 justify-center rounded-3xl bg-cardLight-dark p-4"
      }
      >
        <Text className={"my-4 text-center text-3xl text-white font-open-sans-semibold"}>
          {route.params.length > 0
            ? "That's all, good job!"
            : "This flashcards set is empty!"}
        </Text>
        <TouchableOpacity
          className={"rounded-xl bg-primary p-2"}
          onPress={() => navigation.goBack()}
          >
          <Text className={"text-center text-base py-2 text-white font-open-sans-semibold"}>Go back</Text>
        </TouchableOpacity>
      </View>
      <Text className={"absolute bottom-16 text-xl text-white"}>
        {index <= route.params.length
          ? `${index} / ${route.params.length}`
          : `${route.params.length > 0 ? "All done! Good job!" : ""}`}
      </Text>
    </View>

  );
};
