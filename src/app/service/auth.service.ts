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
}
