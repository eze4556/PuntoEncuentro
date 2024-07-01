import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {IonRouterOutlet} from '@ionic/angular'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    CommonModule,
    RouterModule
  ],
})
export class DashboardComponent implements OnInit {

  resenasRecientes = [
    { cliente: 'Juan', comentario: 'Muy buen servicio', calificacion: 5 },
    { cliente: 'Ana', comentario: 'Excelente atención', calificacion: 4 }
  ];

  constructor() { }

  ngOnInit() { }

  createRange(num: number) {
    return new Array(num);
  }
}
