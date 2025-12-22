import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Api, GetTransactionHistoryRequest } from '../../services/api';

@Component({
  selector: 'app-get-transaction-history',
  imports: [FormsModule, CommonModule],
  templateUrl: './get-transaction-history.html',
  styleUrl: './get-transaction-history.css',
})
export class GetTransactionHistory implements OnInit {
loading: boolean;
  message: string;
  cardId: string;
  transactions: any[] = [];
  constructor(private cdRef: ChangeDetectorRef,
              private api: Api
  ) {
    this.loading = false;
    this.message = '';
    this.cardId = 'xxxx - xxxx - xxxx - xxxx';
  }

  public ngOnInit(): void {
  }

  public getTransactionHistory(): void {
    this.loading = true;
    const payload: GetTransactionHistoryRequest = {
      Card_Id: this.cardId
    };

    this.api.getTransactionHistory(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.transactions = res;
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
