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
  IonHeader, IonBackButton, IonButtons, IonSpinner, IonSelectOption, IonSelect, IonSegment, IonSegmentButton, IonImg } from '@ionic/angular/standalone';
import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
 standalone: true,
  imports: [IonImg, IonSegmentButton, IonSegment, IonSpinner, IonButtons, IonBackButton,
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
export class LoginComponent   {

  constructor(private router: Router) { }

  // ngOnInit() {}


goToHome() {
  this.router.navigate(['/homeCliente']);
}

goToRegister() {
  this.router.navigate(['/register']);
}

tienda() {
  this.router.navigate(['/PerfilEmpresa']);
}

}
