import { ActivatedRoute, Router } from "@angular/router";
import { LoadingService } from "./LoadingService";
import { AuthService } from "./AuthService";
import { AppStateService } from "./AppStateService";
import { ChangeDetectorRef, inject } from '@angular/core';
import Swal from 'sweetalert2';

export class BaseComponent {
    protected Router = inject(Router);
    protected Route = inject(ActivatedRoute);
    protected LoadingService = inject(LoadingService);
    protected AuthService = inject(AuthService);
    protected AppStateService = inject(AppStateService);
    protected Cdr = inject(ChangeDetectorRef);
    constructor() {
    }

    protected async ShowLoading() {
        this.LoadingService.show();
    }

    protected async HideLoading() {
        this.LoadingService.hide();
    }

    protected async NavigateTo(path: string) {
        await this.Router.navigate([path]);
    }

    protected async SwalAlert(title: string,
        text: string,
        icon: 'success' | 'error' | 'warning' | 'info' | 'question',
        timer: number = 1500,
        isShowConfirmButton: boolean = true,
        isShowCancelButton: boolean = false,
        confirmButtonText: string = 'OK',
        cancelButtonText: string = 'Cancel') {
        return await Swal.fire({
            icon: icon,
            title: title,
            text: text,
            timer: timer,
            showConfirmButton: isShowConfirmButton,
            showCancelButton: isShowCancelButton,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });
    }

    protected async SwalAlertWithImg(title: string,
        html: string,
        imageUrl: string,
        imageWidth: number = 200,
        imageHeight: number = 200,
        isShowConfirmButton: boolean = true,
        isShowCancelButton: boolean = false,
        confirmButtonText: string = 'OK',
        cancelButtonText: string = 'Cancel') {
        return await Swal.fire({
            title: title,
            html: html,
            imageUrl: imageUrl,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            showConfirmButton: isShowConfirmButton,
            showCancelButton: isShowCancelButton,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });
    }

    protected async SwalSuccess(title: string, text: string) {
        await Swal.fire({
            icon: 'success',
            title: title,
            text: text,
        });
    }

    protected async SwalError(title: string, text: string) {
        await Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    }

    protected async Swaltoast(text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question', timer: number = 2000) {
        await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: icon,
            text: text,
            showConfirmButton: false,
            timer: timer
        });
    }

    protected async Swal2FAAlert() {
        return await Swal.fire({
            title: 'ยืนยันตัวตน',
            html: `<div style="text-align:center">
                        <p style="margin-bottom:10px">กรอกรหัส 6 หลักจากแอป Authenticator</p>

                        <div id="otp-container" style="display:flex; gap:10px; justify-content:center;">
                        <input class="otp-input" maxlength="1" />
                        <input class="otp-input" maxlength="1" />
                        <input class="otp-input" maxlength="1" />
                        <input class="otp-input" maxlength="1" />
                        <input class="otp-input" maxlength="1" />
                        <input class="otp-input" maxlength="1" />
                        </div>
                    </div>`,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            focusConfirm: false,

            didOpen: () => {
                const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');

                inputs.forEach((input, index) => {
                    input.style.width = '45px';
                    input.style.height = '55px';
                    input.style.fontSize = '24px';
                    input.style.textAlign = 'center';
                    input.style.border = '1px solid #ddd';
                    input.style.borderRadius = '8px';

                    input.addEventListener('input', () => {
                        if (input.value.length === 1 && index < inputs.length - 1) {
                            inputs[index + 1].focus();
                        }
                    });

                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Backspace' && !input.value && index > 0) {
                            inputs[index - 1].focus();
                        }
                    });
                });

                inputs[0].focus();
            },

            preConfirm: () => {
                const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
                let code = '';

                inputs.forEach(i => code += i.value);

                if (code.length !== 6) {
                    Swal.showValidationMessage('กรุณากรอกรหัส 6 หลัก');
                    return false;
                }

                return code;
            }
        });
    }

    protected async SwalInputAlert(title: string,
        inputType: 'text' | 'email' | 'password' | 'number' | 'tel',
        validationMessage: string,
        inputLabel: string,
        placeholder: string,
        confirmButtonText: string = 'ยืนยัน',
        cancelButtonText: string = 'ยกเลิก') {
        return await Swal.fire({
            title: title,
            input: inputType,
            validationMessage: validationMessage,
            inputLabel: inputLabel,
            inputPlaceholder: placeholder,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });
    }

    protected async SwalConfirmAlert(title: string,
        text: string,
        confirmButtonText: string = 'ยืนยัน',
        cancelButtonText: string = 'ยกเลิก') {
        return await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });
    }

    protected RefreshDetectChanges() {
        this.Cdr.detectChanges();
    }
}