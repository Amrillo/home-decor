import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponsType } from 'src/types/login-response.type';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  signupForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    passwordRepeat: ['',[Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false , [Validators.requiredTrue]],
  })




  constructor(private fb: FormBuilder, private authService: AuthService,  
    private _snackBar: MatSnackBar, private router: Router) { }


  ngOnInit(): void {

  }
    signup():void {  
      if(this.signupForm.valid && this.signupForm.value.email  && this.signupForm.value.password && 
        this.signupForm.value.passwordRepeat) {  
          this.authService.signup(this.signupForm.value.email,this.signupForm.value.password, this.signupForm.value.passwordRepeat)
           .subscribe(  {  
            next: (data: DefaultResponseType | LoginResponsType)=> {  
                let error = null ;
                if((data as DefaultResponseType).error !== undefined) {
                    error = (data as DefaultResponseType).message;
                }
                const loginResponse = data as LoginResponsType;

                if(!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
                  error = "Ошибка регистрации";
                }
                if(error) {
                  this._snackBar.open(error);
                  throw new Error(error);
                }

                // settokens
                this.authService.setTokens(loginResponse.accessToken,loginResponse.refreshToken);
                this.authService.userId = loginResponse.userId ;
                this._snackBar.open('Вы успешно зарегистрировались');
                this.router.navigate(['/']);
            }, 
            error: (errorResponse: HttpErrorResponse)=> {  
              if(errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message)
              } else {
                this._snackBar.open('Ошибка регистрации')
              }
             }
            }
           )
        }
    }
}
