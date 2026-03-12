import { UserRole, UserStatus } from "./Enum.js";

export interface SignUpDataRequest {
    FullName: string;
    Email: string;
    Password: string;
    Phone: string;
    Role: UserRole;
    UserStatus: UserStatus;
}
