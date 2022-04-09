import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  PhoneAuthCredential,
  signInWithEmailAndPassword,
  signInWithRedirect,
  TwitterAuthProvider,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
} from 'firebase/auth';

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

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

  updateUserPhoneNumber(phoneNumber: PhoneAuthCredential) {
    return updatePhoneNumber(this.auth.currentUser, phoneNumber);
  }

  updateUserProfile(displayNameInput: string, photo: string) {
    return updateProfile(this.auth.currentUser, {
      displayName: displayNameInput,
      photoURL: photo,
    });
  }

  updateUserPassword(password: string) {
    return updatePassword(this.auth.currentUser, password);
  }

  doGoogleLogin() {
    googleProvider.addScope(
      'https://www.googleapis.com/auth/contacts.readonly'
    );
    signInWithRedirect(this.auth, googleProvider);
  }

  doFacebookLogin() {
    facebookProvider.addScope('email');
    signInWithRedirect(this.auth, facebookProvider);
  }

  doTwitterLogin() {
    twitterProvider.addScope('email');
    signInWithRedirect(this.auth, twitterProvider);
  }
}
