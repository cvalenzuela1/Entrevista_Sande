export interface Contacto {
  idContacto: string;
  rutContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface ContactoCreate {
  idUsuario: string;
  idContacto: string;
  rutContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}

export interface ContactoUpdate {
  idUsuario: string;
  idContacto: string;
  nombreContacto: string;
  abreviacion: string;
  telefono: string;
  email: string;
}
