import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // adjust path
import { CognitoService } from './cognito';

export interface AddCardRequest {
  User_Id: string;
  Card_Id: string;
  Amount: number;
}

export interface GetCardsRequest {
  User_Id: string;
}

export interface GetTransactionHistoryRequest {
  Card_Id: string;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private addCard_apiUrl = `${environment.baseURL}/card/add`;
  private getCards_apiUrl = `${environment.baseURL}/card/get`;
  private getTransactionHistory_apiUrl = `${environment.baseURL}/card/gettransactions`;

  constructor(private http: HttpClient,
              private cognitoService: CognitoService
  ) {}

  addCard(payload: AddCardRequest): Observable<any> {
    const token = this.cognitoService.getIdToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post<any>(this.addCard_apiUrl, payload, { headers });
  }

  getCards(payload: GetCardsRequest): Observable<any> {
    const token = this.cognitoService.getIdToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post<any>(this.getCards_apiUrl, payload, { headers });
  }

  getTransactionHistory(payload: GetTransactionHistoryRequest): Observable<any> {
    const token = this.cognitoService.getIdToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post<any>(this.getTransactionHistory_apiUrl, payload, { headers });
  }
}
