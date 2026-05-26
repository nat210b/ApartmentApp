import type { Maintenance } from "../../schemas/Maintenance";
import { supabase } from "../utils/supabase";

export type CreateMaintenanceInput = Omit<
  Maintenance,
  "ID" | "Created_at" | "Updated_at" | "RoomData" | "Create_by" | "Update_by"
>;
export type UpdateMaintenanceInput = Partial<Omit<Maintenance, "ID" | "Created_at" | "Updated_at" | "RoomData" | "Create_by" | "Update_by">>;

export const getMaintenances = async (): Promise<Maintenance[]> => {
  const { data, error } = await supabase
    .from("Maintenances")
    .select("*")
    .order("ID", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const createMaintenance = async (
  maintenance: CreateMaintenanceInput,
): Promise<Maintenance> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("Maintenances")
    .insert({
      ...maintenance,
      Create_by: userData.user?.id,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateMaintenance = async (
  id: number,
  maintenance: UpdateMaintenanceInput,
): Promise<Maintenance> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("Maintenances")
    .update({
      ...maintenance,
      Update_by: userData.user?.id,
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

export const deleteMaintenance = async (id: number): Promise<void> => {
  const { error } = await supabase.from("Maintenances").delete().eq("ID", id);

  if (error) {
    throw error;
  }
};
