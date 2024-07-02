import { IonHeader, IonToolbar, IonContent, IonButton, IonBackButton, IonChip, IonAvatar, IonIcon, IonLabel, IonButtons, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
// home.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:true,
  imports: [IonHeader, CommonModule,IonToolbar,IonContent, IonButton,IonBackButton, IonChip,IonAvatar,IonIcon,IonLabel,IonButtons,IonGrid,IonRow,IonCol,]
})
export class HomePage implements OnInit {
  user: any;
  userType: string = '';

  constructor(
    private authService: AuthService,
     private router: Router) {}

ngOnInit() {
  this.authService.getCurrentUser().subscribe(user => {
    this.user = user;
    if (user) {
      this.userType = user.tipo_usuario;
    } else {
      this.userType = ''; // O cualquier valor por defecto que consideres apropia2
    }
  });
}
   logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  navigateToPerfil() {
    this.router.navigate(['/perfil']);
  }

  navigateToServicios() {
    this.router.navigate(['/homeCliente']);
  }

}
