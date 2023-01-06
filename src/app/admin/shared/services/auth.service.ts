import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {FireBaseAuthResponse, User} from "../../../shared/interfaces";

@Injectable({providedIn: "root"})

export class AuthService {

  public error$: Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) {
  }

  get token(): string | null {
    const expDate = new Date(localStorage.getItem('fb-token-exp') as string)
    if(new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        // @ts-ignore
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный адрес электронный почты')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Адрес электронный почты не найден')
        break
    }

    return throwError(error)
  }

  private setToken(response: FireBaseAuthResponse | null) {
    if(response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }
}
