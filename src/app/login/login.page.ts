import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {AuthService} from 'src/app/service/auth.service'
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validationUserMessage ={
    email:[
      {type:"required", message:"Por favor introduce tu correo electronico"},
      {type:"pattern", message:"Tu correo no coincide con el registro. Intenta nuevamente..."}
    ],
    password:[
      {type:"required", message:"Por favor introduce tu contraseña"},
      {type:"minlength", message:"Tu contraseña no es correcta. Intenta nuevamente..."}
    ]
  }
   validationFormUser!: FormGroup;
   constructor(
    public formbuilder:FormBuilder,
    public authservice:AuthService,
    private router:Router,
    private nav: NavController,
    private firestore: AngularFirestore
  ) {
  }

  ngOnInit() {
    this.validationFormUser= this.formbuilder.group({
      email: new FormControl ('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ])),
      password: new FormControl ('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ]))
    })

  }
  LoginUser(value:any) {
    console.log("Datos del usuario:", value);
    try{
      this.authservice.loginFireauth(value).then(resp=>{
        console.log(resp);
        console.log("inicio de sesion exitoso");
        //this.router.navigate(['tabs'])
        this.authservice.setUser({
          username: resp.user.diplayName,
          uid: resp.user.uid,
          role:resp.user.role
        })
        if(resp.user){

          this.authservice.getUserRole(resp.user.uid).then(
            role => {
              if (role === 'admin'){
                console.log('El usuario es administrador');
                this.nav.navigateForward(['tabs']);
              } else{
                console.log('El usuario es normal');
                this.nav.navigateForward(['tabs']);
              }
            },
            error => {
              console.error('Error al obtener el rol del usuario:', error);
            }
          )

          
          const userProfile = this.firestore.collection('profile').doc(resp.user.uid);

          userProfile.get().subscribe(result =>{
            if(result.exists){
              this.nav.navigateForward(['tabs']);
            }else{
              this.firestore.doc(`profile/${this.authservice.getUserUid()}`).set({
                name:resp.user.displayName,
                email: resp.user.email
              })
            }
          })

        }
        
        
      })
    }catch(err){
      console.log(err);
      console.log("inicio de sesion no exitoso");

      
    }
  }
  GoToResetPassword(){
    this.nav.navigateForward(['forgotpassword'])
  }
  GoToResetSingUp(){
    this.nav.navigateForward(['singup'])
  }

}

