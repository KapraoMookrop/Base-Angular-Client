import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreAppService } from '../../../API/CoreAppService';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseComponent } from '../../../core/BaseComponent';

@Component({
  selector: 'app-verify-email',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './verify-email.html',
})
export class VerifyEmail extends BaseComponent {
  constructor(private CoreAppService: CoreAppService) {
    super();
  }

  ngOnInit() {
    this.Route.paramMap.subscribe(params => {
      const token = params.get('verifyToken');
      if (token) {
        this.VerifyEmail(token);
      }
    });
  }

  async VerifyEmail(verifyToken: string) {
    try {
      await this.CoreAppService.VerifyEmail(verifyToken);
      this.SwalAlert('ยืนยันอีเมลสำเร็จ', 'สามารถเข้าสู่ระบบได้เลย ขอบคุณที่ยืนยันอีเมลของคุณกับเรา', 'success').then(() => {
        this.NavigateTo('/login');
      });
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('ยืนยันอีเมลไม่สำเร็จ', err.error?.message || 'เกิดข้อผิดพลาดในการยืนยันอีเมลของคุณ');
    }
  }
}