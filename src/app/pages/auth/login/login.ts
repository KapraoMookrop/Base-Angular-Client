import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAppService } from '../../../API/UserAppService';
import Swal from 'sweetalert2';
import { UserLoginRequest } from '../../../types/UserLoginRequest';
import { UserSignUpDataRequest } from '../../../types/UserSignUpDataRequest';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreAppService } from '../../../API/CoreAppService';
import { UserClientData } from '../../../types/UserClientData';
import { Verify2FAType } from '../../../types/Enum';
import { LoginResponseData } from '../../../types/LoginResponseData';
import { BaseComponent } from '../../../core/BaseComponent';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './login.html',
})
export class Login extends BaseComponent implements OnInit {
  IsShowPassword: boolean = false;
  IsShowConfirmPassword: boolean = false;
  UserLoginRequest: UserLoginRequest = {} as UserLoginRequest;
  UserSignUpRequest: UserSignUpDataRequest = {} as UserSignUpDataRequest;
  ConfirmPassword?: string;

  constructor(private readonly UserAppService: UserAppService,
    private readonly CoreAppService: CoreAppService,) {
    super();
  }

  ngOnInit() {

  }

  isLogin = true;
  toggle() {
    this.isLogin = !this.isLogin;
  }

  async Login() {
    try {
      let clientLogin = await this.UserAppService.Login(this.UserLoginRequest);

      if (clientLogin.IsEnabled2FA) {

        const result = await this.Swal2FAAlert();

        if (!result.isConfirmed) {
          return;
        }

        clientLogin = await this.CoreAppService.Verify2FA(this.UserLoginRequest.Email, result.value, Verify2FAType.VERIFYLOGIN);
      }

      await this.AfterLogin(clientLogin);

    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เข้าสู่ระบบไม่สำเร็จ', err.error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } 
  }

  step = 1;
  async nextStep() {
    switch (this.step) {
      case 1:
        if (!this.isValidEmail(this.UserSignUpRequest.Email)) {
          this.Swaltoast('รูปแบบอีเมลไม่ถูกต้อง', 'error');
          return;
        }

        if (!this.UserSignUpRequest.Email || !this.UserSignUpRequest.Password || !this.ConfirmPassword) {
          this.Swaltoast('กรุณากรอกข้อมูลให้ครบถ้วนก่อน', 'error');
          return;
        }

        if (this.UserSignUpRequest.Password !== this.ConfirmPassword) {
          this.Swaltoast('รหัสผ่านไม่ตรงกัน', 'error');
          return;
        }

        const passwordValidation = await this.validatePassword(this.UserSignUpRequest.Password);
        if (!passwordValidation.isValid) {
          this.Swaltoast(passwordValidation.details, 'error');
          return;
        }

        const emailExists = await this.checkAlreadyExistsEmail();
        if (emailExists) {
          this.Swaltoast('อีเมลนี้ถูกใช้งานแล้ว', 'error');
          return;
        }

        this.step++;
        break;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  async Signup() {
    try {
      await this.UserAppService.Signup(this.UserSignUpRequest);
      this.SwalSuccess('สมัครสมาชิกสำเร็จ', 'กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ');
      this.isLogin = true;
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('สมัครสมาชิกไม่สำเร็จ', err.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  }

  private async AfterLogin(clientData: LoginResponseData) {
    const ClientUser = {
      FullName: clientData.FullName,
      Email: clientData.Email,
      Phone: clientData.Phone,
      Role: clientData.Role,
      UserStatus: clientData.UserStatus,
      IsEnabled2FA: clientData.IsEnabled2FA
    } as UserClientData;

    this.SwalAlert("เข้าสู่ระบบสำเร็จ", "ยินดีต้อนรับเข้าสู่ระบบ", "success", 1500, false).then(() => {
      this.AuthService.SetUserClient(clientData.JWT, ClientUser, '');
      this.NavigateTo('/home');
    });
  }

  private async checkAlreadyExistsEmail() {
    try {
      const result = await this.UserAppService.CheckAlreadyExistsEmail(this.UserSignUpRequest.Email);
      return result;
    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล',
      });
      return true;
    }
  }

  private async validatePassword(password: string): Promise<{ isValid: boolean; details: string; }> {
    if (password.length < 8) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวพิมพ์ใหญ่ อย่างน้อย 1 ตัว"
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวพิมพ์เล็ก อย่างน้อย 1 ตัว"
      };
    }

    if (!/\d/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวเลข อย่างน้อย 1 ตัว"
      };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยอักขระพิเศษ อย่างน้อย 1 ตัว"
      };
    }

    return {
      isValid: true,
      details: ""
    };
  }
}