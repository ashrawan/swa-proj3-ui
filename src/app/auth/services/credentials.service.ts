import { Injectable } from '@angular/core';
import { JwtTokenPayload } from '../auth.model';

export interface Credentials {
  username: string;
  token: string;
  jwtTokenPayload?: JwtTokenPayload
}

const STORAGE_CREDENTIALS_KEY = 'credentials';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  private _credentials: Credentials | null = null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(STORAGE_CREDENTIALS_KEY) || localStorage.getItem(STORAGE_CREDENTIALS_KEY);
    if (savedCredentials) {
      // TODO parse token
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCredentials();
  }


  getCredentials(): Credentials | null {
    return this._credentials;
  }


  setCredentials(credentials?: Credentials | null, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(STORAGE_CREDENTIALS_KEY, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(STORAGE_CREDENTIALS_KEY);
      localStorage.removeItem(STORAGE_CREDENTIALS_KEY);
    }
  }
}