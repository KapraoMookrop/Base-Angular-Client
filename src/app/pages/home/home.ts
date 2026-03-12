import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { AppStateService } from '../../core/AppStateService';
import { LoadingService } from '../../core/LoadingService';
import { CoreAppService } from '../../API/CoreAppService';
import { Verify2FAType } from '../../types/Enum';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './home.html',
})
export class Home {
  constructor(public stateService: AppStateService,
    public loadingService: LoadingService,
    private readonly cdr: ChangeDetectorRef,
    private readonly CoreAppService: CoreAppService) {
  }

  
}