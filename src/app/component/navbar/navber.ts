import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserClientData } from '../../types/UserClientData';
import { BaseComponent } from '../../core/BaseComponent';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [],
  templateUrl: './navber.html',
})
export class Navbar extends BaseComponent implements OnInit {
  User: UserClientData = {} as UserClientData;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  getLogoUser() {
    return this.AppStateService.user()?.FullName.replaceAll("นาย", "").replaceAll("นางสาว", "").replaceAll("นาง", "").charAt(0) || "";
  }
}
