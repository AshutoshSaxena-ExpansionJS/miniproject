import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, UserRegistration, UserLogin } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  baseUrl='https://mini-project-backend-tsse.onrender.com/api/';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  register(data: UserRegistration): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, data);
  }

  login(data: UserLogin): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, data);
  }

  refreshToken(refresh: string): Observable<any> {
    return this.http.post(`${this.baseUrl}token/refresh/`, {refresh});
  }

  getProducts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}products/`, {headers});
  }

  getProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}products/${id}/`, {headers});
  }

  createProduct(data: Product): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}products/`, data, {headers});
  }

  updateProduct(id: number, data: Product): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}products/${id}/`, data, {headers});
  }

  deleteProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}products/${id}/`, {headers});
  }
}
