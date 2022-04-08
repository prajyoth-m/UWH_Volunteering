export class User {
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: number;
  role: string;
  displayName: string;
  id: string;
  photoURL: string;

  constructor(
    id: string,
    displayName: string,
    firstname: string,
    lastname: string,
    email: string,
    phoneNumber: number,
    role: string,
    photoURL: string
  ) {
    this.id = id;
    this.displayName = displayName;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.photoURL = photoURL;
  }
}
