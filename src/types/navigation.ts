import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Flashcard, SubjectItem, Topic } from "../utils/types";

export type VerificationType = "email";

export type RootStackParamList = {
  Welcome: undefined;
  // Login Screens
  LogInStrategy: undefined;
  // Sign up Screens
  SignUp: undefined;
  SignUpStrategy: undefined;
  VerifyCode: { verificationType: VerificationType };
  UsernameChoose: undefined;
  // Forgot Password Screens
  ForgotPasswordSendCode: undefined;
  ForgotPasswordCodeVerify: {
    verificationType: VerificationType;
    identifier: string;
  };
  ForgotPasswordRestart: undefined;
  AppStack: undefined;
  HomeStack: undefined;
  MainScreen: { refresh?: number };
  AddSubjectScreen: Array<SubjectItem>;
  SubjectScreen: {
    subject: SubjectItem;
    subjects: Readonly<Array<SubjectItem>>;
    author: boolean;
  };
  EditSubjectScreen: {
    subject: Readonly<SubjectItem>;
    subjects: Readonly<Array<SubjectItem>>;
  };
  TopicScreen: {
    subjectID: string;
    topics: Topic[];
    topic: Topic;
    author: boolean;
  };
  Settings: undefined;
  CreateTopic: { subject: SubjectItem; topics: Topic[] | [] };
  FlashcardsScreen: Array<Flashcard>;
  PrepareFlashcardsScreen: {
    topics: Topic[];
    index: number;
    subjectID: Readonly<string>;
  };
  AiErrorScreen: { error: Readonly<string> };
  // Shared
  MainShared: { refresh: number } | undefined;
  EditTopicScreen: {
    subject: Readonly<SubjectItem>;
    topics: Readonly<Topic[]>;
    topic: Topic;
  };
};

declare module "@react-navigation/native" {
  export type RootParamList = RootStackParamList;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
