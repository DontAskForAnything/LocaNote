import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { Calendar } from "react-native-calendars";
import { PlusSignButton } from "../../components/plusSignButton"
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import { firestore } from "../../utils/firebaseConfig";
import { useUser } from "@clerk/clerk-react";
import { collection, doc, getDoc, setDoc } from "@firebase/firestore";
import { MarkedDates } from "react-native-calendars/src/types";

type Task = {
  id: string,
  name: string,
  endDate: string,
  estimatedTime: number,
  loggedTime: number
}
export const CalendarScreen = ({}: RootStackScreenProps<"CalendarScreen">) => {
  const today = new Date().toISOString().substring(0,10).split("-").reverse().join("/");
  const { user } = useUser();
  const [selectedDay, setSelectedDay] = useState<string>(new Date(Date.now()).toISOString().substring(0, 10));
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(today);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [taskDates, setTaskDates] = useState<MarkedDates>({[new Date(Date.now()).toISOString().substring(0, 10)]: {selected: true}})
  const [loaded, setLoaded] = useState<boolean>(false);
  const showDatePicker = (): void => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: handleDateChange,
      mode: "date",
      minimumDate: new Date(Date.now() + 86400000) // +1 day
    });
  }
  const clearModal = (): void => {
    setAssignmentName("");
    setEstimatedTime("");
    setEndDate(today);
    setModalVisible(!modalVisible);
  }
  const handleDateChange = (event: DateTimePickerEvent, date: Date | undefined): void => {
    if(date !== undefined) {
      setEndDate(date.toISOString().substring(0,10).split("-").reverse().join("/"));
    }
  }

  const addTask = (): void => {
    setModalVisible(true);
  }

  const submitTask = (): void => {
    setModalVisible(false);
    if(user) {
      setDoc(doc(firestore, "users", user.id), {
        tasks: [...tasks, {
          id: assignmentName + "_" + endDate.split("/").reverse().join("-"),
          name: assignmentName,
          endDate: endDate.split("/").reverse().join("-"),
          estimatedTime: parseInt(estimatedTime)*3600,
          loggedTime: 0
        }]
      }).then(() => {
        tasks.push(
          {
            id: assignmentName + "_" + endDate.split("/").reverse().join("-"),
            name: assignmentName,
            endDate: endDate.split("/").reverse().join("-"),
            estimatedTime: parseInt(estimatedTime)*3600,
            loggedTime: 0
          }
        )
      })
    }
  }

  const setMarking = (tasks: Array<Task>, dates: Array<string>): MarkedDates => {
    let markedEvents: {[key: string]: Object} = {};
    let uniqueDates = [...new Set(dates)]; //remove duplicate event dates
    let usedIndexes: Array<string> = [];
      uniqueDates.forEach((date: string) => {
          let periods: Array<Object> = [];
          let markedData: {[key: string]: {}} = {};
          tasks.forEach((task: Task, index: number) => {
              let lastDay = new Date(task.endDate);
              lastDay.setDate(lastDay.getDate() - 1);
              let color = `hsl(${50 + index*50},100%,50%)`;
              if (date <= lastDay.toISOString().substring(0,10)) {
                if(date === lastDay.toISOString().substring(0, 10)) {
                  periods.push({startingDay: false, endingDay: true, color: color});
                  usedIndexes.push(task.id);
                }
                else if(date === new Date().toISOString().substring(0,10)) { //check if equal to today
                  periods.push({startingDay: true, endingDay: false, color: color});
                }
                else {
                  periods.push({startingDay: false, endingDay: false, color: color});
                }

              }
            })
          markedData['periods'] = periods; //set the array of dots
          markedEvents[date] = markedData; //add markers to marked dates
      });
      return markedEvents;
  };

  const getData = async (): Promise<void> => {
    if(user) {
      const ref = doc(firestore, "users", user.id);
      const userData = await getDoc(ref)
      if(userData.exists()) {
        setTasks(userData.data().tasks);
        let tempDates: Array<string> = [];
        userData.data().tasks.forEach((task: Task, index: number) => {
          let currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + index);
          let endDate = new Date(task.endDate)
          while(currentDate < endDate) {
            let date = new Date(currentDate).toISOString().substring(0,10);
            tempDates.push(date); 
            currentDate.setDate(currentDate.getDate() + 1);
          }
        })
        let markedDates = setMarking(userData.data().tasks, tempDates);
        setTaskDates(markedDates);
        // setLoaded(true);
        // setTaskDates({[selectedDay]: {selected: true}, ...tempDates});
      }
    }
  }

  useEffect(() => {
    getData();
  }, [])
  useEffect(() => {
    let temp = {[new Date(Date.now()).toISOString().substring(0, 10)]: {selected: true}};
    if(JSON.stringify(taskDates) != JSON.stringify(temp)) {
      setLoaded(true);[]
    }
  },[taskDates])
  return (
    <KeyboardAvoidingView className="h-screen flex-1 bg-background-dark">
      { loaded && <>
      <Calendar
        markingType="multi-period"
        firstDay={1}
        markedDates={taskDates}
        // TESTING VALUES
        // markedDates={{"2023-10-22": {marked: true}}}
        // markedDates={{"2023-10-21": {"periods": [{startingDay: true, endingDay: false, color: "red"}, {startingDay: true, endingDay: false, color: "orange"}]}, "2023-10-22": {"periods": [{startingDay: false, endingDay: false, color: "red"}, {startingDay: false, endingDay: false, color: "orange"}]}, "2023-10-23": {"periods": [{startingDay: false, endingDay: false, color: "red"}, {startingDay: false, endingDay: true, color: "orange"}]}, "2023-10-24": {"periods": [{startingDay: false, endingDay: true, color: "red"}]}}}
        className="bg-backgroundLight-dark rounded-b-3xl py-4"
        theme={{
          arrowColor: "#16A34A",
          textSectionTitleColor: "white",
          monthTextColor: "white",
          calendarBackground: "#212121",
          backgroundColor: "#212121",
          dayTextColor: "white",
          textDisabledColor: "grey",
          selectedDotColor: "blue",
          selectedDayBackgroundColor: "#16A34A",
          todayTextColor: "#16A34A",
          selectedDayTextColor: "white",
        }}
        onDayPress={(day) => {
          setSelectedDay(day.dateString);
        }}
      /> 
      <View className="my-4">
        {tasks?.map((task, index) => {
          let totalTime_hrs = Math.floor(task.estimatedTime / 3600);
          let loggedTime_hrs = Math.floor(task.loggedTime / 3600);
          let loggedTime_mins = Math.floor((task.loggedTime % 3600) / 60);
          return (
            <View key={index} className={"flex-row justify-between w-1/1 p-4 items-center"}>
              {/* Nested Views for proper icon background */}
              <View> 
                <View className={"bg-primary rounded-full p-3"}>
                  <AntDesign name="right" size={20} color={"white"} />
                </View>
              </View>
              <View className={"items-center"}>
                <Text className={"text-white font-poppins-medium text-lg"}>{task.name}</Text>
                <Text className={"text-white font-poppins-medium text-xs text-slate-400"}>{task.endDate.split("-").reverse().join("/")}</Text>
              </View>
              <Text className={"text-slate-400 font-poppins-medium bg-moreOptions-dark p-2 rounded-full"}>{`${loggedTime_hrs}h ${loggedTime_mins}m/${totalTime_hrs}h`}</Text>
            </View>
          )
        })}
      </View>
      </>}





        {/* TODO: add estimated time input validation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(!modalVisible)}}
      >
          <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
            <View className={"absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center"}>
              <View className={"rounded-xl bg-backgroundLight-dark p-4 w-4/5 gap-4"}>
                <Text className={"text-center text-lg text-white font-poppins-medium"}>New Assignment</Text>
                <TextInput className={`bg-input rounded-2xl p-4  font-poppins-medium text-black dark:bg-card-dark dark:text-white`}
                  value={assignmentName}
                  onChangeText={(text) => setAssignmentName(text)}
                  autoCapitalize="none"
                  placeholder="Assignment Name"
                  placeholderTextColor="#6B7280"
                />
                <TextInput className={`bg-input rounded-2xl p-4  font-poppins-medium text-black dark:bg-card-dark dark:text-white`}
                  value={estimatedTime}
                  onChangeText={(time) => setEstimatedTime(time)}
                  autoCapitalize="none"
                  placeholder="Estimated Time (hours)"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={showDatePicker}>
                  <View className={"bg-input rounded-2xl p-4 font-poppins-medium dark:bg-card-dark flex-row items-center justify-between"}>
                    <Text className={"mr-4"} style={{color: endDate === today ? "#6B7280" : "white"}}>{endDate === today ? "Due Date" : endDate} </Text>
                    <AntDesign name="calendar" size={20} color={"white"} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="mt-4 rounded-2xl bg-primary p-4 dark:bg-primary-dark" onPress={submitTask}>
                <Text className="text-center font-open-sans-bold text-white">
                    Add Assignment
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearModal}>
                  <Text className={"border-2 border-red-500 p-2 rounded-xl text-red-500 text-center"}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
      </Modal>
      <PlusSignButton onPress={addTask} />
    </KeyboardAvoidingView>
  );
};
