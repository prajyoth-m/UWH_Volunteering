import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  where,
  collection,
  getDocs,
  query,
  addDoc,
  GeoPoint,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { environment } from './firebaseConfig';
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
import { Event } from '../models/event';

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

const usersCollection = collection(db, 'users');
const eventsCollection = collection(db, 'events');
const badgesCollection = collection(db, 'badges');

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  accessToken: string;
  auth = getAuth();
  constructor() {}

  getUsers() {
    return getDocs(usersCollection);
  }

  getUserByID(userID: string) {
    return getDoc(doc(db, 'users', userID));
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

  getEvents() {
    return getDocs(eventsCollection);
  }

  checkUserExists(emailInput: string) {
    const usersByEmailQuery = query(
      usersCollection,
      where('email', '==', emailInput)
    );
    return getDocs(usersByEmailQuery);
  }

  createNewUser(
    emailInput: string,
    photoURLInput: string,
    docID: string,
    displayNameInput: string,
    phoneNumberInput: string
  ) {
    this.checkUserExists(emailInput).then((snap) => {
      if (snap.empty) {
        setDoc(doc(db, 'users', docID), {
          badges: [],
          email: emailInput,
          displayName: displayNameInput,
          phoneNumber: phoneNumberInput,
          events: [],
          photoURL: photoURLInput,
          registrations: [],
          role: 'volunteer',
        });
      } else {
        throw new Error(
          'The user with email: ' + emailInput + ' already exists!'
        );
      }
    });
  }

  getRole(emailInput: string) {
    const usersByEmailQuery = query(
      usersCollection,
      where('email', '==', emailInput)
    );
    return getDocs(usersByEmailQuery);
  }

  createEvent(eventInput: Event) {
    const datesInput = new Array();
    eventInput.dates.forEach((data) => {
      datesInput.push({
        date: data.date,
        description: data.description,
        icon: data.icon,
        link: data.link,
      });
    });

    return addDoc(eventsCollection, {
      ageGroup: eventInput.ageGroup,
      beneficiaries: eventInput.beneficiaries,
      dates: datesInput,
      description: eventInput.description,
      isCompleted: false,
      isVirtual: eventInput.isVirtual,
      isPhysical: eventInput.isPhysical,
      location: new GeoPoint(
        parseFloat(eventInput.location.lat),
        parseFloat(eventInput.location.long)
      ),
      name: eventInput.name,
      ngoName: eventInput.ngoName,
      photo: eventInput.photo,
      preferredLanguages: eventInput.preferredLanguages,
      sessions: eventInput.sessions,
    });
  }
  deleteEvent(eventID: string) {
    return deleteDoc(doc(db, 'events', eventID));
  }
  getBadgeByID(badgeID: string) {
    return getDoc(doc(db, 'badges', badgeID));
  }
  getEventByID(eventID: string) {
    return getDoc(doc(db, 'events', eventID));
  }
  deleteUser(userID: string) {
    return deleteDoc(doc(db,'users',userID));
  }
}
