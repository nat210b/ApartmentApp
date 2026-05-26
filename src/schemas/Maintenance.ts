import type { Room as RoomSchema } from "./Room";

export type MaintenancePriority = "Low" | "Medium" | "High";
export type MaintenanceStatus = "Open" | "In Progress" | "Closed";

export type Maintenance = {
  ID?: number;
  Created_at?: string;
  Updated_at?: string;
  Room: number;
  Issue: string;
  Priority: MaintenancePriority;
  Status: MaintenanceStatus;
  Description?: string;
  Fixer_By?: string;
  Fixed_Date?: string;
  Create_by?: string;
  Update_by?: string;
  RoomData?: RoomSchema;
};
