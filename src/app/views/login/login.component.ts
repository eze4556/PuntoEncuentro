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
  IonIcon,
  IonTitle,
  IonHeader, IonBackButton, IonButtons,IonSpinner, IonSelectOption, IonSelect, IonSegment, IonSegmentButton, IonImg } from '@ionic/angular/standalone';
import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../common/services/auth.service'
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
 standalone: true,
  imports: [IonImg, IonSegmentButton, IonSegment, IonSpinner, IonButtons, IonBackButton,
    IonHeader,
    IonTitle,
    IonIcon,
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

  email: string;
  password: string;


  constructor( private authService: AuthService,
    private router: Router,
    private alertController: AlertController) { }

  // ngOnInit() {}

async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Password o Email incorrectos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/home']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'credenciales incorrectas',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async loginWithFacebook() {
    try {
      await this.authService.loginWithFacebook();
      this.router.navigate(['/home']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'credenciales incorrectas',
        buttons: ['OK']
      });
      await alert.present();
    }
  }


  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }


goToRegister() {
  this.router.navigate(['/register']);
}

goToHome() {
  this.router.navigate(['/home']);
}

goToPassword() {
  this.router.navigate(['/recuperarPassword']);
}

goToEmail() {
  this.router.navigate(['/recuperarEmail']);
}



}
