import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CognitoService } from '../../services/cognito'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  constructor(private cognitoService: CognitoService,
              private cdRef: ChangeDetectorRef
  ) {
    this.loading = false;
    this.user = {
                  email: '', 
                  name: '', 
                };
    this.errorMessage = '';
  }

  public ngOnInit(): void {
    this.loading = true;
    this.cognitoService.getUser()
    .then((authenticatedUser: any) => {
      
      this.user = {
        email: authenticatedUser.email || '',
        name: authenticatedUser.name || ''
      };
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
