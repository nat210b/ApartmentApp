import type { Room } from "./Room";
import type { Tenant } from "./Tenant";

export type Vehicle = {
  ID?: number;
  Created_at?: string;
  Updated_at?: string;
  Brand: string;
  Model: string;
  Year: number;
  Owner_ID: number;
  Room_ID: number;
  Created_by?: string;
  Owner?: Tenant;
  Room?: Room;
};
