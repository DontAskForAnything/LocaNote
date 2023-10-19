import { z } from "zod";

export const EmailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Invalid email address.");

export const PhoneSchema = z
  .string()
  .min(1, "Enter phone number.")
  .regex(/^[0-9]+$/, "Insert only numbers.");
export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

export const UsernameSchema = z
  .string()
  .trim()
  .min(4, "Username must be at least 4 characters.")
  .max(64, "Username must be shorter than 64 characters.")
  .regex(/[a-zA-Z]/, "Username must contain at least one non-number character.")
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Username can only contain alphanumeric characters, underscores (_), and dashes (-).",
  );

const BaseLogInSchema = z.object({
  password: PasswordSchema,
});

export const PhoneLogInSchema = BaseLogInSchema.extend({
  phoneNumber: PhoneSchema,
});
export const EmailLogInSchema = BaseLogInSchema.extend({
  emailAddress: EmailSchema,
});

export const LogInSchema = z.object({
  identifier: z.string().trim().min(1, "Enter email / phone / username."),
  password: z.string().min(1, "Enter password."),
});

const BaseSingUpSchema = z.object({
  password: PasswordSchema,
  passwordConfirm: z.string(),
  username: UsernameSchema,
});

export const EmailSignUpSchema = BaseSingUpSchema.extend({
  emailAddress: EmailSchema,
}).refine(
  (data) => {
    return data.password === data.passwordConfirm;
  },
  { message: "Passwords do not match.", path: ["passwordConfirm"] },
);

export const PhoneSignUpSchema = BaseSingUpSchema.extend({
  phoneNumber: z.string().min(1, "Enter phone number."),
}).refine(
  (data) => {
    return data.password === data.passwordConfirm;
  },
  { message: "Passwords do not match.", path: ["passwordConfirm"] },
);

export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    passwordConfirm: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    { message: "Passwords do not match.", path: ["passwordConfirm"] },
  );

export const AnswerQuestionSchema = z.object({
  answer: z
    .string()
    .min(1, "Answer is required")
    .max(10_000, "Answer is too long"),
  isAnonymous: z.boolean(),
  isPublic: z.boolean(),
});
