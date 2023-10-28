import { View, Text, Animated, PanResponder, Dimensions, Pressable } from 'react-native'
import React, { Fragment, useCallback, useRef, useState } from 'react'
import { RootStackScreenProps } from '../../types/navigation'
import { Flashcard } from '../../utils/types'
import { GoBackSignButton } from '../../components/goBackSignButton'

const { width, height } = Dimensions.get("screen")

export const FlashcardsScreen = ({navigation, route}: RootStackScreenProps<"FlashcardsScreen">) => {
    // const [index, setIndex] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [cards, setCards] = useState<Array<Flashcard>>([...route.params])
    const swipe = useRef(new Animated.ValueXY()).current;
    const tiltCard = useRef(new Animated.Value(1)).current;

    // PanResponder configuration
  const panResponder = PanResponder.create({
    // Allow pan responder to activate
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () =>
      false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState
        return (dx > 20 || dx < -20 || dy > 20 || dy < -20)
      },
      
    onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        const { dx, dy } = gestureState
        return (dx > 20 || dx < -20 || dy > 20 || dy < -20) 
      },
    // Handle card movement while dragging
   onPanResponderMove: (_, {dx, dy, y0})=>{
     swipe.setValue({x: dx, y: dy});
     tiltCard.setValue(y0 > (height * 0.9) / 2 ? -1 : 1)
   },

   // Handle card release after dragging
   onPanResponderRelease: (_, { dx, dy })=>{
     const direction = Math.sign(dx);
     const isActionActive = Math.abs(dx) > 100;

     if(isActionActive){
       // Swipe the card off the screen
       Animated.timing(swipe, {
         duration: 100,
         toValue: {
           x: direction * 500,
           y: dy
         },
         useNativeDriver: true
       }).start(removeTopCard);

     }else{
       // Return the card to its original position
       Animated.spring(swipe, {
         toValue: {
           x: 0,
           y: 0
         },
         useNativeDriver: true,
         friction: 5
       }).start()
     }
   }
 })
 const removeTopCard = useCallback(()=>{
    setCards((prevState)=>prevState.slice(1));
    swipe.setValue({ x: 0, y: 0});
  },[swipe]);
  const handleChoice = useCallback((direction: any)=>{
    Animated.timing(swipe.x, {
      toValue: direction  * 500,
      duration: 400,
      useNativeDriver: true
    }).start(removeTopCard);

  },[removeTopCard,swipe.x]);
  // Opacity animation for the "like" button
  const likeOpacity = swipe.x.interpolate({
    inputRange: [25, 100],
    outputRange: [0,1],
    extrapolate: 'clamp'
});

// Opacity animation for the "nope" button
const nopeOpacity = swipe.x.interpolate({
    inputRange: [-100, -25],
    outputRange: [1,0],
    extrapolate: 'clamp'
});

// Function to render the "like" and "nope" buttons conditionally
const renderChoice = useCallback(()=>{
    return (
       <Fragment>
          <Animated.View
          className={"absolute left-12 top-8"}
           style={
            { opacity: likeOpacity }
            }>
             <Text className='text-primary font-bold text-3xl'>Got It</Text>
          </Animated.View>
          <Animated.View 
                    className={"absolute right-12 top-8"}
            style={
            { opacity: nopeOpacity }
                }>
             <Text className='text-red-500 font-bold text-3xl'>Needs{"\n"}Revision</Text>
          </Animated.View>
       </Fragment>
    )
},[likeOpacity, nopeOpacity])
    return (
    <View className={"flex flex-1 bg-background-dark items-center justify-center"} >
      <GoBackSignButton onPress={()=>navigation.navigate("MainScreen", {})}></GoBackSignButton>
        {
            cards.map(({question, answer}, index)=>{
                const isFirst = index === 0;
                const dragHandler = panResponder;
                const rotate = Animated.multiply(swipe.x,tiltCard).interpolate({
                    inputRange: [-100,0,100],
                    outputRange: ['8deg', '0deg', '-8deg']
                });
            
                 // Animated style for the card with rotation and translation
                const animatedCardStyle = {
                    transform: [...swipe.getTranslateTransform(), { rotate }]
                }
                return(
                    <Animated.View key={index} className={"bg-cardLight-dark rounded-3xl p-4 h-3/5 w-4/5 absolute"} {...dragHandler.panHandlers}
                        style={[ isFirst && animatedCardStyle]} 
                    >
                        <Pressable onPress={() => setShowAnswer(!showAnswer)} className='p-4 h-full w-full flex items-center justify-center'>
                        <Fragment>
                          {isFirst && renderChoice()}
                          <Text className={"text-white text-3xl font-semibold"}>{showAnswer ? "Answer:" : "Question: "}</Text>   
                          <Text className={"text-white text-xl"}>{showAnswer ? answer : question}</Text>   
                        </Fragment>
                        </Pressable>
                    </Animated.View> 
                )
            }).reverse()
        }
        {/* <View className={"border-4 border-primary rounded-3xl p-4 h-3/5 w-4/5 flex items-center justify-center relative"}>
            <Text className={"text-white text-3xl font-semibold absolute top-8"}>{showAnswer ? "Question:" : "Answer: "}</Text>   
            <Text className={"text-white text-lg"}>{showAnswer ? route.params[index]?.answer : route.params[index]?.question}</Text>   
        <TouchableOpacity onPress={() => setShowAnswer(!showAnswer)} className={"bg-primary p-2 rounded-xl absolute bottom-8"}>
            <Text className='text-white'>{showAnswer ? "Show Question" : "Show Answer"}</Text>    
        </TouchableOpacity>             
        </View> */}
    </View>
  )
}