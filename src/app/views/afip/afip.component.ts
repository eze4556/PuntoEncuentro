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
  IonHeader, IonBackButton, IonButtons, IonSpinner, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-afip',
  templateUrl: './afip.component.html',
  styleUrls: ['./afip.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonButtons, IonBackButton,
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
    IonButton

  ],
})
export class AfipComponent implements OnInit {
  userId: string;
  afip: any;

  constructor(private firestoreService: FirestoreService) {}

 async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.afip = await this.firestoreService.getAfip(this.userId);
      console.log('Datos de AFIP obtenidos:', this.afip);
    } else {
      console.error('No se encontró userId en localStorage');
    }
  }



}
