import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat/chat.service'; // Importar el servicio de chat

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.page.html',
  styleUrls: ['./chat-admin.page.scss'],
})
export class ChatAdminPage implements OnInit {

  messages: any[] = [];
  newMessage: string = '';
  userRole: string = 'admin';  // Asumimos que este valor viene de la autenticación

  constructor(private router: Router, private chatService: ChatService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.chatService.getMessages(this.userRole).subscribe(messages => {
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

  goBack() {
    this.router.navigate(['/grupos']);
  }

  // Función para obtener el color del mensaje basado en el rol
  getMessageColor(message: any): string {
    if (message.userRole === 'admin') {
      return 'admin-message';  // Clases CSS específicas para el admin
    } else {
      return 'user-message';  // Clases CSS específicas para los usuarios
    }
  }
}
