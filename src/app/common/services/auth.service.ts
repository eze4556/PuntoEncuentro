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

  // async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
  //   return await this.afAuth.signInWithEmailAndPassword(email, password);
  //    await this.updateUserLocation(credential.user);
  //   return credential;
  // }


 async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
    await this.updateUserLocation(credential.user);
    return credential;
  }


  async logout(): Promise<void> {
    return await this.afAuth.signOut();
  }



 async loginWithGoogle(): Promise<firebase.auth.UserCredential> {
  const provider = new firebase.auth.GoogleAuthProvider();
  const credential = await this.afAuth.signInWithPopup(provider);
  await this.updateUserData(credential.user);

    await this.updateUserLocation(credential.user);


  return credential;
}

async loginWithFacebook(): Promise<firebase.auth.UserCredential> {
  const provider = new firebase.auth.FacebookAuthProvider();
  const credential = await this.afAuth.signInWithPopup(provider);
  await this.updateUserData(credential.user);

      await this.updateUserLocation(credential.user);

  return credential;
}


private async updateUserLocation(user: firebase.User | null): Promise<void> {
    if (user) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const userRef = this.firestore.collection('usuarios').doc(user.uid);
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          };
          await userRef.update({ location });
        }, (error) => {
          console.error('Error obtaining location', error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }
  }

private async updateUserData(user: firebase.User | null): Promise<void> {
  if (user) {
    const userRef = this.firestore.collection('usuarios').doc(user.uid);
    const userDoc = await userRef.get().toPromise();

    if (!userDoc.exists) {
      const data: User = {
        id: user.uid,
        nombre: user.displayName || 'Sin Nombre',
        correo: user.email || 'Sin Correo',
        tipo_usuario: 'cliente',
        fecha_registro: firebase.firestore.FieldValue.serverTimestamp() as any
      };
      console.log('Setting new user data:', data);
      await userRef.set(data);
    }
  }
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
      await this.updateUserLocation(userCredential.user);

    }
  }


  async resetPassword(email: string): Promise<void> {
  return await this.afAuth.sendPasswordResetEmail(email);
}


  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

}
