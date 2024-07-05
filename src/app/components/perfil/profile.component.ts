// profile.component.ts
import { IonItem, IonButton, IonLabel, IonInput, IonContent, IonGrid, IonRow, IonIcon, IonCol, IonCard, IonCardHeader, IonCardTitle, IonList, IonCardContent, IonToolbar, IonCardSubtitle, IonTitle, IonHeader, IonBackButton, IonButtons, IonSpinner, IonSelectOption, IonSelect, IonAvatar, IonMenu, IonMenuToggle, IonSplitPane, IonRouterOutlet } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';
import { FirestoreService } from '../../common/services/firestore.service';
import { User } from 'src/app/common/models/users.models';
import { Service } from 'src/app/common/models/service.models';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,IonAvatar, IonSpinner, IonButtons, IonBackButton, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonList, IonCardContent, CommonModule, FormsModule, ReactiveFormsModule, IonSelectOption, IonSelect, IonButton, IonAvatar, IonMenu, IonMenuToggle, IonIcon, IonRouterOutlet, IonSplitPane, RouterModule, IoniconsModule
  ],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  service: Service | null = null;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user?.tipo_usuario === 'proveedor') {
        this.loadServiceData(user.id);
      }
    });
  }

  private loadServiceData(providerId: string) {
    this.firestoreService.getServiceByProviderId(providerId).subscribe(service => {
      this.service = service;
    });
  }
}
