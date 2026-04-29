import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const profileGuard = (allowedProfiles: number[]): CanActivateFn =>
  () => {
    const session = inject(SessionService);
    const router = inject(Router);
    const perfil = session.getPerfil();

    if (perfil !== null && allowedProfiles.includes(perfil)) return true;
    return router.createUrlTree(['/contactos']);
  };
