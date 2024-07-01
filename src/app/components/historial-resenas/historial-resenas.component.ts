import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { Observable } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { Reviews } from 'src/app/common/models/reviews.model';

@Component({
  selector: 'app-historial-resenas',
  templateUrl: './historial-resenas.component.html',
  styleUrls: ['./historial-resenas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class HistorialResenasComponent implements OnInit {
  resenas$: Observable<Reviews[]>;
  serviceId: string = 'someServiceId'; // Usando un ID de servicio estático como ejemplo

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.loadReviews();
  }

  async loadReviews() {
    try {
      const resenas = await this.firestoreService.getReviewsByService(this.serviceId);
      this.resenas$ = new Observable<Reviews[]>(subscriber => {
        subscriber.next(resenas);
        subscriber.complete();
      });
    } catch (error) {
      console.error('Error cargando reseñas:', error);
    }
  }

  createRange(num: number) {
    return new Array(num);
  }
}
