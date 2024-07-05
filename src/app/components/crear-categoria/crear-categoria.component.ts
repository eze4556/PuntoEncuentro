
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg } from '@ionic/angular/standalone';
import { CategoryI } from '../../common/models/categoria.model'; // Update this import according to your actual model path
import { FirestoreService } from '../../common/services/firestore.service';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: 'crear-categoria.component.html', // Update the template URL accordingly
  styleUrls: ['crear-categoria.component.scss'], // Update the stylesheet URL accordingly
  standalone: true,
  imports: [IonImg, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
    IonIcon, IonButton, IonButtons, IonSpinner, IonInput, IonCard,
    FormsModule,
    IoniconsModule, CommonModule
  ],
})
export class CrearCategoriaComponent implements OnInit {

  categories: CategoryI[] = [];
  newCategory: CategoryI = this.initCategory();
  cargando: boolean = false;
  showForm: boolean = false;

  constructor(private firestoreService: FirestoreService, private navCtrl: NavController, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.firestoreService.getCollectionChanges<CategoryI>('Categorías').subscribe(data => {
      if (data) {
        this.categories = data;
      }
    });
  }

  initCategory(): CategoryI {
    return {
      id: this.firestoreService.createIdDoc(),
      nombre: '',
      descripcion: ''
    };
  }

  async save() {
    this.cargando = true;
    const categoryId = this.newCategory.id;
    await this.firestoreService.createDocument(this.newCategory, `Categorías/${categoryId}`);
    this.cargando = false;
    this.newCategory = this.initCategory();
    this.showForm = false;
  }

  async delete(category: CategoryI) {
    try {
      this.cargando = true;
      await this.firestoreService.deleteDocumentID('Categorías', category.id);
      this.cargando = false;
    } catch (error) {
      this.cargando = false;
      console.error('Error al eliminar categoría:', error);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  goBack() {
    window.history.back();
  }
}
