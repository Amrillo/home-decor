import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponsType } from 'src/types/login-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private islogged: boolean = false ;



  constructor(private http: HttpClient) {
    this.islogged = !!localStorage.getItem(this.accessTokenKey);
   }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponsType>{
    
      return this.http.post<DefaultResponseType | LoginResponsType>(environment.api + 'login', { email, password, rememberMe})
  }

  signup(email: string, password: string, passwordRepeat: string): Observable<DefaultResponseType | LoginResponsType>{

    return this.http.post<DefaultResponseType | LoginResponsType>(environment.api + 'signup', { email, password, passwordRepeat})
  }

  logout(): Observable<DefaultResponseType>{
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {refreshToken: tokens.refreshToken})
    }
      throw throwError(()=> 'Can not find token');
   }

  public getIsLoggedIn() {
    return this.islogged;
  }
   public setTokens(accessToken: string, refreshToken: string):void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        this.islogged = true;
        this.isLogged$.next(true);
   }

   public removeTokens():void {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      this.islogged = false;
      this.isLogged$.next(false);
  }

  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
      return {
        accessToken: localStorage.getItem(this.accessTokenKey),
        refreshToken: localStorage.getItem(this.refreshTokenKey),
      }
  }
   get userId(): null | string {
     return localStorage.getItem(this.userIdKey)
   }

  set userId(id: string | null) {
    if(id) {
       localStorage.setItem(this.userIdKey, id);
    } else {
       localStorage.removeItem(this.userIdKey);
    }
  }
}
