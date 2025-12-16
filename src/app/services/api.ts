import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // adjust path

export interface AddCardRequest {
  User_Id: string;
  Card_Id: string;
  Amount: number;
}

export interface GetCardsRequest {
  User_Id: string;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private addCard_apiUrl = `${environment.baseURL}/card/add`;
  private getCards_apiUrl = `${environment.baseURL}/card/get`;

  constructor(private http: HttpClient) {}

  addCard(payload: AddCardRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.addCard_apiUrl, payload, { headers });
  }

  getCards(payload: GetCardsRequest): Observable<any> {
    console.log(payload);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.getCards_apiUrl, payload, { headers });
  }
}
