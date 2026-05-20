import { supabase } from "../utils/supabase";
import type { Room } from "../../schemas/Room";

export type CreateRoomInput = Omit<Room, "ID" | "Created_at" | "Updated_at">;
export type UpdateRoomInput = Partial<Omit<Room, "ID" | "Created_at" | "Updated_at">>;

export const getRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase.from("Rooms").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const getRoomById = async (id: number): Promise<Room> => {
  const { data, error } = await supabase
    .from("Rooms")
    .select("*")
    .eq("ID", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createRoom = async (room: CreateRoomInput): Promise<Room> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("Rooms")
    .insert({
      ...room,
      Created_by: room.Created_by ?? userData.user?.id,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateRoom = async (
  id: number,
  room: UpdateRoomInput,
): Promise<Room> => {
  const { data, error } = await supabase
    .from("Rooms")
    .update({
      ...room,
      Updated_at: new Date().toISOString(),
    })
    .eq("ID", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  const { error } = await supabase.from("Rooms").delete().eq("ID", id);

  if (error) {
    throw error;
  }
};
