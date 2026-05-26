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

  const vehicleWithCreator = {
    ...vehicle,
    Created_by: vehicle.Created_by ?? userData.user?.id,
  };
  const { data, error } = await supabase
    .from("Vehicles")
    .insert(vehicleWithCreator)
    .select(vehicleSelect)
    .single();

  if (error) {
    if (error.code === "PGRST204" && error.message.includes("Created_by")) {
      const { Created_by: _createdBy, ...vehicleWithoutCreator } = vehicleWithCreator;
      const retryResult = await supabase
        .from("Vehicles")
        .insert(vehicleWithoutCreator)
        .select(vehicleSelect)
        .single();

      if (retryResult.error) {
        throw retryResult.error;
      }

      return retryResult.data;
    }

    throw error;
  }

  return data;
};

export const updateVehicle = async (
  id: number,
  vehicle: UpdateVehicleInput,
): Promise<Vehicle> => {
  const { Created_by: _createdBy, ...vehicleInput } = vehicle;
  const { data, error } = await supabase
    .from("Vehicles")
    .update({
      ...vehicleInput,
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
