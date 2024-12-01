import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import { BehaviorSubject } from 'rxjs';
export interface User{
  role: string | PromiseLike<string>;
  username: string;
  uid: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user!:User;
  recaptchaVerifier: any;
  currentUser:any;
  private userSubject = new BehaviorSubject<firebase.User | null>(null);
  user$ = this.userSubject.asObservable(); // Exponer el observable

  constructor(
    public auth: AngularFireAuth,
    private firestore:AngularFirestore
  ) { 
    this.auth.onAuthStateChanged((user) => {
      this.userSubject.next(user); // Actualizar el sujeto con el usuario actual
    });
  }
  
  loginFireauth(value: any){
    return new Promise<any> ((resolve, reject)=>{
      this.auth.signInWithEmailAndPassword(value.email, value.password).then(
        (res: any) => resolve(res),
        (error: any) => reject(error)
      )
    })
  }
  setUser(user:User){
    return this.user = user;
  }
  getUserUid(): string{
    return this.user.uid
  }
//Conseguir el rol del usuario
  getUserRole(uid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('users')
        .doc(uid)
        .get()
        .subscribe(
          (doc) => {
            if (doc.exists) {
              const data = doc.data() as User; // Forzar el tipo a FirestoreUser
              resolve(data.role); // Accede al campo "role"
            } else {
              reject('No se encontró el usuario');
            }
          },
          (error) => reject(error)
        );
    });
  }
//Usuario registrado
async userRegistration(value: any): Promise<firebase.auth.UserCredential> {
  try {
    const res = await this.auth.createUserWithEmailAndPassword(value.email, value.password);
    const user = res.user;

    if (!user) {
      throw new Error('No se pudo registrar al usuario.');
    }

    // Actualizar el nombre en el perfil de Firebase Authentication
    await user.updateProfile({
      displayName: `${value.name} ${value.secondName}`,
    });

    // Guardar datos adicionales en Firestore
    await this.firestore.collection('users').doc(user.uid).set({
      name: value.name,
      secondName: value.secondName,
      email: value.email,
      phone: value.phone,
      role: 'user',
    });

    console.log('Usuario registrado con éxito.');
    return res; // Devuelve el objeto UserCredential
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    throw error;
  }
}
//Olvidaste la contraseña funcion
  resetPassword(email: string){
    return new Promise<void> ((resolve, reject)=>{
      this.auth.sendPasswordResetEmail(email).then(
        ()=> resolve(),
        (error:any) => reject(error)
      );
    });
  }


//Prueba de autenticacion con el telefono movil (En desarrollo)
loginPhoneauth(phoneNumber: string, appVerifier: firebase.auth.RecaptchaVerifier) {
  return this.auth.signInWithPhoneNumber(phoneNumber, appVerifier);
}

//Actualizar el correo electronico 
updateEmail(newEmail: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const user = this.auth.currentUser;
    if (user) {
      user.then(currentUser => {
        currentUser?.updateEmail(newEmail)
          .then(() => {
            // Actualizar el correo en Firestore
            this.firestore.collection('users').doc(currentUser.uid).update({
              email: newEmail
            });
            resolve();
          })
          .catch(error => reject(error));
      });
    } else {
      reject('No hay usuario autenticado');
    }
  });
}
async getCurrentUsers() {
  const user = await this.auth.currentUser;
  if (!user) throw new Error('No hay un usuario autenticado.');
  return user;
}
async verifyAndUpdateEmail(newEmail: string): Promise<void> {
  const user = await this.getCurrentUsers();
  if (!user) throw new Error('No hay un usuario autenticado.');

  try {
    // Envía un correo de verificación al nuevo email antes de actualizar
    await user.verifyBeforeUpdateEmail(newEmail);
    console.log('Correo de verificación enviado al nuevo email.');
  } catch (error) {
    throw new Error('Error al verificar y actualizar el correo: ' + error!);
  }
}
//Actualizar la contraseña 
updatePassword(newPassword: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const user = this.auth.currentUser;
    if (user) {
      user.then(currentUser => {
        currentUser?.updatePassword(newPassword).then(() => resolve()).catch(error => reject(error));
      });
    } else {
      reject('No hay un usuario autenticado.');
    }
  });
}
async getCurrentUser(){
  const user = await this.auth.currentUser;
  console.log('Usuario actual:', user); // Muestra el usuario actual
  if (user) {
    return {
      uid: user.uid,
      displayName: user.displayName || 'Usuario sin nombre',
      email: user.email || 'Correo no disponible',
    };
  } else {
    throw new Error('No hay un usuario autenticado');
  }
}
//Autenticar nuevamente 
async reauthenticateUser(currentPassword: string): Promise<void> {
  const user = await this.auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No se encontró un usuario autenticado.');
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  try {
    await reauthenticateWithCredential(user, credential);
    console.log('Usuario reautenticado correctamente.');
  } catch (error) {
    console.error('Error al reautenticar al usuario:', error);
    throw error;
  }
}
getUser() {
  return this.auth.currentUser;  // Obtiene el usuario actual
}

}
