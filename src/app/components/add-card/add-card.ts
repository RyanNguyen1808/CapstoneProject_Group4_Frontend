import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CognitoService } from '../../services/cognito'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddCardRequest, Api } from '../../services/api';

@Component({
  selector: 'app-add-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-card.html',
  styleUrl: './add-card.css',
})
export class AddCard implements OnInit {
  loading: boolean;
  user: any;
  message: string;
  amount: number;
  cardId: string;
  constructor(private cognitoService: CognitoService,
              private cdRef: ChangeDetectorRef,
              private api: Api
  ) {
    this.loading = false;
    this.user = {
                  email: '', 
                  name: '', 
                };
    this.message = '';
    this.amount = 0.0;
    this.cardId = 'xxxx - xxxx - xxxx - xxxx';
  }

  public ngOnInit(): void {
    this.loading = true;
    this.cognitoService.getUser()
    .then((authenticatedUser: any) => {
      
      this.user = {
        email: authenticatedUser.email || '',
        name: authenticatedUser.name || '',
        sub: authenticatedUser.sub|| ''
      };
    })
    .catch((error: any) => {
      console.error('Error fetching user data:', error);
      this.message = "Error In fetching user data. User may not be authenticated yet.";
    })
    .finally(() => {
      this.loading = false; 
      this.cdRef.detectChanges();
    });
  }

  public addCard(): void {
    this.loading = true;
    const payload: AddCardRequest = {
      User_Id: this.user.sub,
      Card_Id: this.cardId,
      Amount: this.amount,
    };

    this.api.addCard(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message + " Request Id: " + res.sqs_message_id;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });
  }
}
