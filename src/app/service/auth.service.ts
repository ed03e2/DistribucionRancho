import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
 // loginPhoneauth(value: any){
   // return new Promise<any> ((resolve, reject)=>{
     // this.auth.signInWithPhoneNumber(value.phone, value.password).then(
        //(res: any) => resolve(res),
        //(error: any) => reject(error)
     // )
   // })
  }

