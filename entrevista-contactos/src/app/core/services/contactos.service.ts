import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { SessionService } from './session.service';
import { Contacto, ContactoCreate, ContactoUpdate } from '../models/contacto.model';

type CreatePayload = Omit<ContactoCreate, 'idUsuario' | 'idContacto'>;
type UpdatePayload = Omit<ContactoUpdate, 'idUsuario' | 'idContacto'>;

@Injectable({ providedIn: 'root' })
export class ContactosService extends BaseApiService {
  protected override readonly baseUrl = 'https://sandeonline.cl:2082/taskfocus/maestros/api/Test';

  private readonly sessionService = inject(SessionService);

  private get idUsuario(): string {
    return this.sessionService.get()!.idUsuario;
  }

  listar(): Observable<Contacto[]> {
    return this.get<Contacto[]>(`ListarContactos/${this.idUsuario}`);
  }

  obtener(idContacto: string): Observable<Contacto[]> {
    return this.get<Contacto[]>(`ListaContacto/${this.idUsuario}/${idContacto}`);
  }

  crear(payload: CreatePayload): Observable<unknown> {
    const body: ContactoCreate = { idUsuario: this.idUsuario, idContacto: '0', ...payload };
    return this.post<unknown>('CreaContacto', body);
  }

  actualizar(idContacto: string, payload: UpdatePayload): Observable<unknown> {
    const body: ContactoUpdate = { idUsuario: this.idUsuario, idContacto, ...payload };
    return this.post<unknown>('UpdateContacto', body);
  }

  eliminar(idContacto: string): Observable<unknown> {
    return this.post<unknown>('DeleteContacto', {
      idUsuario: this.idUsuario,
      idContacto,
    });
  }
}
