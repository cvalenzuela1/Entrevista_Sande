import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactosService } from '../../../core/services/contactos.service';

@Component({
  selector: 'app-contacto-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto-form.component.html',
  styleUrl: './contacto-form.component.scss',
})
export class ContactoFormComponent implements OnInit {
  private readonly contactosService = inject(ContactosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isEdit = false;
  idContacto = '';
  loading = false;
  saving = false;
  errorMsg = '';

  form = this.fb.nonNullable.group({
    rutContacto: ['', Validators.required],
    nombreContacto: ['', Validators.required],
    abreviacion: [''],
    telefono: [''],
    email: ['', Validators.email],
  });

  ngOnInit(): void {
    this.idContacto = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.idContacto;

    if (this.isEdit) {
      this.form.get('rutContacto')?.disable();
      this.loading = true;

      this.contactosService.obtener(this.idContacto).subscribe({
        next: (res) => {
          if (res?.length) {
            const c = res[0];
            this.form.patchValue({
              rutContacto: c.rutContacto?.trim(),
              nombreContacto: c.nombreContacto?.trim(),
              abreviacion: c.abreviacion?.trim(),
              telefono: c.telefono?.trim(),
              email: c.email?.trim(),
            });
          }
          this.loading = false;
        },
        error: () => {
          this.errorMsg = 'Error al cargar los datos del contacto';
          this.loading = false;
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMsg = '';

    const { rutContacto, ...updateFields } = this.form.getRawValue();

    const op$ = this.isEdit
      ? this.contactosService.actualizar(this.idContacto, updateFields)
      : this.contactosService.crear({ rutContacto, ...updateFields });

    op$.subscribe({
      next: () => this.router.navigate(['/contactos']),
      error: () => {
        this.errorMsg = 'Error al guardar el contacto';
        this.saving = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/contactos']);
  }
}
