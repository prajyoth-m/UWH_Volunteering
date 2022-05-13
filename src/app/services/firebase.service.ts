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
  updateDoc,
  Timestamp,
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
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
} from 'firebase/auth';
import { Event } from '../models/event';
import { Session } from '../models/session';
import { User } from '../models/user';

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
    let payload = {};
    if (photo) {
      payload = {
        displayName: displayNameInput,
        photoURL: photo,
      };
    } else {
      payload = {
        displayName: displayNameInput,
      };
    }
    return updateProfile(this.auth.currentUser, payload);
  }

  updateUserPassword(password: string) {
    return updatePassword(this.auth.currentUser, password);
  }

  updateUserEmail(emailInput: string) {
    return updateEmail(this.auth.currentUser, emailInput);
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
          isVerified: false,
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
    let payload = {};
    if (eventInput.isPhysical) {
      payload = {
        ageGroup: eventInput.ageGroup,
        beneficiaries: eventInput.beneficiaries,
        dates: datesInput,
        description: eventInput.description,
        isCompleted: false,
        isVirtual: eventInput.isVirtual,
        isPhysical: true,
        location: new GeoPoint(
          parseFloat(eventInput.location.lat),
          parseFloat(eventInput.location.long)
        ),
        name: eventInput.name,
        ngoName: eventInput.ngoName,
        photo: eventInput.photo,
        preferredLanguages: eventInput.preferredLanguages,
        sessions: eventInput.sessions,
      };
    } else {
      payload = {
        ageGroup: eventInput.ageGroup,
        beneficiaries: eventInput.beneficiaries,
        dates: datesInput,
        description: eventInput.description,
        isCompleted: false,
        isVirtual: eventInput.isVirtual,
        isPhysical: false,
        name: eventInput.name,
        ngoName: eventInput.ngoName,
        photo: eventInput.photo,
        preferredLanguages: eventInput.preferredLanguages,
        sessions: eventInput.sessions,
      };
    }

    return addDoc(eventsCollection, payload);
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
    return deleteDoc(doc(db, 'users', userID));
  }
  updateUserEvents(eventsIn: Session, userID: string) {
    return this.getUserByID(userID).then(async (snap) => {
      const existingSessions = snap.data().events;
      const finalEvents = new Array();
      //adding all existing events as is
      existingSessions.forEach((session) => {
        if (session.id !== eventsIn.id) {
          const event = {
            id: session.id,
            name: session.name,
            sessions: [...session.sessions],
          };
          finalEvents.push(event);
        }
      });
      //modifying the event passed to the method
      finalEvents.push({
        id: eventsIn.id,
        name: eventsIn.name,
        sessions: [...eventsIn.sessions],
      });
      //preparing the updated sessions in the event
      const eventData = (await this.getEventByID(eventsIn.id)).data();
      //getting existing sessions of the user
      const currUsrEvents = eventData.registeredUsers
        ? eventData.registeredUsers.find((e) => e.id === userID)
          ? eventData.registeredUsers
              .find((e) => e.id === userID)
              .events.find((e) => e.id === eventsIn.id)
          : undefined
        : undefined;
      //modifying the user sessions from the event
      if (currUsrEvents) {
        currUsrEvents.sessions = eventsIn.sessions;
        await updateDoc(doc(db,'events',eventsIn.id),eventData);
      }
      //modifying the user sessions from the user
      return updateDoc(doc(db, 'users', userID), {
        events: finalEvents,
      });
    });
  }
  removeUserEvent(eventID: string, userID: string) {
    return this.getUserByID(userID).then(async (snap) => {
      //getting all the events from the user
      const existingSessions = snap.data().events;
      const finalEvents = new Array();
      //removing the user from the event
      const currEventData = (await this.getEventByID(eventID)).data();
      currEventData.registeredUsers = currEventData.registeredUsers.filter(usr=>usr.id!==userID);
      await updateDoc(doc(db,'events',eventID),currEventData);
      //removing the event from the user
      finalEvents.push(...existingSessions.filter((e) => e.id !== eventID));
      return updateDoc(doc(db, 'users', userID), {
        events: finalEvents,
      });
    });
  }
  updateEvent(eventID: string, modifiedData: Event) {
    const payload = JSON.parse(JSON.stringify(modifiedData));
    payload.dates.forEach((el) => {
      el.date = new Timestamp(el.date.seconds, el.date.nanoseconds);
    });
    payload.location = new GeoPoint(
      payload.location.latitude,
      payload.location.longitude
    );
    payload.registeredUsers.forEach((element) => {
      element.events.forEach((el) => {
        el.sessions.forEach((ele) => {
          ele.date = new Timestamp(ele.date.seconds, ele.date.nanoseconds);
        });
      });
    });
    return updateDoc(doc(db, 'events', eventID), payload);
  }
  updateUserRole(userID: string, roleInput: string) {
    return this.getUserByID(userID).then((snap) => {
      const payload = snap.data();
      payload.role = roleInput;
      return updateDoc(doc(db, 'users', userID), payload);
    });
  }
}
