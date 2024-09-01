import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';  // Import Firebase modules
//import 'firebase/compat/auth';  // Import Firebase authentication

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

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

  login(email: string, password: string): Observable<User> {
    return new Observable<User>((observer) => {
      this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.auth.signInWithEmailAndPassword(email, password).then((firebaseUser: firebase.auth.UserCredential) => {
          if (firebaseUser.user) {  // Check if user is not null to avoid TypeScript error
            observer.next({ email, id: firebaseUser.user.uid });  // Send user info to observer
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