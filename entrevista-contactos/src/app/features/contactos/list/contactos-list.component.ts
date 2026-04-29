import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactosService } from '../../../core/services/contactos.service';
import { SessionService } from '../../../core/services/session.service';
import { Contacto } from '../../../core/models/contacto.model';

@Component({
  selector: 'app-contactos-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './contactos-list.component.html',
  styleUrl: './contactos-list.component.scss',
})
export class ContactosListComponent implements OnInit {
  private readonly contactosService = inject(ContactosService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  contactos: Contacto[] = [];
  loading = false;
  errorMsg = '';

  get session() {
    return this.sessionService.get();
  }

  get perfil(): number {
    return this.sessionService.getPerfil() ?? 3;
  }

  get canCreate(): boolean {
    return [1, 2].includes(this.perfil);
  }

  get canEdit(): boolean {
    return [1, 2].includes(this.perfil);
  }

  get canDelete(): boolean {
    return this.perfil === 1;
  }

  ngOnInit(): void {
    this.cargarContactos();
  }

  cargarContactos(): void {
    this.loading = true;
    this.errorMsg = '';
    this.contactosService.listar().subscribe({
      next: (data) => {
        this.contactos = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar los contactos';
        this.loading = false;
      },
    });
  }

  editar(idContacto: string): void {
    this.router.navigate(['/contactos', idContacto, 'editar']);
  }

  eliminar(idContacto: string): void {
    if (!confirm('¿Confirma que desea eliminar este contacto?')) return;

    this.contactosService.eliminar(idContacto).subscribe({
      next: () => this.cargarContactos(),
      error: () => alert('No se pudo eliminar el contacto'),
    });
  }

  logout(): void {
    this.sessionService.clear();
    this.router.navigate(['/login']);
  }
}
