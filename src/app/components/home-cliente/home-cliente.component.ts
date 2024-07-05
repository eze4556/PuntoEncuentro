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
  IonHeader, IonBackButton, IonButtons, IonSpinner, IonSelectOption, IonSelect, IonSearchbar, IonAvatar } from '@ionic/angular/standalone';
import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from 'src/app/common/models/service.models';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
 standalone: true,
  imports: [IonAvatar, IonSearchbar, IonSpinner, IonButtons, IonBackButton,
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

export class HomeClienteComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];

  constructor(private router: Router, private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.loadServices();
  }

  async loadServices() {
    this.services = await this.firestoreService.getServices();
    this.filteredServices = this.services; // Initially, all services are shown
  }

  filterServices(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredServices = this.services.filter(service =>
      service.nombreEmpresa.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.category.toLowerCase().includes(searchTerm)
    );
  }

  goToService(serviceId: string) {
    this.router.navigate(['/serviceDetail', serviceId]);
  }
}
