import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat/chat.service'; // Importar el servicio de chat
import {firebase} from 'src/app/firebase-config'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../service/auth.service';
import { UserProfile } from '../interfaces/user-profile';


@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.page.html',
  styleUrls: ['./chat-user.page.scss'],
})
export class ChatUserPage implements OnInit {

  messages: any[] = [];
  newMessage: string = '';
  userRole: string = '';  // El rol es 'user' para los usuarios
  userEmail: string = ''; // Este es el correo electrónico del usuario logueado
  profile: UserProfile | undefined;
  profileName: any;
  profileEmail: any;
  profilePhone: any;
  profileSecondName: any;

  constructor(private database : AngularFirestore,
    private router: Router, private chatService: ChatService,private authservice: AuthService) { firebase.auth().onAuthStateChanged( user=> {
      if (user){
        console.log("Usuario autenticado", user);
        const result = this.database.doc<UserProfile>(`/profile/${this.authservice.getUserUid()}`);
        var userprofile= result.valueChanges();
        userprofile.subscribe( profile =>{
          if (profile){
            console.log("PROFILE", profile);
            this.profileName = profile['name'] || 'nombre no disponible';
            this.profileEmail = profile['email']  || 'email no disponible';
            
          }else{
            console.log("PROFILE", profile);
            this.profileName = "no disponible ";
            this.profileEmail = "no disponible";
          }
        })
        }else{
          console.log('No hay usuario autenticado.');
        }
    })
  } 

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.chatService.getMessages(this.userRole).subscribe(messages => {
      console.log('Mensajes recibidos:', messages); // Verifica que los mensajes tienen 'userRole'
      this.messages = messages;
    });
  }
  
  
  

  sendMessage() { 
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage, this.userRole).then(() => {
        this.newMessage = '';  // Limpiar el campo de texto después de enviar
      });
    }
  }
  
  getMessageColor(message: any): string {
    if (message.userRole === 'admin') {
      return 'admin-message';  // Clases CSS específicas para el admin
    } else {
      return 'user-message';  // Clases CSS específicas para los usuarios
    }
  }  

  goBack() {
    this.router.navigate(['/grupos']);
  }

}
