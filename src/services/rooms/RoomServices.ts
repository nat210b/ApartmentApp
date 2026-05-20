import { supabase } from "../utils/supabase";
import type { Room } from "../../schemas/Room";

export const getRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase.from("Rooms").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
};
