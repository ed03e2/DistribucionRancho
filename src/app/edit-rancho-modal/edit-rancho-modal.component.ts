import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-rancho-modal',
  templateUrl: './edit-rancho-modal.component.html',
  styleUrls: ['./edit-rancho-modal.component.scss'],
})
export class EditRanchoModalComponent implements OnInit {
  @Input() rancho: any = {}; // Incluye nombre, descripción, y psg
  @Input() ranchoId: string | undefined;
  selectedFile: File | null = null;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveChanges() {
    if (this.ranchoId) {
      if (this.selectedFile) {
        const filePath = `ranchos/${this.ranchoId}_${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.selectedFile);

        uploadTask.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
            this.rancho.imagenUrl = downloadURL;
            await this.updateRanchoData();
          })
        ).subscribe();
      } else {
        this.updateRanchoData();
      }
    }
  }

  private async updateRanchoData() {
    try {
      await this.firestore.collection('ranchos').doc(this.ranchoId).update(this.rancho);
      this.modalController.dismiss(this.rancho); // Cerrar la modal con los datos actualizados
    } catch (error) {
      console.error('Error updating rancho:', error);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
