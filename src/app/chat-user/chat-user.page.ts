import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat/chat.service'; // Importar el servicio de chat

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.page.html',
  styleUrls: ['./chat-user.page.scss'],
})
export class ChatUserPage implements OnInit {

  messages: any[] = [];
  newMessage: string = '';
  userRole: string = 'user';  // El rol es 'user' para los usuarios
  userEmail: string = 'bianca@gmail.com'; // Este es el correo electrónico del usuario logueado

  constructor(private router: Router, private chatService: ChatService) { }

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
