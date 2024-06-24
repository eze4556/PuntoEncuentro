import { IonHeader, IonToolbar, IonContent, IonButton, IonBackButton, IonChip, IonAvatar, IonIcon, IonLabel, IonButtons, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
// home.page.ts
import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../common/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:true,
  imports: [IonHeader, IonToolbar,IonContent, IonButton,IonBackButton, IonChip,IonAvatar,IonIcon,IonLabel,IonButtons,IonGrid,IonRow,IonCol,]
})
export class HomePage implements OnInit {
  user: any;
  userType: string = '';

  constructor(
    // private authService: AuthService,
     private router: Router) {}

  ngOnInit() {
    // this.authService.getUser().subscribe(user => {
    //   this.user = user;
    //   this.userType = user.tipo;
    // });
  }

  logout() {
    // this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToPerfil() {
    this.router.navigate(['/perfil']);
  }

  navigateToServicios() {
    this.router.navigate(['/homeCliente']);
  }

}
