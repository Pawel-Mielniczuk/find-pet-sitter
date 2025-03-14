import { z } from "zod";

// Pet schemas for validation
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
  name: z.string().min(1, "Pet name is required").default(""),
  type: z.string().min(1, "Pet type is required").default(""),
  breed: z.string().min(1, "Breed is required").default(""),
  age: z.string().min(1, "Age is required").default(""),
  image: z.string().url().default(""),
  weight: z.union([z.number().positive(), z.null()]).optional().default(null),
  special_instructions: z.string().nullable().default(""),
  custom_type: z.string().nullable().default(""),
});

export const petSitterSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  location: z.string(),
  image: z.string().nullable(),
  price: z.number().nullable(),
  years_experience: z.number().nullable(),
  services: z.array(z.string()).nullable(),
  specialties: z.array(z.string()).nullable(),
  availability_status: z.boolean().nullable(),
  bio: z.string().nullable(),
  rating: z.number().nullable(),
});

const conversationSchema = z.object({
  id: z.string(),
  owner_id: z.string(),
  sitter_id: z.string(),
  last_message: z.string().min(1),
  created_at: z.string(),
  owner: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      avatar_url: z.string().url(),
    })
    .nullable(),
  sitter: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      avatar_url: z.string().url(),
    })
    .nullable(),
});

const messageSchema = z.object({
  id: z.string(),
  sender_id: z.string(),
  recipient_id: z.string(),
  content: z.string().min(1),
  read: z.boolean(),
  created_at: z.string(),
  conversation_id: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export type Conversation = z.infer<typeof conversationSchema>;
// Inferred types from schemas
export type Pet = z.infer<typeof petSchema>;
export type NewPet = z.infer<typeof newPetSchema>;
export type PetSitter = z.infer<typeof petSitterSchema>;

// Pet types
export type PetType =
  | "Dog"
  | "Cat"
  | "Bird"
  | "Rabbit"
  | "Hamster"
  | "Fish"
  | "Reptile"
  | "Exotic"
  | "Other";

// Form-related types
export type PetFormData = {
  name: string;
  type: string;
  breed: string;
  age: string;
  image: string;
  weight: string;
  special_instructions: string;
  custom_type: string;
};

export type ValidationErrors = {
  name?: string;
  type?: string;
  breed?: string;
  age?: string;
  custom_type?: string;
};

// Mutation types
export type AddPetVariables = NewPet & { owner_id: string };
export type UpdatePetVariables = { petData: Partial<NewPet>; petId: string };

// Image mapping type
export type PetImageMap = Record<PetType | string, string>;

// Context types
export type PetsContextType = {
  // Modal state
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  typeModalVisible: boolean;
  setTypeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;

  // Pet data
  pets: Pet[];
  isLoading: boolean;

  // Add pet functionality
  newPet: NewPet;
  setNewPet: React.Dispatch<React.SetStateAction<NewPet>>;
  handleAddPet: () => Promise<void>;

  // Edit pet functionality
  petForm: PetFormData;
  setPetForm: React.Dispatch<React.SetStateAction<PetFormData>>;
  handleUpdatePet: (id: string) => Promise<void>;
  isUpdating: boolean;
  initializePetForm: (petData: Partial<Pet>) => void;
  selectPetType: (type: string) => void;

  // Delete pet functionality
  handleDeletePet: (pet: Pet) => void;
  isDeleting: boolean;

  // Validation
  errors: ValidationErrors;
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
};

export enum PET_TYPES {
  Dog = "Dog",
  Cat = "Cat",
  Bird = "Bird",
  Rabbit = "Rabbit",
  Hamster = "Hamster",
  Fish = "Fish",
  Reptile = "Reptile",
  Exotic = "Exotic",
  Other = "Other",
}

// export type Message = {
//   id: string;
//   sender_id: string;
//   recipient_id: string;
//   content: string;
//   read: boolean;
//   conversation_id: string;
//   created_at: string;
// };

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

// export type Conversation = {
//   id: string;
//   owner_id: string;
//   sitter_id: string;
//   last_message: string | null;
//   created_at: string;
//   owner: UserProfile;
//   sitter: UserProfile;
// };
