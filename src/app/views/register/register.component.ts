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
  IonHeader, IonBackButton, IonButtons, IonSpinner, IonSelectOption, IonSelect, IonAvatar } from '@ionic/angular/standalone';
import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
standalone: true,
  imports: [IonAvatar, IonSpinner, IonButtons, IonBackButton,
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
    IonButton,
    IonAvatar

  ],
})
export class RegisterComponent   {

  registerForm: FormGroup;

constructor(private fb: FormBuilder,private router: Router) {
  this.registerForm = this.fb.group({
    name: ['',],
    lastName: ['', ],
    email: ['', ],
    password: ['', ],
    role: ['cliente', ]
  });
}


async register() {



        this.router.navigate(['/login']);

  }


irAlogin(){this.router.navigate(['/login']);}


}
