import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: AngularFirestore) { }

  // Método para enviar un mensaje, dependiendo del rol del usuario (admin o user)
  sendMessage(message: string, userRole: string): Promise<void> {
  const collectionName = userRole === 'admin' ? 'chats-admin' : 'chats-user';
  const messageObj = {
    text: message,
    timestamp: new Date(),
    userRole: userRole  // Guardamos el rol del usuario en el mensaje
  };

  // Usamos .then() para manejar la respuesta y hacer que la función retorne void
  return this.firestore.collection(collectionName).add(messageObj)
    .then(() => {
      // Aquí podrías hacer algo después de enviar el mensaje si es necesario
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error);
    });
}

  // Método para obtener los mensajes de una colección, dependiendo del rol del usuario
  getMessages(userRole: string): Observable<any[]> {
    const collectionName = userRole === 'admin' ? 'chats-admin' : 'chats-user';  // Dependiendo del rol, tomamos la colección adecuada
  
    return this.firestore
      .collection(collectionName, ref => ref.orderBy('timestamp').limit(20)) // Se pueden agregar más filtros si es necesario
      .valueChanges()
      .pipe(
        catchError(error => {
          console.error('Error al obtener los mensajes:', error);
          return of([]); // Retorna un array vacío si ocurre un error
        })
      );
  }
  
}
