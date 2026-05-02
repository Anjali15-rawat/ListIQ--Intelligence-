import { z } from 'zod';

export const analyzeSchema = z.object({
  body: z.object({
    url: z
      .string()
      .url({ message: "A valid URL is required" })
      .refine((val) => val.includes("amazon."), {
        message: "Please enter a valid Amazon product URL",
      }),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty"),
    // Allow empty string (no URL pasted yet) or a valid URL
    url: z.union([z.string().url(), z.literal(''), z.undefined()]).optional(),
  }),
});