import { IonButtons, IonBackButton, IonHeader, IonTitle, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonSelectOption, IonSelect, IonButton, IonAvatar, IonRouterOutlet, IonCardSubtitle, IonDatetime } from '@ionic/angular/standalone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../common/services/firestore.service';
import { Citas } from '../../common/models/cita.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [IonButtons, IonBackButton, IonHeader, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonSelectOption, IonSelect, IonButton, IonRouterOutlet, IonTitle, IonAvatar, IonCardSubtitle, IonDatetime, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent {
  selectedDate: string = '';
  selectedSlot: string = '';
  availableSlots: string[] = [];
  serviceSchedule: any = {};
  existingAppointments: Citas[] = [];

  constructor(private firestoreService: FirestoreService) {
    this.fetchServiceSchedule();
  }

  async fetchServiceSchedule() {
    try {
      console.log('Fetching service schedule...');
      const scheduleDoc = await this.firestoreService.getDocumentById('horarios', 'i4cl9Q0yW8s7xeoIrV5s');
      console.log('scheduleDoc:', scheduleDoc);
      if (scheduleDoc) {
        console.log('Schedule document exists.');
        this.serviceSchedule = scheduleDoc;
        console.log('Service schedule data:', this.serviceSchedule);
        this.initializeCalendar();
      } else {
        console.error('No se encontró el horario para el servicio.');
      }
    } catch (error) {
      console.error('Error al obtener el horario del servicio:', error);
    }
  }

  initializeCalendar() {
    const datePicker = document.querySelector('ion-datetime');
    if (datePicker) {
      datePicker.addEventListener('ionRender', () => {
        const days = Array.from(datePicker.shadowRoot.querySelectorAll('.calendar-day'));
        days.forEach(day => {
          const date = day.getAttribute('data-day');
          if (date && !this.isDayAvailable(new Date(date))) {
            day.classList.add('unavailable-day');
          }
        });
      });
    }
  }

  isDayAvailable(date: Date): boolean {
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    const selectedDays: { [key: string]: boolean } = Object.keys(this.serviceSchedule.selectedDays).reduce((acc: { [key: string]: boolean }, key: string) => {
      acc[key.toLowerCase()] = this.serviceSchedule.selectedDays[key];
      return acc;
    }, {});
    return selectedDays[dayName];
  }

  async onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
    await this.fetchExistingAppointments();
    this.fetchAvailableSlots();
  }

  async fetchExistingAppointments() {
    try {
      const appointments = await this.firestoreService.getAppointmentsByDate(this.selectedDate.split('T')[0]);
      this.existingAppointments = appointments;
    } catch (error) {
      console.error('Error fetching existing appointments:', error);
    }
  }

  fetchAvailableSlots() {
    const selectedDateObj = new Date(this.selectedDate);
    if (!this.isDayAvailable(selectedDateObj)) {
      this.availableSlots = [];
      return;
    }

    const startTime = this.convertToMinutes(this.serviceSchedule.startTime);
    const endTime = this.convertToMinutes(this.serviceSchedule.endTime);
    const [breakStart, breakEnd] = this.convertToTimeRange(this.serviceSchedule.breakTimes);

    this.availableSlots = [];
    for (let time = startTime; time < endTime; time += 30) {
      if (time >= breakStart && time < breakEnd) continue;
      const slot = this.convertToTimeString(time);
      if (!this.isSlotBooked(slot)) {
        this.availableSlots.push(slot);
      }
    }
  }

  isSlotBooked(slot: string): boolean {
    const slotDateStr = `${this.selectedDate.split('T')[0]}T${slot}:00`;
    return this.existingAppointments.some(appointment => appointment.fecha_cita === slotDateStr);
  }

  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  convertToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${this.padNumber(hours)}:${this.padNumber(mins)}`;
  }

  convertToTimeRange(timeRange: string): [number, number] {
    const [start, end] = timeRange.split('-').map(time => this.convertToMinutes(time));
    return [start, end];
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  async confirmAppointment() {
    try {
      const [date] = this.selectedDate.split('T');
      const dateTimeString = `${date}T${this.selectedSlot}:00`;

      const cita: Citas = {
        id: this.firestoreService.createIdDoc(),
        servicio_id: 'servicioId',
        cliente_id: 'user.uid',
        proveedor_id: 'proveedorId',
        fecha_cita: dateTimeString,
        estado: 'pendiente',
        notas: ''
      };

      await this.firestoreService.createCita(cita);
      console.log(`Cita reservada para el ${this.selectedDate} a las ${this.selectedSlot}`);
    } catch (error) {
      console.error('Error al reservar la cita:', error);
    }
  }
}

