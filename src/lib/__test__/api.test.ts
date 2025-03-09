import { addPet, fetchPetById, fetchPets } from "../api";
import { supabase } from "../supabase";
import { AddPetVariables, Pet, PET_TYPES } from "../types";

//TODO: ADD TESTS FOR DELETE AND UPDATE PET

jest.mock("../supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("Pet API functions", () => {
  const mockUserId = "test-user-123";
  const mockPetId = "test-pet-456";

  const mockPets: Pet[] = [
    {
      id: mockPetId,
      name: "Burek",
      type: PET_TYPES.Dog,
      breed: "Mixed",
      age: "3 years",
      image: "https://example.com/dog.jpg",
      owner_id: mockUserId,
      weight: "15",
      special_instructions: "Allergic to corn",
      custom_type: null,
      created_at: "2023-01-01T12:00:00Z",
    },
    {
      id: "test-pet-789",
      name: "Mruczek",
      type: PET_TYPES.Cat,
      breed: "European",
      age: "2 years",
      image: "https://example.com/cat.jpg",
      owner_id: mockUserId,
      weight: "4",
      special_instructions: "Likes to be brushed",
      custom_type: null,
      created_at: "2023-02-01T12:00:00Z",
    },
  ];

  let mockFromReturn: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFromReturn = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    };

    (supabase.from as jest.Mock).mockReturnValue(mockFromReturn);
  });

  describe("fetchPets", () => {
    it("should return a list of pets for a given user", async () => {
      mockFromReturn.order.mockResolvedValue({ data: mockPets, error: null });

      const result = await fetchPets(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("pets");
      expect(mockFromReturn.select).toHaveBeenCalledWith("*");
      expect(mockFromReturn.eq).toHaveBeenCalledWith("owner_id", mockUserId);
      expect(mockFromReturn.order).toHaveBeenCalledWith("created_at", { ascending: false });

      expect(result).toEqual(mockPets);
    });

    it("should return an empty array when no pets are found", async () => {
      mockFromReturn.order.mockResolvedValue({ data: null, error: null });

      const result = await fetchPets(mockUserId);

      expect(result).toEqual([]);
    });

    it("should throw an error when the request fails", async () => {
      const mockError = { message: "Database error" };
      mockFromReturn.order.mockResolvedValue({ data: null, error: mockError });

      await expect(fetchPets(mockUserId)).rejects.toThrow("Failed to load pets: Database error");
    });
  });

  describe("fetchPetById", () => {
    it("should return a specific pet by ID", async () => {
      mockFromReturn.single.mockResolvedValue({ data: mockPets[0], error: null });

      const result = await fetchPetById(mockPetId, mockUserId);

      expect(supabase.from).toHaveBeenCalledWith("pets");
      expect(mockFromReturn.select).toHaveBeenCalledWith("*");
      expect(mockFromReturn.eq).toHaveBeenCalledTimes(2);
      expect(mockFromReturn.eq).toHaveBeenNthCalledWith(1, "id", mockPetId);
      expect(mockFromReturn.eq).toHaveBeenNthCalledWith(2, "owner_id", mockUserId);
      expect(mockFromReturn.single).toHaveBeenCalled();

      expect(result).toEqual(mockPets[0]);
    });

    it("should throw an error when pet is not found", async () => {
      const mockError = { message: "Pet not found" };
      mockFromReturn.single.mockResolvedValue({ data: null, error: mockError });

      await expect(fetchPetById(mockPetId, mockUserId)).rejects.toThrow(
        "Failed to load pet: Pet not found",
      );
    });
  });

  describe("addPet", () => {
    it("should add a new pet and return data", async () => {
      const newPet: AddPetVariables = {
        name: "New Dog",
        type: PET_TYPES.Dog,
        breed: "Labrador",
        age: "1 year",
        image: "https://example.com/labrador.jpg",
        owner_id: mockUserId,
        weight: 20,
        special_instructions: "Hypoallergenic food",
        custom_type: null,
      };

      const addedPet = { ...newPet, id: "new-id-123", created_at: "2023-05-01T12:00:00Z" };
      mockFromReturn.select.mockResolvedValue({ data: [addedPet], error: null });

      const result = await addPet(newPet);

      expect(supabase.from).toHaveBeenCalledWith("pets");
      expect(mockFromReturn.insert).toHaveBeenCalledWith([newPet]);
      expect(mockFromReturn.select).toHaveBeenCalled();

      expect(result).toEqual([addedPet]);
    });

    it("should return an empty array when no data is returned", async () => {
      mockFromReturn.select.mockResolvedValue({ data: null, error: null });

      const newPet: AddPetVariables = {
        name: "New Dog",
        type: PET_TYPES.Dog,
        breed: "Labrador",
        age: "1 year",
        image: "https://example.com/labrador.jpg",
        owner_id: mockUserId,
        weight: 20,
        special_instructions: "Hypoallergenic food",
        custom_type: null,
      };

      const result = await addPet(newPet);

      expect(result).toEqual([]);
    });

    it("should throw an error when add operation fails", async () => {
      const mockError = { message: "Invalid data" };
      mockFromReturn.select.mockResolvedValue({ data: null, error: mockError });

      const newPet: AddPetVariables = {
        name: "New Dog",
        type: PET_TYPES.Dog,
        breed: "Labrador",
        age: "1 year",
        image: "https://example.com/labrador.jpg",
        owner_id: mockUserId,
        weight: 20,
        special_instructions: "Hypoallergenic food",
        custom_type: null,
      };

      await expect(addPet(newPet)).rejects.toThrow("Failed to add pet: Invalid data");
    });
  });
});
