import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from '../../common/services/firestore.service';
import { Citas } from '../../common/models/cita.model';

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
  serviceSchedule: any = {};

  constructor(private firestoreService: FirestoreService) {
    this.fetchServiceSchedule();
  }

  async fetchServiceSchedule() {
    try {
      console.log('Fetching service schedule...');
      const scheduleDoc = await this.firestoreService.getDocumentById('horarios', 'Xih5U7P3pwfs6JxUo3wD');
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
    console.log(`Checking availability for day: ${dayName}`);
    console.log(`Selected days from schedule:`, this.serviceSchedule.selectedDays);
    console.log(`Normalized selected days:`, selectedDays);
    console.log(`Checking if ${dayName} is in selectedDays: ${dayName in selectedDays}`);
    console.log(`Value of ${dayName} in selectedDays: ${selectedDays[dayName]}`);
    return selectedDays[dayName];
  }

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
    console.log(`Selected date: ${this.selectedDate}`);
    this.fetchAvailableSlots();
  }

  fetchAvailableSlots() {
    const selectedDateObj = new Date(this.selectedDate);
    if (!this.isDayAvailable(selectedDateObj)) {
      this.availableSlots = [];
      console.log('Selected day is not available');
      return;
    }

    const startTime = this.convertToMinutes(this.serviceSchedule.startTime);
    const endTime = this.convertToMinutes(this.serviceSchedule.endTime);
    const [breakStart, breakEnd] = this.convertToTimeRange(this.serviceSchedule.breakTimes);
    console.log(`Service hours: ${this.serviceSchedule.startTime} to ${this.serviceSchedule.endTime}`);
    console.log(`Break times: ${this.serviceSchedule.breakTimes}`);
    console.log(`Converted times: start=${startTime}, end=${endTime}, breakStart=${breakStart}, breakEnd=${breakEnd}`);

    this.availableSlots = [];
    for (let time = startTime; time < endTime; time += 30) {
      if (time >= breakStart && time < breakEnd) continue;
      this.availableSlots.push(this.convertToTimeString(time));
    }
    console.log(`Available slots: ${this.availableSlots.join(', ')}`);
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

  async bookAppointment(slot: string) {
    try {
      const [date] = this.selectedDate.split('T');
      const dateTimeString = `${date}T${slot}:00`;
      const fechaCita = new Date(dateTimeString);

      if (isNaN(fechaCita.getTime())) {
        throw new Error('Fecha inválida');
      }

      const cita: Citas = {
        id: this.firestoreService.createIdDoc(),
        servicio_id: 'servicioId',
        cliente_id: 'user.uid',
        proveedor_id: 'proveedorId',
        fecha_cita: fechaCita,
        estado: 'pendiente',
        notas: ''
      };

      await this.firestoreService.createCita(cita);
      console.log(`Cita reservada para el ${this.selectedDate} a las ${slot}`);
    } catch (error) {
      console.error('Error al reservar la cita:', error);
    }
  }
}
