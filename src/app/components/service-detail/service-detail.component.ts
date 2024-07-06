import {
  IonItem,
  IonButton,
  IonLabel,
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonCardContent,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonBackButton,
  IonButtons,
  IonSpinner,
  IonSelectOption,
  IonSelect,
  IonCardSubtitle,
  IonAvatar,
  IonIcon,
} from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../common/services/firestore.service';
import { Service } from 'src/app/common/models/service.models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewsComponent } from '../reviews/reviews.component';
import {User} from '../../common/models/users.models'
import { AuthService } from 'src/app/common/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonAvatar,
    IonCardSubtitle,
    IonSpinner,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonLabel,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonCardContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonSelectOption,
    IonSelect,
    IonButton,
    ReviewsComponent,
  ],
})
export class ServiceDetailComponent implements OnInit {
  service: Service | null = null;
  serviceId: string | null = null;
    horarios: any[] = [];
    sortedHorarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
        private authService: AuthService ,
            private firestore: AngularFirestore


  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.serviceId = params.get('id');
      if (this.serviceId) {
        this.loadService(this.serviceId);
                this.loadHorarios();

      }
    });
  }

  async loadService(serviceId: string) {
    this.service = await this.firestoreService.getDocumentById('services', serviceId) as Service;
  }

   // Función para cargar los horarios del usuario actual
  loadHorarios() {
    // Obtén el usuario actual
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        const userId = user.id;
        // Consulta los horarios para el usuario actual
        this.firestore
          .collection('horarios', (ref) => ref.where('userId', '==', userId))
          .valueChanges({ idField: 'id' })
          .subscribe((horarios: any[]) => {
            this.horarios = horarios;
            this.sortedHorarios = this.sortHorarios(horarios);
            console.log('Horarios cargados:', this.horarios);
          });
      }
    });
  }

  formatHorario(horario: any): string {
    const daysOrder = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    const daysOfWeek = Object.keys(horario.selectedDays)
      .filter((key) => horario.selectedDays[key])
      .sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));
    const daysString = daysOfWeek.join(', ');
    return `${daysString} ${horario.startTime} - ${horario.endTime}`;
  }

  sortHorarios(horarios: any[]): any[] {
    const daysOrder = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    return horarios.sort(
      (a, b) =>
        daysOrder.indexOf(Object.keys(a.selectedDays).find((key) => a.selectedDays[key])) -
        daysOrder.indexOf(Object.keys(b.selectedDays).find((key) => b.selectedDays[key]))
    );
  }

  getGoogleMapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }



  // loadHorarios() {

  //   this.authService.getCurrentUser().subscribe((user) => {
  //     if (user) {
  //       const userId = user.id;

  //       this.firestore.collection('horarios', ref => ref.where('userId', '==', userId))
  //         .valueChanges({ idField: 'id' })
  //         .subscribe((horarios: any[]) => {
  //           this.horarios = horarios;
  //           console.log('Horarios cargados:', this.horarios);
  //         });
  //     }
  //   });
  // }

  // formatHorario(horario: any): string {
  //   let daysOfWeek = Object.keys(horario.selectedDays).filter(key => horario.selectedDays[key]);
  //   let daysString = daysOfWeek.join(', ');
  //   return `${daysString} ${horario.startTime}-${horario.endTime}`;
  // }

  navigateToCita() {
    this.router.navigate(['/cita', this.serviceId]);
  }
}
