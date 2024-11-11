import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  validationMessage = {
    name:[{type:"required", message:"Por favor introduce tu nombre"}],
    secondName:[{type:"required", message:"Por favor introduce tus apellidos"}],
    phone: [{type:"required", message:"Por favor introduce tu telefono"}],
    email:[
      {type:"required", message:"Por favor introduce tu correo electronico"},
      {type:"pattern", message:"Tu correo esta incompleto. Intenta nuevamente..."}
    ],
    password:[
      {type:"required", message:"Por favor crea tu contraseña"},
      {type:"minlength", message:"Tu contraseña debe de tener minimo 6 caracteres. Intenta nuevamente..."}
 ]
}

ValidationFormUser!:FormGroup
  constructor(
    private nav:NavController,
    private formBuilder:FormBuilder,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.ValidationFormUser=this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required
      ])),
      secondName: new FormControl('', Validators.compose([
        Validators.required
      ])),
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
  GoTologin(){
    this.nav.navigateForward(['login'])
  }
  registerUser(value:any){
    try{
      this.authService.userRegistration(value).then(response=>{
        console.log(response);
        if(response.user){
          response.updateProfile({
            displayName: value.name,
            email: value.email,
            phoneNumber: value.phone
          });
        }

      })
    }catch(erro){
      console.log(erro);

    }
    
  
  }

}
