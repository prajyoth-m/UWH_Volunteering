/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  accessToken: string;
  auth = getAuth();
  constructor() {}

  getUsers() {
    /* to get data use below
    firebase.getUsers().then((snap) => {
      snap.docChanges().forEach(data=>{
        console.log(data.doc.id);
        console.log(data.doc.data());
      });
    });
    */
    return getDocs(collection(db, 'users'));
  }

  doLogin(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

}
