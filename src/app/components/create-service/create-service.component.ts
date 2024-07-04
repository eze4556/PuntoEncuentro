import { IonicModule } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../common/services/firestore.service';
import { AuthService } from '../../common/services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreateServiceComponent  implements OnInit {

  createServiceForm: FormGroup;
    selectedFile: File | null = null;
  imagenUsuario: File | null = null;


   constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.createServiceForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      telefono: ['', Validators.required],
      category: ['', Validators.required],
      horarios: ['', Validators.required],
      sobreNosotros: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      servicio: ['', Validators.required],
      dirreccion: ['', Validators.required],
      imagen: ['']
    });
  }

  ngOnInit(): void {}


  onFileSelected(event: any) {
    this.imagenUsuario = event.target.files[0];
      console.log('Imagen seleccionada:', this.imagenUsuario); // Añadir este log para verificar que se selecciona la imagen correctamente

  }

  async onSubmit() {
    if (this.createServiceForm.valid) {
      const currentUser = await this.authService.getCurrentUser().toPromise();
      if (currentUser && currentUser.id) {
        const serviceData = {
          ...this.createServiceForm.value,
          providerId: currentUser.id,
          imagen: this.imagenUsuario ? URL.createObjectURL(this.imagenUsuario) : ''
        };
        await this.firestoreService.createService(serviceData);
      }
    }
  }

  // async onSubmit() {
  //   if (this.createServiceForm.valid) {
  //     const serviceData = {
  //       ...this.createServiceForm.value,
  //       imageUrl: ''
  //     };
  //     await this.firestoreService.createService(serviceData);
  //   }
  // }


}
