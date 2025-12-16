import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CognitoService } from '../../services/cognito'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api, GetCardsRequest } from '../../services/api';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: 'profile.html',
  styleUrl: 'profile.css'
})
export class Profile implements OnInit {
  loading: boolean;
  user: any;
  errorMessage: string;
  cards: any[] = [];
  constructor(private cognitoService: CognitoService,
              private cdRef: ChangeDetectorRef,
              private api: Api
  ) {
    this.loading = false;
    this.user = {
                  email: '', 
                  name: '',
                  sub: ''
                };
    this.errorMessage = '';
  }

  public ngOnInit(): void {
    this.loading = true;
    this.cognitoService.getUser()
    .then((authenticatedUser: any) => {
      console.log(authenticatedUser);
      this.user = {
        email: authenticatedUser.email || '',
        name: authenticatedUser.name || '',
        sub: authenticatedUser.sub || ''
      };

      const payload: GetCardsRequest = {
          User_Id: this.user.sub
        };
      this.api.getCards(payload).subscribe({
        next: (res) => {
          console.log('API response:', res);
          this.loading = false;
          this.cards = res;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('API error:', err);
          this.loading = false;
          this.cdRef.detectChanges();
        },
      });
    })
    .catch((error: any) => {
      console.error('Error fetching user data:', error);
      this.errorMessage = "Error In fetching user data. User may not be authenticated yet.";
    })
    .finally(() => {
      this.loading = false; 
      this.cdRef.detectChanges();
    });
  }
  public update(): void {
    this.loading = true;

    this.cognitoService.updateUser(this.user)
    .then((result: boolean) => {
      if(result)
      {
        this.errorMessage = "User's name is updated.";  
      }
      else
      {
        this.errorMessage = "User's name is not updated.";
      }
    })
    .catch((error: any) => {
      console.error('Error updating user data:', error);
      this.errorMessage = "Error In updating user data.";
    })
    .finally(() =>{
      this.loading = false;
      this.cdRef.detectChanges();
    });
  }
}
