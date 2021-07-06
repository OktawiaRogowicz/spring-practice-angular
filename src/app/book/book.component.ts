import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Book } from '../model/book';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { BookService } from '../service/book.service';
import { UserService } from '../service/user.service';
import { User } from '../model/user';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css', '../base.css']
})
export class BookComponent implements OnInit {

  private titleSubject = new BehaviorSubject<string>('Books');
  public titleAction$ = this.titleSubject.asObservable();
  public books: Book[] = [];
  public user!: User;
  public admin: boolean = false;
  public refreshing: boolean = true;
  public selectedBook: Book | undefined;
  private subscription: Subscription[] = [];
  public fileName: string = ""; 
  public profileImage!: File; 
  public editBook = new Book();
  private currentBookTitle: string = "";

  length: number = 0;
  pageIndex:number = 0;
  pageSize:number = 3;
  lowValue:number = 0;
  highValue:number = 3;  

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private bookService: BookService, private userService: UserService, private notificationService: NotificationService,
    translate: TranslateModule) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache() as any;
    this.getBooks(true);
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

  public getBooks(showNotification: boolean): void {
    this.refreshing = true;
    this.subscription.push(
      this.bookService.getBooks().subscribe(
        (response: Book[] | any) => {
          this.bookService.addBooksToLocalCache(response);
          this.books = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} Book(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public onSelectBook(selectedBook: Book): void {
    this.selectedBook = selectedBook;
    this.clickButton('openBookInfo');
  }

  public onProfileImageChange(filename: string, profileImage: File): void {
    this.fileName = filename;
    this.profileImage = profileImage;
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, `You've been logged out successfully`);
    this.user.active = true;
  }

  public saveNewBook(): void {
    this.clickButton('new-book-save');
  }

  public onAddNewBook(BookForm: NgForm) {
    const formData = this.bookService.createBookFormDate(BookForm.value, this.profileImage);
    this.subscription.push(
      this.bookService.addBook(formData).subscribe(
        (response: Book | any) => {
          this.clickButton('new-book-close');
          this.getBooks(false);
          this.fileName = "";
          this.profileImage = null as any;
          BookForm.reset();
          this.sendNotification(NotificationType.SUCCESS,
            `${response.title} added successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null as any;
        }
      )
    )
  }

  public searchBooks(searchTerm: string): void {
    const results: Book[] = [];
    for (const Book of this.bookService.getBooksFromLocalCache()) {
      if (Book.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          Book.author.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          Book.publishingHouse.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          Book.releaseYear.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            results.push(Book);
      }
    }
    this.books = results;
    if( results.length == 0 || !searchTerm ) {
      this.books = this.bookService.getBooksFromLocalCache();
    }
  }

  public onEditBook(appBook: Book): void {
    this.editBook = appBook;
    this.currentBookTitle = this.editBook.title;
    this.clickButton('openBookEdit');
  }

  public onUpdateBook(): void {
    const formData = this.bookService.createBookFormDate(this.editBook, this.profileImage);
    this.subscription.push(
      this.bookService.updateBook(formData).subscribe(
        (response: Book | any) => {
          this.clickButton('closeEditBookModalButton');
          this.getBooks(false);
          this.fileName = "";
          this.profileImage = null as any;
          this.sendNotification(NotificationType.SUCCESS,
            `${response.title} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null as any;
        }
      )
    )
  }

  public onDeleteBook(BookId: number): void {
    this.subscription.push(
      this.bookService.deleteBook(BookId).subscribe(
        (response: CustomHttpResponse | any) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getBooks(true);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }

  public onViewUsers(): void {
    this.router.navigate(['/user/management']);
    console.log("blob going to users1");
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
