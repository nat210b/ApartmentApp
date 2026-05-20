export type Room = {
  ID?: number;
  Number: string;
  Type: string;
  Rental_Fee: string;
  Status: "Available" | "Occupied" | "Reserved" | "Maintenance";
  Updated_at?: string;
  Tenant_ID?: number;
  Created_by?: string;
  Created_at?: string;
  Description?: string;
  Quota?: number;
  Floor: number;
  Building?: string;
};
