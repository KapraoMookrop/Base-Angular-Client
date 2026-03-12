import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AppStateService } from '../../core/AppStateService';
import { LoadingService } from '../../core/LoadingService';
import { AuthService } from '../../core/AuthService';
import { UserClientData } from '../../types/UserClientData';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [],
  templateUrl: './navber.html',
})
export class Navbar implements OnInit {
  User: UserClientData = {} as UserClientData;

  constructor(public stateService: AppStateService, private loadingService: LoadingService, private authAppService: AuthService) { }

  ngOnInit() {
  }

  getLogoUser() {
    return this.stateService.user()?.FullName.replaceAll("นาย", "").replaceAll("นางสาว", "").replaceAll("นาง", "").charAt(0) || "";
  }
}
