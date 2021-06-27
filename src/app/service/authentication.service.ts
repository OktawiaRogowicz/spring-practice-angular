import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable ({ providedIn: 'root' })
export class AuthenticationService {

    public host = environment.apiUrl;
    private token: any;
    private loggedInEmail: any;
    private jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient) {}

    public login(user: User): Observable<HttpResponse<User>> {
        console.log()
        return this.http.post<User>(`${this.host}/users/login`, user, {observe: 'response'});
    }

    public register(user: User): Observable<User> {
        return this.http.post<User>(`${this.host}/users/register`, user);
    }

    public logOut(): void {
        this.token = null;
        this.loggedInEmail = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('users');
    }

    public saveToken(token: string): void {
        this.token = token;
        localStorage.setItem('token', token);
    }

    public addUserToLocalCache(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    public getUserFromLocalCache(): void {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }

    public loadToken(): void {
        this.token = localStorage.getItem('token');
    }

    public getToken(): string {
        return this.token;
    }

    public isLoggedIn(): boolean {
        this.loadToken();
        if(this.token != null && this.token !== '') {
            if(this.jwtHelper.decodeToken(this.token).sub != null || '') {
                if( !this.jwtHelper.isTokenExpired(this.token)) {
                this.loggedInEmail = this.jwtHelper.decodeToken(this.token).sub;
                return true;
                }
            }
        } else {
            this.logOut();
            return false;
        }
        return true;
    }

}