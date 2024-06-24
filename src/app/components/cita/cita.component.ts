import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from '../../common/services/firestore.service';
import { Citas } from '../../common/models/cita.model';  // Asegúrate de importar el modelo de citas

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent {
  selectedDate: string = '';
  availableSlots: string[] = [];

  constructor(private firestoreService: FirestoreService) { }

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
    this.fetchAvailableSlots();
  }

  fetchAvailableSlots() {
    // Aquí deberías implementar la lógica para obtener los horarios disponibles
    // Basado en la fecha seleccionada (this.selectedDate)
    // Por ahora se usan horarios de ejemplo
    this.availableSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'];
  }

  async bookAppointment(slot: string) {
    try {
      // const user = await this.firestoreService.getAuthUser();

      // Convertir slot a formato de 24 horas
      const [time, modifier] = slot.split(' ');
      let [hours, minutes] = time.split(':');
      if (modifier === 'PM' && hours !== '12') {
        hours = String(Number(hours) + 12);
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }
      const slot24 = `${hours}:${minutes}`;

      // Obtener solo la fecha de `this.selectedDate`
      const [date] = this.selectedDate.split('T');

      // Crear fecha completa
      const dateTimeString = `${date}T${slot24}:00`;
      console.log('date:', date);
      console.log('slot24:', slot24);
      console.log('dateTimeString:', dateTimeString);
      const fechaCita = new Date(dateTimeString);
      console.log('fechaCita:', fechaCita);

      // Validar que la fecha sea válida
      if (isNaN(fechaCita.getTime())) {
        throw new Error('Fecha inválida');
      }

      const cita: Citas = {
        id: this.firestoreService.createIdDoc(),
        servicio_id: 'servicioId',  // Reemplaza con el ID del servicio correspondiente
        cliente_id: 'user.uid',
        proveedor_id: 'proveedorId',  // Reemplaza con el ID del proveedor correspondiente
        fecha_cita: fechaCita,
        estado: 'pendiente',  // Estado inicial de la cita
        notas: ''  // Notas adicionales, si las hay
      };
      await this.firestoreService.createCita(cita);
      console.log(`Cita reservada para el ${this.selectedDate} a las ${slot}`);
    } catch (error) {
      console.error('Error al reservar la cita:', error);
    }
  }
}
