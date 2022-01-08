import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Auth, authState, signInAnonymously, 
  signOut, User, GoogleAuthProvider,
  signInWithPopup } from '@angular/fire/auth';

// import { auth } from 'firebase/app';
// import { AngularFireAuth } from '@angular/fire/auth';
// import {
//   AngularFirestore,
//   AngularFirestoreDocument
// } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, first, map, tap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class AuthService {

  switchUser(id: any) {
    this.manualUserId = id;
    this.manualUser$=this.afs.doc('users/'+id).valueChanges().pipe(
      tap(u=>this.manualUser = u)
    );
  }
  root: string;
  user$: Observable<any>;
  userId: string;
  manualUser$: Observable<any>;
  manualUserId: string;
  manualUser: any;
  constructor(
    private afAuth: Auth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    this.user$ = authState(this.afAuth).pipe(
      switchMap(user => {
        if (user) {
          this.root = user.uid;
          this.userId = user.uid;
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges().pipe(
            tap()); // this.updateUserData(u)));
        } else {
          return of(null);
        }
      })
    );
  }

  getUser():  Observable<any>{
    if (this.manualUser$) return this.manualUser$
      .pipe(first());
    return this.user$.pipe(first());
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider) {
    const credential = await signInWithPopup(this.afAuth, provider);
    const result = await this.updateUserData(credential.user);
    console.dir(result);
    location.reload();

  }

  public updateUserData({ uid, email, displayName, photoURL, phoneNumber }) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    const date = Date.now();
    const data = {
        uid,
        email,
        displayName,
        photoURL,
        date,
        phoneNumber,
        id: uid
      };

    data.date = date;
    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    location.reload();
  }
}
