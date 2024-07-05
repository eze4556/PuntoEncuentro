import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../common/services/firestore.service';
import { Reviews } from '../../common/models/reviews.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonLabel, IonItemDivider, IonButton, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular/standalone';
import { AuthService } from '../../common/services/auth.service';
import { User } from 'src/app/common/models/users.models';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonTextarea,
  ],
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  reviews: Reviews[] = [];
  paginatedReviews: Reviews[] = [];
  showForm = false;
  reviewForm: FormGroup;
  ratings = [1, 2, 3, 4, 5];
  currentPage = 1;
  reviewsPerPage = 5;
  totalPages = 0;
  currentUser: User | null = null;

  @Input() servicioId: string = ''; // Recibe el servicioId como propiedad del componente

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.reviewForm = this.fb.group({
      calificacion: ['', Validators.required],
      comentario: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchReviews();
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  fetchReviews() {
    this.firestoreService.getCollectionChanges<Reviews>('reviews')
      .subscribe(data => {
        this.reviews = data.filter(review => review.servicio_id === this.servicioId);
        this.totalPages = Math.ceil(this.reviews.length / this.reviewsPerPage);
        this.updatePaginatedReviews();
      });
  }

  updatePaginatedReviews() {
    const start = (this.currentPage - 1) * this.reviewsPerPage;
    const end = start + this.reviewsPerPage;
    this.paginatedReviews = this.reviews.slice(start, end);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async onSubmit() {
    if (this.reviewForm.valid && this.currentUser) {
      const { calificacion, comentario } = this.reviewForm.value;
      const review: Reviews = {
        id: this.firestoreService.createIdDoc(),
        servicio_id: this.servicioId, // Usar el servicioId recibido
        cliente_id: this.currentUser.id, // Asignar el id del usuario autenticado
        calificacion,
        comentario,
        fecha: new Date(), // Asegurar que fecha es un objeto Date
      };

      try {
        await this.firestoreService.createDocumentWithAutoId<Reviews>(review, 'reviews');
        this.fetchReviews();
        this.reviewForm.reset();
        this.showForm = false;
      } catch (error) {
        console.error('Error al crear la reseña:', error);
      }
    } else {
      console.error('Formulario inválido o usuario no autenticado');
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedReviews();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedReviews();
    }
  }
}
