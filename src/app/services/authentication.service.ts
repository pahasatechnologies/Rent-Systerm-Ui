import { environment } from './../../environments/environment';
import { User } from './../models/user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap, switchMap} from 'rxjs/operators';

// Setup headers
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
  public currentUser = new BehaviorSubject<User>(null);
  public userEmitter = this.currentUser.asObservable();

  private readonly apiUrl = environment.apiUrl;
  private registerUrl = this.apiUrl + '/auth/register';
  private loginUrl = this.apiUrl + '/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router) { }

  onRegister(user: User): Observable<User> {

    const request = JSON.stringify(
     user
    );

    return this.http.post(this.registerUrl, request, httpOptions)
      .pipe(
        map((response: User) => {
          // Receive jwt token in the response
          const token: string = response['access_token'];
          // If we have a token, proceed
          if (token) {
            this.setToken(token);
            this.getUser().subscribe();
          }
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  onLogin(user: User): Observable<User> {

    const request = JSON.stringify(
      { email: user.email, password: user.password }
    );

    return this.http.post(this.loginUrl, request, httpOptions)
      .pipe(
        map((response: User) => {
          // Receive jwt token in the response
          const token: string = response['access_token'];
          // If we have a token, proceed
          if (token) {
            this.setToken(token);
            this.getUser().subscribe();
          }
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  onLogout(): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/logout', httpOptions).pipe(
      tap(
        () => {
          localStorage.removeItem('token');
          this.userEmitChange(null);
          this.router.navigate(['/']);
        }
      )
    );
  }

  setToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getUser(): Observable<User> {
    if(!this.getToken()) {
      return of(null);
    }
    return this.http.get(this.apiUrl + '/profile/me').pipe(
      tap(
        (user: User) => {
          // this.currentUser = user;
          this.userEmitChange(user);
        }
      )
    );
  }

  isAuthenticated(): boolean {
    // get the token
    const token: string = this.getToken();
    if (token) {
      return true;
    }
    return false;
  }

  private userEmitChange(usr: User) {
    console.log("00000",usr);
    this.currentUser.next(usr);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side error.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend error.
      return throwError(error);
    }
    // return a custom error message
    return throwError('Ohps something wrong happen here; please try again later.');
  }
}
