import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegistrationComponent } from './registration/registration.component';
import { SeachDeleteComponent } from './seach-delete/seach-delete.component';
import { UserComponent } from './user/user.component';
import { TranslateModule } from '@ngx-translate/core';
import { FrontPageComponent } from './front-page/front-page.component';

const routes: Routes = [
  { path: 'index', component: FrontPageComponent,
    children: [
      { path: 'index#introduction', component: FrontPageComponent },
      { path: 'index#conclusion', component: FrontPageComponent },
      { path: 'index#', component: FrontPageComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'book/management', component: BookComponent },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/index', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule, TranslateModule],
  exports: [RouterModule, TranslateModule]
})
export class AppRoutingModule { }
