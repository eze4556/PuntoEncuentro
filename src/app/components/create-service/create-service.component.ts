import { IonicModule } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../common/services/firestore.service';
import { AuthService } from '../../common/services/auth.service';
import { CategoryI } from '../../common/models/categoria.model';
import { User } from 'src/app/common/models/users.models';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa AngularFireStorage
import { finalize } from 'rxjs/operators'; // Importa finalize


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
export class CreateServiceComponent implements OnInit {

  createServiceForm: FormGroup;
  categories: CategoryI[] = [];
  selectedFile: File | null = null;
  imagenUsuario: File | null = null;
  currentUser: User | null = null;  // Añadido

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {
    this.createServiceForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      telefono: ['', Validators.required],
      category: ['', Validators.required],
      sobreNosotros: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      servicio: ['', Validators.required],
      dirreccion: ['', Validators.required],
      imagenUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  loadCategories() {
    this.firestoreService.getCollectionChanges<CategoryI>('Categorías').subscribe(data => {
      if (data) {
        this.categories = data;
      }
    });
  }

  onFileSelected(event: any) {
    this.imagenUsuario = event.target.files[0];
      console.log('Imagen seleccionada:', this.imagenUsuario); // Añadir este log para verificar que se selecciona la imagen correctamente

  }

  async onSubmit() {
    if (this.createServiceForm.valid) {
      console.log('Formulario válido, procesando...');
      if (this.currentUser && this.currentUser.id) {
        // Si hay una imagen seleccionada, súbela a Firebase Storage
        if (this.imagenUsuario) {
          const filePath = `images/${Date.now()}_${this.imagenUsuario.name}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, this.imagenUsuario);

          // Espera a que la imagen se suba y obtén la URL de descarga
          uploadTask.snapshotChanges().pipe(
            finalize(async () => {
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              const serviceData = {
                ...this.createServiceForm.value,
                providerId: this.currentUser.id,
                imageUrl: downloadURL
              };
              console.log('Datos del servicio:', serviceData);
              try {
                await this.firestoreService.createService(serviceData);
                console.log('Servicio creado con éxito');
              } catch (error) {
                console.error('Error al crear el servicio:', error);
              }
            })
          ).subscribe();
        } else {
          const serviceData = {
            ...this.createServiceForm.value,
            providerId: this.currentUser.id,
            imageUrl: ''
          };
          console.log('Datos del servicio:', serviceData);
          try {
            await this.firestoreService.createService(serviceData);
            console.log('Servicio creado con éxito');
          } catch (error) {
            console.error('Error al crear el servicio:', error);
          }
        }
      } else {
        console.error('No se pudo obtener el ID del usuario');
      }
    } else {
      console.error('Formulario inválido');
    }
  }
}

//   async onSubmit() {
//     if (this.createServiceForm.valid) {
//       console.log('Formulario válido, procesando...');
//       if (this.currentUser && this.currentUser.id) {
//         const serviceData = {
//           ...this.createServiceForm.value,
//           providerId: this.currentUser.id,
//           imageUrl: this.imagenUsuario ? URL.createObjectURL(this.imagenUsuario) : ''
//         };
//         console.log('Datos del servicio:', serviceData);
//         try {
//           await this.firestoreService.createService(serviceData);
//           console.log('Servicio creado con éxito');
//         } catch (error) {
//           console.error('Error al crear el servicio:', error);
//         }
//       } else {
//         console.error('No se pudo obtener el ID del usuario');
//       }
//     } else {
//       console.error('Formulario inválido');
//     }
//   }
// }
