import { PetFormData } from "./types";

export const PET_IMAGES = {
  Dog: "https://images.unsplash.com/photo-1552053831-71594a27632d",
  Cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
  Bird: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f",
  Rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308",
  Hamster: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
  Fish: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5",
  Reptile: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae",
  Exotic: "https://images.unsplash.com/photo-1515536765-9b2a70c4b333",
  Other: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
};

export const DEFAULT_PET_IMAGE =
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

export const DEFAULT_PET_FORM: PetFormData = {
  name: "",
  type: "",
  breed: "",
  age: "",
  image: DEFAULT_PET_IMAGE,
  weight: "",
  special_instructions: "",
  custom_type: "",
};
