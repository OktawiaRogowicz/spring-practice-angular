import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserRegistrationService } from '../user-registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user: User = new User();
  message: any;
  registrationForm!: FormGroup;
  fieldTextType!: boolean;
  repeatFieldTextType!: boolean;

  constructor(private service:UserRegistrationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setForm();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  private setForm(): void {
    this.registrationForm = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    })
  }

  public getValuesFromForm(){
    this.user.name = this.registrationForm.get("name")?.value;
    this.user.surname = this.registrationForm.get("surname")?.value;
    this.user.email = this.registrationForm.get("email")?.value;
    this.user.password = this.registrationForm.get("password")?.value;
  }

  public registerNow(){
    console.log("uhhh i was clicked");
    this.getValuesFromForm();
    console.log(this.user);
    let resp = this.service.register(this.user);
    resp.subscribe((data)=>this.message=data)
  }

}
