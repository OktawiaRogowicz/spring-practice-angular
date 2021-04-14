import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { SeachDeleteComponent } from './seach-delete/seach-delete.component';

const routes: Routes = [
  {path:"register", component:RegistrationComponent},
  {path:"", redirectTo:"register", pathMatch:"full"},
  {path:"search", component:SeachDeleteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
