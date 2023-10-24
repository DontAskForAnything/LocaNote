import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface SubjectItem {
  id: string;
  title: string;
  // Because this will be icon name if will be wrong big question mark will appear
  icon: any; // eslint-disable-line
  color: string;
}

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
  CalenderStack: undefined;
  // Main Stack
  MainStack: undefined;
  MainScreen: undefined;
  AddSubjectScreen: Array<SubjectItem>;
  SubjectScreen: undefined;
  // Calendar Stack
  CalendarStack: undefined;
  CalendarScreen: undefined;
  // AccountStack
  Account: undefined;
  Settings: undefined;
  AppNavigator: undefined;
};

declare module "@react-navigation/native" {
  export type RootParamList = RootStackParamList;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
