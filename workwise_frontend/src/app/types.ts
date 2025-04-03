import { z } from "zod";

export const createNewUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "- Email is required!" })
    .min(4, { message: "- Email length must be more than 4 character." })
    .max(40, { message: "- Email length must be less than 20 character." }),
  password: z
    .string()
    .trim()
    .min(3, { message: "- Password length must be more than 3 characters." }),
  name: z
    .string()
    .trim()
    .min(3, { message: "- Username length must be more than 3 characters." }),
});

export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "- Email is required!" })
    .min(4, { message: "- Email length must be more than 4 character." })
    .max(40, { message: "- Email length must be less than 20 character," }),
  password: z
    .string()
    .trim()
    .min(3, { message: "- Password length must be more than 3 characters." }),
});
