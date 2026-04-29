import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);

  protected abstract readonly baseUrl: string;

  protected get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`);
  }

  protected post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }
}
