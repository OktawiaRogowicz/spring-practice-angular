import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css', '../base.css']
})
export class UserComponent implements OnInit {

  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[] = [];
  public user: User | any;
  public admin: boolean = false;
  public refreshing: boolean = true;
  public selectedUser: User | undefined;
  private subscription: Subscription[] = [];
  public fileName: string = ""; 
  public profileImage!: File; 
  public editUser = new User();
  private currentUsername: string = "";

  length: number = 0;
  pageIndex:number = 0;
  pageSize:number = 3;
  lowValue:number = 0;
  highValue:number = 3;  

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private userService: UserService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
    if(this.user.role == "ROLE_ADMIN")
    this.admin = true;
  }

  getPaginatorData(event: PageEvent): void {
    console.log(event);
    if( event.pageSize != this.pageSize) {
      this.pageSize = event.pageSize;
      this.lowValue = 0;
      this.highValue = event.pageSize;
      this.pageIndex = 0;
    }
    if(event.pageIndex == this.pageIndex + 1){
       this.lowValue = this.lowValue + this.pageSize;
       this.highValue =  this.highValue + this.pageSize;
       this.pageIndex = event.pageIndex;
      }
   else if(event.pageIndex == this.pageIndex - 1){
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
      this.pageIndex = event.pageIndex;
     }   
      console.log(this.lowValue, this.highValue);
}

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscription.push(
      this.userService.getUsers().subscribe(
        (response: User[] | any) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }

  public onProfileImageChange(filename: string, profileImage: File): void {
    this.fileName = filename;
    this.profileImage = profileImage;
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm) {
    const formData = this.userService.createUserFormDate("", userForm.value, this.profileImage);
    this.subscription.push(
      this.userService.addUser(formData).subscribe(
        (response: User | any) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = "";
          this.profileImage = null as any;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS,
            `${response.name} ${response.surname} added successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null as any;
        }
      )
    )
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()) {
      if (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.surname.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            results.push(user);
      }
    }
    this.users = results;
    if( results.length == 0 || !searchTerm ) {
      this.users = this.userService.getUsersFromLocalCache();
    }
  }

  public onEditUser(appUser: User): void {
    this.editUser = appUser;
    this.currentUsername = this.editUser.email;
    this.clickButton('openUserEdit');
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.profileImage);
    this.subscription.push(
      this.userService.updateUser(formData).subscribe(
        (response: User | any) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = "";
          this.profileImage = null as any;
          this.sendNotification(NotificationType.SUCCESS,
            `${response.name} ${response.surname} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null as any;
        }
      )
    )
  }

  public onDeleteUser(userId: number): void {
    this.subscription.push(
      this.userService.deleteUser(userId).subscribe(
        (response: CustomHttpResponse | any) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(true);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }

  public onViewBooks(): void {
    this.router.navigate(['/book/management']);
    console.log("blob going to bookjd");
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, `You've been logged out successfully`);
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAdress = emailForm.value['reset-password-email'];
    this.subscription.push (
      this.userService.resetPassword(emailAdress).subscribe(
        (response: CustomHttpResponse | any) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, errorResponse.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    )
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occured. Please try again'.toUpperCase());
    }
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

}
