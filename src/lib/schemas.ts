import { z } from "zod";

export const petSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Pet name is required"),
  type: z.string().min(1, "Pet type is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().min(1, "Age is required"),
  image: z.string().url("Invalid image URL"),
  owner_id: z.string(),
  weight: z.string().optional(),
  special_instructions: z.string().nullable().optional(),
  custom_type: z.string().nullable().optional(),
  created_at: z.string().or(z.date()),
});

export const newPetSchema = z.object({
  name: z.string().default(""),
  type: z.string().min(1, "Pet type is required").default(""),
  breed: z.string().default(""),
  age: z.string().default(""),
  image: z.string().url().default(""),
  weight: z.string().default("").optional(),
  special_instructions: z.string().nullable().default(""),
  custom_type: z.string().nullable().default(""),
});

export type NewPet = z.infer<typeof newPetSchema>;

export type Pet = z.infer<typeof petSchema>;
