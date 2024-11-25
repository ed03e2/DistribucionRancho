import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
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

  constructor(
    public auth: AngularFireAuth,
    private firestore:AngularFirestore
  ) { }
  
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

  userRegistration(value:any){
    return new Promise<any> ((resolve, reject)=>{
      this.auth.createUserWithEmailAndPassword(value.email, value.password).then(
       (res: any) => {
        const userId = res.user.uid;
        this.firestore.collection('users').doc(userId).set({
          name: value.name,
          secondName: value.secondName,
          email: value.email,
          phone: value.phone, // Guardamos el número de teléfono
          role: 'user'
        }).then(()=> {
          resolve(res)
        }).catch(error => reject(error));
       },
        (error: any) => reject(error)
      );
    });
  }

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
}
