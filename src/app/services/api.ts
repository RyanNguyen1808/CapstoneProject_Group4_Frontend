import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddCardRequest {
  User_Id: string;
  Card_Id: string;
  Amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = '/api/card/add';

  constructor(private http: HttpClient) {}

  addCard(payload: AddCardRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
}
