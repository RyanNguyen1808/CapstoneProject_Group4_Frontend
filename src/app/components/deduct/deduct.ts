import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Api, TopupDeductRequest } from '../../services/api';

@Component({
  selector: 'app-deduct',
  imports: [FormsModule, CommonModule],
  templateUrl: './deduct.html',
  styleUrl: './deduct.css',
})
export class Deduct implements OnInit {
loading: boolean;
  message: string;
  cardId: string;
  amount: number;
  constructor(private cdRef: ChangeDetectorRef,
              private api: Api
  ) {
    this.loading = false;
    this.message = '';
    this.cardId = 'xxxx - xxxx - xxxx - xxxx';
    this.amount = 0;
  }

  public ngOnInit(): void {
  }

  public deduct(): void {
    this.loading = true;
    const payload: TopupDeductRequest = {
      Card_Id: this.cardId,
      Amount: this.amount
    };

    this.api.deduct(payload).subscribe({
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
