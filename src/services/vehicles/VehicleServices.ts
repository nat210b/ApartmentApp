import type { Vehicle } from "../../schemas/Vehicle";
import { supabase } from "../utils/supabase";

export type CreateVehicleInput = Omit<Vehicle, "ID" | "Created_at" | "Updated_at" | "Owner" | "Room">;
export type UpdateVehicleInput = Partial<Omit<Vehicle, "ID" | "Created_at" | "Updated_at" | "Owner" | "Room">>;

const vehicleSelect = `
  *,
  Owner:Tenants!Vehicles_Owner_ID_fkey(*),
  Room:Rooms!Vehicles_Room_ID_fkey(*)
`;

export const getVehicles = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase
    .from("Vehicles")
    .select(vehicleSelect)
    .order("ID", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const createVehicle = async (vehicle: CreateVehicleInput): Promise<Vehicle> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("Vehicles")
    .insert({
      ...vehicle,
      Created_by: vehicle.Created_by ?? userData.user?.id,
    })
    .select(vehicleSelect)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateVehicle = async (
  id: number,
  vehicle: UpdateVehicleInput,
): Promise<Vehicle> => {
  const { data, error } = await supabase
    .from("Vehicles")
    .update({
      ...vehicle,
      Updated_at: new Date().toISOString(),
    })
    .eq("ID", id)
    .select(vehicleSelect)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  const { error } = await supabase.from("Vehicles").delete().eq("ID", id);

  if (error) {
    throw error;
  }
};
