import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Verify2FAType } from '../types/Enum';
import { LoginResponseData } from '../types/LoginResponseData';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CoreAppService {

    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }

    async VerifyEmail(verifyToken: string): Promise<void> {

        const observable = this.http.get<void>(
            `${this.baseUrl}/api/core/VerifyEmail?verifyToken=${verifyToken}`
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async Verify2FA(email: string, token: string, type: Verify2FAType): Promise<LoginResponseData> {
        const observable = this.http.post<LoginResponseData>(
            `${this.baseUrl}/api/core/Verify2FA`,
            { email, token, type }
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async Enable2FA(): Promise<{ qr: string; secret: string; }> {
        const observable = this.http.post<{ qr: string; secret: string; }>(
            `${this.baseUrl}/api/core/Enable2FA`,
            {}
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async Disable2FA(): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/api/core/Disable2FA`,
            {}
        );
        const response = await lastValueFrom(observable);
        return response;
    }
}
