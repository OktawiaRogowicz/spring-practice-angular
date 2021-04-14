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
    return this.http.post<User>(`/register`,
    user,
    {responseType: 'text' as 'json'});
  }

  public getUsers(): Observable<Array<User>>{
    return this.http.get<Array<User>>(`/getAllUsers`);
  }

  public getUserByEmail(email: string): Observable<User>{
    return this.http.get<User>(`/findUser/${email}`);
  }

  public deleteUser(id: number){
    return this.http.delete(`/cancel/${id}`);
  }
  
}
