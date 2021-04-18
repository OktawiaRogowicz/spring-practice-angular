import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  constructor(private http:HttpClient) { }

  public register(user: User): Observable<User>{
    return this.http.post<User>(`/users/register`,
    user,
    {responseType: 'text' as 'json'});
  }

  public getUsers(): Observable<Array<User>>{
    return this.http.get<Array<User>>(`/users`);
  }

  public getUserByEmail(email: string): Observable<User>{
    return this.http.get<User>(`/users/${email}`);
  }

  public deleteUser(id: number){
    return this.http.delete(`/users/${id}`);
  }
  
}
