import { Injectable } from "@angular/core";
import { AppStateService } from "./AppStateService";
import { UserClientData } from "../types/UserClientData";

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private readonly state: AppStateService) { }

  SetUserClient(token: string, user: UserClientData, userId: string) {
    this.state.token.set(token);
    this.state.userId.set(userId);
    this.state.user.set(user);

    localStorage.setItem('token', token);
  }

  ClearUserClient() {
    this.state.token.set(null);
    this.state.userId.set(null);
    this.state.user.set(null);

    localStorage.removeItem('token');
  }

  UpdateUser(data: Partial<UserClientData>) {
    this.state.user.update(user => ({
      ...user!,
      ...data
    }));
  }
}