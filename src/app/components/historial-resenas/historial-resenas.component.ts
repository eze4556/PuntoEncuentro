import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { Observable, from } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { Reviews } from 'src/app/common/models/reviews.model';
import { AuthService } from 'src/app/common/services/auth.service';
import { User } from 'src/app/common/models/users.models';

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
  userId: string;
  userType: string;

  constructor(private firestoreService: FirestoreService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.userType = user.tipo_usuario;
        this.loadReviews();
      } else {
        console.error('No se pudo obtener el usuario actual.');
      }
    });
  }

  async loadReviews() {
    try {
      if (this.userType === 'cliente') {
        const resenas = await this.firestoreService.getReviewsByClientId(this.userId);
        this.resenas$ = from([resenas]);
      } else if (this.userType === 'proveedor') {
        const resenas = await this.firestoreService.getReviewsByProviderId(this.userId);
        this.resenas$ = from([resenas]);
      }
    } catch (error) {
      console.error('Error cargando reseñas:', error);
    }
  }

  createRange(num: number) {
    return new Array(num);
  }

  async deleteReview(reviewId: string) {
    try {
      console.log(reviewId);
      await this.firestoreService.deleteReview(reviewId);
      await this.loadReviews(); // Wait for reviews to reload
    } catch (error) {
      console.error('Error eliminando reseña:', error);
    }
  }
}
