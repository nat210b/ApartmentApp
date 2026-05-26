import type { Tenant } from "../../schemas/Tenant";
import { supabase } from "../utils/supabase";

export type CreateTenantInput = Omit<Tenant, "ID" | "Created_at" | "Updated_at">;
export type UpdateTenantInput = Partial<Omit<Tenant, "ID" | "Created_at" | "Updated_at">>;

export const getTenants = async (): Promise<Tenant[]> => {
  const { data, error } = await supabase
    .from("Tenants")
    .select("*")
    .order("ID", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const getTenantById = async (id: number): Promise<Tenant> => {
  const { data, error } = await supabase
    .from("Tenants")
    .select("*")
    .eq("ID", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createTenant = async (tenant: CreateTenantInput): Promise<Tenant> => {
  const { data, error } = await supabase
    .from("Tenants")
    .insert(tenant)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateTenant = async (
  id: number,
  tenant: UpdateTenantInput,
): Promise<Tenant> => {
  const { data, error } = await supabase
    .from("Tenants")
    .update({
      ...tenant,
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

export const deleteTenant = async (id: number): Promise<void> => {
  const { error } = await supabase.from("Tenants").delete().eq("ID", id);

  if (error) {
    throw error;
  }
};
