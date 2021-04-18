import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegistrationService } from '../user-registration.service';

@Component({
  selector: 'app-seach-delete',
  templateUrl: './seach-delete.component.html',
  styleUrls: ['./seach-delete.component.css']
})
export class SeachDeleteComponent implements OnInit {

  users: any;
  email!: string;
  searchForm!: FormGroup;
  
  constructor(private service:UserRegistrationService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setForm();
    let resp = this.service.getUsers();
    resp.subscribe((data)=>this.users=data);
  }

  private setForm(): void {
    this.searchForm = this.formBuilder.group({
      email: [null, Validators.required]
    })
  }

  public getValuesFromForm(){
    this.email = this.searchForm.get("email")?.value;
  }

  public deleteUser(id:number){
    let resp = this.service.deleteUser(id);
    resp.subscribe((data)=>this.users=data);
  }

  public findUserByEmail(){
    this.getValuesFromForm();

    if(this.email == "" || this.email == null) {
      let resp = this.service.getUsers();
      resp.subscribe((data)=>this.users=data);
      return;
    }

    let resp = this.service.getUserByEmail(this.email);
    resp.subscribe((data)=>this.users=data);
  }



}
