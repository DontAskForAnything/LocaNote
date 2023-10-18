import { z } from "zod";

export const TextSchema = z
  .string()
  .min(1, "Aby dodać musisz coś wpisać")
  .max(25, "Troche za długie");
