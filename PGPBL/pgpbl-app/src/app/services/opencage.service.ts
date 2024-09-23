import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenCageService {
  private apiKey = 'c7cbf7b707e645cda9cc584757ee70b3'; // Ganti dengan API Key-mu
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(private http: HttpClient) {}

  getLocation(query: string): Observable<any> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getReverseGeocode(lat: number, lng: number): Observable<any> {
    const url = `${this.apiUrl}?q=${lat}+${lng}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
