import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    clave: ['', Validators.required],
  });

  loading = false;
  errorMsg = '';

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.sessionService.clear();
    const { usuario, clave } = this.form.getRawValue();

    this.authService.login(usuario, clave).subscribe({
      next: (res) => {
        debugger;
        if (res?.[0]?.idUsuario && res?.[0]?.idUsuario != "0") {
          this.router.navigate(['/contactos']);
        } else {
          this.errorMsg = 'Usuario o contraseña incorrectos';
          this.loading = false;
        }
      },
      error: () => {
        this.errorMsg = 'Error al conectar con el servidor';
        this.loading = false;
      },
    });
  }
}
