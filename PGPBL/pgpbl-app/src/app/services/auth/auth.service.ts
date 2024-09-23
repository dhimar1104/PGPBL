import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';  // Import Firebase modules
import { UserRegister } from 'src/app/model/user/UserRegister';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {}

  // Fungsi untuk meregistrasi user menggunakan Firebase Authentication
  register(userRegister: UserRegister): Observable<User> {
    return new Observable<User>((observer) => {
      this.auth.createUserWithEmailAndPassword(userRegister.email, userRegister.password)
        .then((firebaseUser: firebase.auth.UserCredential) => {
          if (firebaseUser.user) {
            observer.next({
              email: userRegister.email,
              id: firebaseUser.user.uid
            });
          } else {
            observer.error({ message: 'User creation failed' });
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);  // Kirim error ke observer jika ada masalah
          observer.complete();
        });
    });
  }

  // Fungsi untuk recover email dengan password reset
  recoverEmailPassword(email: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.auth.sendPasswordResetEmail(email).then(() => {
        observer.next();
        observer.complete();
      }).catch((error) => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  // Fungsi untuk login dengan email dan password
  login(email: string, password: string): Observable<User> {
    return new Observable<User>((observer) => {
      this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.auth.signInWithEmailAndPassword(email, password).then((firebaseUser: firebase.auth.UserCredential) => {
          if (firebaseUser.user) {  // Pastikan user tidak null
            observer.next({ email, id: firebaseUser.user.uid });
          } else {
            observer.error({ message: 'User not found' });
          }
          observer.complete();
        }).catch(error => {
          observer.error(error);
          observer.complete();
        });
      });
    });
  }
}
