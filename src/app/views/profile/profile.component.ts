import { IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
// profile.component.ts
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
  IonHeader, IonBackButton, IonButtons, IonSpinner, IonSelectOption, IonSelect, IonAvatar, IonMenu, IonMenuToggle, IonSplitPane
} from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../common/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonAvatar, IonSpinner, IonButtons, IonBackButton, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonList, IonCardContent, CommonModule, FormsModule, ReactiveFormsModule, IonSelectOption, IonSelect, IonButton, IonAvatar, IonMenu, IonMenuToggle
  , IonIcon, IonRouterOutlet, IonSplitPane, RouterModule],
})
export class ProfileComponent implements OnInit {
  user: any;
  userType: string = '';
  selectedOption: string;
  // constructor(
    // private authService: AuthService
  // ) {}

  ngOnInit() {
    // this.authService.getUser().subscribe(user => {
    //   this.user = user;
    //   this.userType = user.tipo;
    // });
  }
  constructor() {
    // Inicializa con la primera opción seleccionada
    this.selectedOption = 'dashboard';
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
