import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type AuthUser = {
  userid: number;
  usuario: string;
  idtpusuario?: number;
  idemp?: number;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URI = 'http://localhost:3000/api';

  private _user$ = new BehaviorSubject<AuthUser | null>(null);
  user$ = this._user$.asObservable();
  private bootstrapped = false;
  private bootstrapInFlight: Observable<boolean> | null = null;

  constructor(private http: HttpClient) {}

  get user(): AuthUser | null {
    return this._user$.value;
  }

  isLoggedIn(): boolean {
    return !!this._user$.value;
  }

  bootstrap(): Observable<boolean> {
    if (this.bootstrapped) return of(this.isLoggedIn());
    if (this.bootstrapInFlight) return this.bootstrapInFlight;

    this.bootstrapInFlight = this.http
      .get<{ ok: boolean; user: any }>(`${this.API_URI}/auth/me`, { withCredentials: true })
      .pipe(
        tap((res) => this._user$.next(res?.user ?? null)),
        map(() => true),
        catchError(() => {
          this._user$.next(null);
          return of(false);
        }),
        tap(() => {
          this.bootstrapped = true;
          this.bootstrapInFlight = null;
        })
      );

    return this.bootstrapInFlight;
  }

  login(usuario: string, contrasena: string): Observable<boolean> {
    return this.http
      .post<{ ok: boolean; user: AuthUser }>(
        `${this.API_URI}/auth/login`,
        { usuario, contrasena },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => this._user$.next(res.user)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): Observable<void> {
    return this.http.post(`${this.API_URI}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this._user$.next(null)),
      map(() => void 0),
      catchError(() => {
        this._user$.next(null);
        return of(void 0);
      })
    );
  }
}

