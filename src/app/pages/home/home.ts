import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../core/BaseComponent';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './home.html',
})
export class Home extends BaseComponent {
  constructor() {
    super();
  }

  
}