import { Position, Role } from "@/constants/user";

export interface UserPointHistory {
  id: number;
  date: string;
  name: string;
  role: string;
  pointChange: number;
  reason: string;
}

export interface User {
  id: number;
  name: string;
  department: {
    name: string;
    entranceYear: number;
  };
  roles: { role: Role; position: Position; point: number }[];
  profileImageUrl?: string;
  point: {
    total: number;
    histories: UserPointHistory[];
  };
}
