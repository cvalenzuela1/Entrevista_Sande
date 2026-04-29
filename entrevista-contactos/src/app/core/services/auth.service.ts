import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { SessionService } from './session.service';
import { UsuarioApi } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {
  protected override readonly baseUrl = 'https://sandeonline.cl:2082/taskfocus/maestros/api/Test';

  private readonly sessionService = inject(SessionService);

  login(usuario: string, clave: string): Observable<UsuarioApi[]> {
    return this.post<UsuarioApi[]>('Login', { usuario, clave }).pipe(
      tap((response) => {
        const user = response?.[0];
        if (!user?.idUsuario) return;

        const token = crypto.randomUUID();
        this.sessionService.save({
          token,
          idUsuario: user.idUsuario,
          nombre: user.nombre,
          apellido: user.apellido,
          perfil: parseInt(user.perfil, 10),
        });
      })
    );
  }

  logout(): void {
    this.sessionService.clear();
  }
}
