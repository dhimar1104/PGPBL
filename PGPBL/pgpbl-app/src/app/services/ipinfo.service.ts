import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpinfoService {
  private apiUrl = 'https://ipinfo.io?token=f0a54d1fba6658';

  constructor(private http: HttpClient) {}

  getLocation(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
