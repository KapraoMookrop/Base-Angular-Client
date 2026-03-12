import { Injectable } from "@angular/core";
import { AppStateService } from "./AppStateService";

@Injectable({ providedIn: 'root' })
export class LoadingService {

  constructor(private state: AppStateService) {}

  show() {
    this.state.isLoading.set(true);
  }

  hide() {
    this.state.isLoading.set(false);
  }
}