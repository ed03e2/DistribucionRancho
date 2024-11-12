import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

export interface User{
  username: string;
  uid: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user!:User;

  constructor(
    public auth: AngularFireAuth
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

  userRegistration(value:any){
    return new Promise<any> ((resolve, reject)=>{
      this.auth.createUserWithEmailAndPassword(value.email, value.password).then(
        (res: any) => resolve(res),
        (error: any) => reject(error)
      )
    })
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
 loginPhoneauth(phoneNumber: string, appVerifier: firebase.auth.RecaptchaVerifier){
   return new Promise<any> ((resolve, reject)=>{
     this.auth.signInWithPhoneNumber(phoneNumber, appVerifier).then(
      (confirmationResult) => {
      resolve(confirmationResult);
    },
    (error: any) => reject(error)
      
     )
   })
  }
}
