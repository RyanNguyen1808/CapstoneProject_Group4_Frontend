import { ChangeDetectorRef, Component } from '@angular/core';
import { IUser, CognitoService } from '../../services/cognito'
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  loading: boolean;
  user: IUser;
  message: string;

  constructor(private router: Router,
              private cognitoService: CognitoService,
              private cdRef: ChangeDetectorRef,) {
    this.loading = false;
    this.user = {} as IUser;
    this.message = "";
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService.signIn(this.user)
    .then((success: boolean) => {
      if(success)
        this.router.navigate(['/profile']);
      else
      {
        this.loading = false;
        this.message = "Check username and password";
        this.cdRef.detectChanges();
      }
    }).catch(() => {
      this.loading = false;
      this.cdRef.detectChanges();
    })
  }
}
