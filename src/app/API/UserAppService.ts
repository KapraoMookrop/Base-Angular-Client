import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserLoginRequest } from '../types/UserLoginRequest';
import { UserSignUpDataRequest } from '../types/UserSignUpDataRequest';
import { LoginResponseData } from '../types/LoginResponseData';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserAppService {

    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }
    async Login(request: UserLoginRequest): Promise<LoginResponseData> {

        const observable = this.http.post<LoginResponseData>(
            `${this.baseUrl}/users/Login`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async Signup(request: UserSignUpDataRequest): Promise<void> {

        const observable = this.http.post<void>(
            `${this.baseUrl}/users/SignUp`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }
}
