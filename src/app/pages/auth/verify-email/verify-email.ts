import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreAppService } from '../../../API/CoreAppService';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../core/LoadingService';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-verify-email',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './verify-email.html',
})
export class VerifyEmail {
  constructor(public loadingService: LoadingService, private CoreAppService: CoreAppService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const token = params.get('verifyToken');
      if (token) {
        this.VerifyEmail(token);
      }
    });
  }

  async VerifyEmail(verifyToken: string) {
    this.loadingService.show();
    try {
      await this.CoreAppService.VerifyEmail(verifyToken);
      Swal.fire({
        icon: 'success',
        title: 'ยืนยันอีเมลสำเร็จ',
        text: 'สามารถเข้าสู่ระบบได้เลย ขอบคุณที่ยืนยันอีเมลของคุณกับเรา',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/login'])
      });
    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'ยืนยันอีเมลไม่สำเร็จ',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการยืนยันอีเมลของคุณ',
      });
    } finally {
      this.loadingService.hide();
    }
  }
}