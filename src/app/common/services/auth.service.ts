import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/users.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user$ = this.userSubject.asObservable();

    // Suscribirse al estado de autenticación de Firebase y obtener los datos del usuario
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection<User>('usuarios').doc(user.uid).valueChanges();
        } else {
          return new Observable<User | null>(observer => observer.next(null));
        }
      })
    ).subscribe(userData => this.userSubject.next(userData));
  }

  async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout(): Promise<void> {
    return await this.afAuth.signOut();
  }

  async resetPassword(email: string): Promise<void> {
    return await this.afAuth.sendPasswordResetEmail(email);
  }

  async loginWithGoogle(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return await this.afAuth.signInWithPopup(provider);
  }

  async loginWithFacebook(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return await this.afAuth.signInWithPopup(provider);
  }

  async register(email: string, password: string, nombre: string, tipo_usuario: string): Promise<void> {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user?.uid;
    if (uid) {
      await this.firestore.collection('usuarios').doc(uid).set({
        id: uid,
        nombre: nombre,
        correo: email,
        tipo_usuario: tipo_usuario,
        fecha_registro: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }
}
