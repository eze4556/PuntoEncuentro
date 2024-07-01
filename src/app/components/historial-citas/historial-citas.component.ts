import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { Citas } from 'src/app/common/models/cita.model';
import { Observable } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-historial-citas',
  templateUrl: './historial-citas.component.html',
  styleUrls: ['./historial-citas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class HistorialCitasComponent implements OnInit {
  citas$: Observable<Citas[]>;
  serviceId: string = 'servicioId'; // Cambiar por el ID real del servicio

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.loadAppointments();
  }

  async loadAppointments() {
    try {
      const citas = await this.firestoreService.getAppointmentsByService(this.serviceId);
      this.citas$ = new Observable<Citas[]>(subscriber => {
        subscriber.next(citas);
        subscriber.complete();
      });
    } catch (error) {
      console.error('Error cargando citas:', error);
    }
  }
}
