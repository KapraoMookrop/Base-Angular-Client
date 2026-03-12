import { UserRole, UserStatus } from "./Enum";

export interface UserClientData {
    FullName: string;
    Email: string;
    Phone: string;
    Role: UserRole;
    UserStatus: UserStatus;
    IsEnabled2FA: boolean;
}
