import { supabase } from "./supabase";
import { AddPetVariables, Pet, UpdatePetVariables } from "./types";

export async function fetchPets(userId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load pets: ${error.message}`);
  }

  return data || [];
}

export async function fetchPetById(petId: string, userId: string): Promise<Pet> {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", petId)
    .eq("owner_id", userId)
    .single();

  if (error) {
    throw new Error(`Failed to load pet: ${error.message}`);
  }

  return data;
}

export async function addPet(petData: AddPetVariables): Promise<Pet[]> {
  const { data, error } = await supabase.from("pets").insert([petData]).select();

  if (error) {
    throw new Error(`Failed to add pet: ${error.message}`);
  }

  return data || [];
}

export async function updatePet(
  { petData, petId }: UpdatePetVariables,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("pets")
    .update(petData)
    .eq("id", petId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(`Failed to update pet: ${error.message}`);
  }
}

export async function deletePet(petId: string, userId: string): Promise<void> {
  const { error } = await supabase.from("pets").delete().eq("id", petId).eq("owner_id", userId);

  if (error) {
    throw new Error(`Failed to delete pet: ${error.message}`);
  }
}

export async function fetchPetSitters(
  city: string | null,
  lat: number | null,
  lng: number | null,
  radius: number | null,
) {
  try {
    const { data, error } = await supabase.rpc("search_sitters", {
      city: city,
      lat: lat,
      lng: lng,
      radius: radius,
    });

    if (error) {
      throw new Error(`Error fetching pet sitters: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`Error fetching pet sitters: ${error.message}`);
    }
    throw new Error("Unexpected error occurred while fetching pet sitters.");
  }
}
