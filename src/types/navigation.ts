import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SubjectItem, Topic } from "../utils/types";

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
  MainScreen: { refresh?: number };
  AddSubjectScreen: Array<SubjectItem>;
  SubjectScreen: SubjectItem;
  Settings: undefined;
  GenerateTopics: { subject: SubjectItem; topics: Topic[] | [] };
};

declare module "@react-navigation/native" {
  export type RootParamList = RootStackParamList;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
