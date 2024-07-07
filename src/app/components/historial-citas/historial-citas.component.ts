import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { Citas } from 'src/app/common/models/cita.model';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/common/services/auth.service'; // Asegúrate de tener un AuthService para obtener el usuario actual
import { User } from 'src/app/common/models/users.models'; // Importa el modelo de usuario
import { Service } from 'src/app/common/models/service.models';

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
  userId: string;
  userType: string;

  constructor(private firestoreService: FirestoreService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.userType = user.tipo_usuario;
        console.log('Usuario actual:', user);
        this.loadAppointments();
      } else {
        console.error('No se pudo obtener el usuario actual.');
      }
    });
  }

  loadAppointments() {
    if (this.userType === 'cliente') {
      this.citas$ = from(this.firestoreService.getAppointmentsByUserId(this.userId)).pipe(
        switchMap(citas => {
          const citasWithServiceNames = citas.map(async cita => {
            const service = await this.firestoreService.getDocumentById<Service>('services', cita.servicio_id).toPromise();
            return {
              ...cita,
              nombreEmpresa: service?.nombreEmpresa || 'Desconocido'
            };
          });
          return from(Promise.all(citasWithServiceNames));
        }),
        catchError(error => {
          console.error('Error cargando citas:', error);
          return of([]);
        })
      );
    } else if (this.userType === 'proveedor') {
      this.firestoreService.getServiceByProviderId(this.userId).subscribe(service => {
        console.log('Servicio encontrado para el proveedor:', service);
        if (service) {
          this.citas$ = from(this.firestoreService.getAppointmentsByService(service.id)).pipe(
            switchMap(citas => {
              console.log('Citas obtenidas para el proveedor:', citas);
              const citasWithUserNames = citas.map(async cita => {
                const user = await this.firestoreService.getDocumentById<User>('users', cita.usuario_id).toPromise();
                // console.log(user.nombre)
                return {
                  ...cita,
                  nombre: user?.nombre || 'Desconocido'
                };
              });
              return from(Promise.all(citasWithUserNames));
            }),
            catchError(error => {
              console.error('Error cargando citas:', error);
              return of([]);
            })
          );
        } else {
          console.error('No se encontró un servicio para este proveedor.');
          this.citas$ = of([]);
        }
      });
    }
  }

  createRange(num: number) {
    return new Array(num);
  }
}
