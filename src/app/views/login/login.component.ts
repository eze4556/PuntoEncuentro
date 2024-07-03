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
  IonHeader, IonBackButton, IonButtons, IonSpinner, IonSelectOption, IonSelect, IonSegment, IonSegmentButton, IonImg
} from '@ionic/angular/standalone';
import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/common/models/users.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonImg, IonSegmentButton, IonSegment, IonSpinner, IonButtons, IonBackButton,
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
export class LoginComponent {

  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      const user = await this.firestoreService.getUserByEmail(this.email);
      this.redirectUser(user);
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
      const userCredential = await this.authService.loginWithGoogle();
      const user = await this.firestoreService.getUserByEmail(userCredential.user.email);
      this.redirectUser(user);
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
      const userCredential = await this.authService.loginWithFacebook();
      const user = await this.firestoreService.getUserByEmail(userCredential.user.email);
      this.redirectUser(user);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'credenciales incorrectas',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  redirectUser(user: User) {
    if (user) {
      switch (user.tipo_usuario) {
        case 'cliente':
          this.router.navigate(['/homeCliente']);
          break;
        case 'proveedor':
        case 'admin':
          this.router.navigate(['/perfil']);
          break;
        default:
          this.showAlert('Error', 'Tipo de usuario desconocido');
      }
    } else {
      this.showAlert('Error', 'Usuario no encontrado');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToPassword() {
    this.router.navigate(['/recuperarPassword']);
  }

  goToEmail() {
    this.router.navigate(['/recuperarEmail']);
  }
}
