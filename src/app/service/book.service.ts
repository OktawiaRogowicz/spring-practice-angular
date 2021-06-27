import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Book } from '../model/book';
import { CustomHttpResponse } from '../model/custom-http-response';

@Injectable ({providedIn: 'root'})
export class BookService {
    
    private year: string = "";
    private host = environment.apiUrl;

    constructor(private http: HttpClient) {}

    public getBooks(): Observable<Book[] | HttpErrorResponse> {
        return this.http.get<Book[]>(`${this.host}/books/list`);
    }

    public addBook(formData: FormData): Observable<Book[] | HttpErrorResponse> {
        return this.http.post<Book[]>(`${this.host}/books/add`, formData);
    }

    public updateBook(formData: FormData): Observable<Book[] | HttpErrorResponse> {
        return this.http.post<Book[]>(`${this.host}/books/update`, formData);
    }

    public updateBookImage(formData: FormData): Observable<HttpEvent<Book> | HttpErrorResponse> {
        return this.http.post<Book>(`${this.host}/books/updateBookImage`, formData,
        {
            reportProgress: true,
            observe: 'events'
        });
    }

    public deleteBook(BookId: number): Observable<CustomHttpResponse | HttpErrorResponse> {
        return this.http.delete<CustomHttpResponse>(`${this.host}/books/delete/${BookId}`);
    }

    public addBooksToLocalCache(Books: Book[]): void {
        localStorage.setItem('Books', JSON.stringify(Books));
    }

    public getBooksFromLocalCache(): Book[] {
        if (localStorage.getItem('Books')) {
            return JSON.parse(localStorage.getItem('Books') || "");
        }
        return null as any;
    }

    public createBooks(): Book[] {
        if (localStorage.getItem('Books')) {
            return JSON.parse(localStorage.getItem('Books') || "");
        }
        return null as any;
    }

    public createBookFormDate(Book: Book, profileImage: File): FormData {
        const formData = new FormData();
        formData.append('title', Book.title);
        formData.append('author', Book.author);
        formData.append('publishingHouse', Book.publishingHouse);
        formData.append('translator', Book.translator);
        formData.append('releaseYear', Book.releaseYear.toString())
        formData.append('bookImage', profileImage);
        return formData;
    }
}