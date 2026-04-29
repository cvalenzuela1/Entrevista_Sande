import { Injectable } from '@angular/core';
import { Session } from '../models/session.model';

const SESSION_KEY = 'app_session';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private session: Session | null = null;

  constructor() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        this.session = JSON.parse(raw) as Session;
      } catch {
        this.session = null;
      }
    }
  }

  save(session: Session): void {
    this.session = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  get(): Session | null {
    return this.session;
  }

  getToken(): string | null {
    return this.session?.token ?? null;
  }

  getPerfil(): number | null {
    const p = this.session?.perfil;
    if (p === null || p === undefined) return null;
    const n = Number(p);
    return isNaN(n) ? null : n;
  }

  isAuthenticated(): boolean {
    return !!this.session?.token;
  }

  clear(): void {
    this.session = null;
    localStorage.removeItem(SESSION_KEY);
  }
}
