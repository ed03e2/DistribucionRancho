import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {AuthService} from 'src/app/service/auth.service'

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
    public authservice:AuthService
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
        
        
      })
    }catch(err){
      console.log(err);
      console.log("inicio de sesion no exitoso");

      
    }
    // Aquí puedes añadir la lógica para autenticar al usuario
  }

}

