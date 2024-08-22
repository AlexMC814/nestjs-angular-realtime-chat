import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Test {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  getTest() {
    return this.http.get<Test>('api');
  }
}
