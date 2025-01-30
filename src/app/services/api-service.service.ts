import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Product, UserRegistration, UserLogin } from '../models';

@Injectable({
  providedIn: 'root'
})
// export class ApiServiceService {
//   baseUrl='https://mini-project-backend-tsse.onrender.com/api/';

//   constructor(private http: HttpClient) { }

//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('access_token');
//     return new HttpHeaders().set('Authorization', `Bearer ${token}`);
//   }

//   register(data: UserRegistration): Observable<any> {
//     return this.http.post(`${this.baseUrl}register/`, data);
//   }

//   login(data: UserLogin): Observable<any> {
//     return this.http.post(`${this.baseUrl}login/`, data);
//   }

//   refreshToken(refresh: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}token/refresh/`, {refresh});
//   }

//   getProducts(): Observable<any> {
//     const headers = this.getAuthHeaders();
//     return this.http.get(`${this.baseUrl}products/`, {headers});
//   }

//   getProduct(id: number): Observable<Product> {
//     const headers = this.getAuthHeaders();
//     return this.http.get<Product>(`${this.baseUrl}products/${id}/`, {headers});
//   }

//   createProduct(data: any): Observable<any> {
//     const headers = this.getAuthHeaders();
//     return this.http.post(`${this.baseUrl}products/`, data, {headers});
//   }

//   updateProduct(id: number, data: Product): Observable<Product> {
//     const headers = this.getAuthHeaders();
//     return this.http.put<Product>(`${this.baseUrl}products/${id}/`, data, {headers});
//   }

//   deleteProduct(id: number): Observable<void> {
//     const headers = this.getAuthHeaders();
//     return this.http.delete<void>(`${this.baseUrl}products/${id}/`, {headers});
//   }
// }

export class ApiServiceService {
  private storageKey = 'products';
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private idKey = 'product_id';

  constructor() { }

  private getProductsFromStorage(): Product[] {
    const products = localStorage.getItem(this.storageKey);
    return products ? JSON.parse(products) : [];
  }

  private saveProductsToStorage(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  private getNextId(): number {
    const currentId = localStorage.getItem(this.idKey);
    const nextId = currentId ? parseInt(currentId, 10) + 1 : 1;
    localStorage.setItem(this.idKey, nextId.toString());
    return nextId;
  }

  getProducts(): Observable<Product[]> {
    const products = this.getProductsFromStorage();
    return of(products);
  }


  getProduct(id: number): Observable<Product> {
    const products = this.getProductsFromStorage();
    const product = products.find(p => p.id === id);
    return of(product as Product);
  }

  createProduct(data: Product): Observable<Product> {
    const products = this.getProductsFromStorage();
    const newProduct = { ...data, id: this.getNextId() };
    products.push(newProduct);
    this.saveProductsToStorage(products);
    return of(newProduct);
  }

  updateProduct(id: number, data: FormData | Product): Observable<Product> {
    const products = this.getProductsFromStorage();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      if (data instanceof FormData) {
        const updatedProduct = { ...products[index], ...this.formDataToObject(data) };
        products[index] = { ...updatedProduct, id };
      } else {
        products[index] = { ...data, id };
      }
      this.saveProductsToStorage(products);
    }
    return of(products[index]);
  }

  deleteProduct(id: number): Observable<void> {
    let products = this.getProductsFromStorage();
    products = products.filter(p => p.id !== id);
    this.saveProductsToStorage(products);
    return of();
  }

  private formDataToObject(formData: FormData): any {
    const obj: any = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  register(data: UserRegistration): Observable<any> {
    localStorage.setItem('user', JSON.stringify(data));
    return of({ message: 'Registration successful' });
  }

  login(data: UserLogin): Observable<any> {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Stored User:', storedUser); 
    console.log('Login Data:', data); 
    if (storedUser.username === data.username && storedUser.password === data.password) {
      localStorage.setItem(this.tokenKey, 'dummy-access-token');
      localStorage.setItem(this.refreshTokenKey, 'dummy-refresh-token');
      return of({ access_token: 'dummy-access-token', refresh_token: 'dummy-refresh-token' });
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  refreshToken(refresh: string): Observable<any> {
    if (refresh === 'dummy-refresh-token') {
      return of({ access_token: 'new-dummy-access-token' });
    } else {
      throw new Error('Invalid refresh token');
    }
  }

  getAuthHeaders(): { Authorization: string } {
    const token = localStorage.getItem(this.tokenKey);
    return { Authorization: `Bearer ${token}` };
  }
}