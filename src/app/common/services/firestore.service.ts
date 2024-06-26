import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, DocumentData, WithFieldValue, collectionData, docData, getDocs, deleteDoc, DocumentReference, CollectionReference, DocumentSnapshot, QueryDocumentSnapshot, query, where } from '@angular/fire/firestore'; // Importar query y where

import { Observable } from 'rxjs';
const { v4: uuidv4 } = require('uuid');

import { User } from '../models/users.models';
import { Citas } from '../models/cita.model';
import { Reviews } from '../models/reviews.model';

// Convertidor genérico para Firestore
const converter = <T>() => ({
  toFirestore: (data: WithFieldValue<T>) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>) => snapshot.data() as T
});

const docWithConverter = <T>(firestore: Firestore, path: string) =>
  doc(firestore, path).withConverter(converter<T>());

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);

  constructor() { }

  getFirestoreInstance(): Firestore {
    return this.firestore;
  }

  getDocument<T>(enlace: string): Promise<DocumentSnapshot<T>> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return getDoc(document);
  }

  getCollectionChanges<T extends { id?: string }>(path: string): Observable<T[]> {
    const itemCollection = collection(this.firestore, path) as CollectionReference<T>;
    return collectionData(itemCollection, { idField: 'id' }) as Observable<T[]>;
  }

  createDocument<T>(data: T, enlace: string): Promise<void> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return setDoc(document, data);
  }

  async createDocumentWithAutoId<T>(data: T, enlace: string): Promise<void> {
    const itemCollection = collection(this.firestore, enlace) as CollectionReference<T>;
    const newDocRef = doc(itemCollection).withConverter(converter<T>());
    await setDoc(newDocRef, data);
  }

  deleteDocumentID(enlace: string, idDoc: string): Promise<void> {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(document);
  }

  deleteDocFromRef(ref: DocumentReference): Promise<void> {
    return deleteDoc(ref);
  }

  createIdDoc(): string {
    return uuidv4();
  }

  async getAuthUser() {
    return { uid: '05OTLvPNICH5Gs9ZsW0k' };
  }

  async getDocumentById(collectionPath: string, id: string): Promise<DocumentData | undefined> {
    try {
      const docRef = doc(this.firestore, `${collectionPath}/${id}`);
      const docSnapshot = await getDoc(docRef);
      console.log('docSnapshot:', docSnapshot);
      return docSnapshot.exists() ? docSnapshot.data() : undefined;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  async getUserData(userId: string): Promise<User | undefined> {
    try {
      const userDocRef = doc(this.firestore, `Usuarios/${userId}`).withConverter(converter<User>());
      const userDocSnap = await getDoc(userDocRef);
      return userDocSnap.exists() ? userDocSnap.data() : undefined;
    } catch (error) {
      console.error("Error al recuperar los datos del usuario:", error);
      throw error;
    }
  }

  async createCita(data: Citas): Promise<void> {
    const document = docWithConverter<Citas>(this.firestore, `Citas/${data.id}`);
    return setDoc(document, data);
  }

  async getAppointmentsByDate(date: string): Promise<Citas[]> {
    const appointmentsRef = collection(this.firestore, 'Citas') as CollectionReference<Citas>;
    const querySnapshot = await getDocs(appointmentsRef);
    const appointments: Citas[] = [];
    querySnapshot.forEach(doc => {
      const appointment = doc.data();
      if (appointment.fecha_cita.startsWith(date)) {
        appointments.push(appointment);
      }
    });
    return appointments;
  }

  async getAppointmentsByService(serviceId: string): Promise<Citas[]> {
    const appointmentsRef = collection(this.firestore, 'Citas') as CollectionReference<Citas>;
    const querySnapshot = await getDocs(query(appointmentsRef, where('servicio_id', '==', serviceId)));
    const appointments: Citas[] = [];
    querySnapshot.forEach(doc => {
      appointments.push(doc.data());
    });
    return appointments;
  }

  async getReviewsByService(serviceId: string): Promise<Reviews[]> {
    const reviewsRef = collection(this.firestore, 'reviews');
    const querySnapshot = await getDocs(reviewsRef);

    const resenas: Reviews[] = [];
    querySnapshot.forEach(doc => {
      const resena = doc.data() as Reviews;
      if (resena.servicio_id === serviceId) {
        resenas.push(resena);
      }
    });

    return resenas;
  }
}

