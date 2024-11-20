export interface User {
    uid: string;       // ID único del usuario
    username: string;  // Nombre del usuario
    email: string;     // Correo electrónico
    phone?: string;    // Teléfono (opcional)
    secondName?: string; // Segundo nombre (opcional)
    profileImageUrl?: string; // URL de la imagen de perfil (opcional)
  }