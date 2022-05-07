import { EventDate } from './event-date';
import { User } from './user';
import { EventLocation } from './event-location';

export class Event {
  id: string;
  ageGroup: string;
  beneficiaries: string;
  dates: Array<EventDate>;
  description: string;
  isVirtual: boolean;
  isPhysical: boolean;
  location: EventLocation;
  name: string;
  ngoName: string;
  preferredLanguages: Array<string>;
  registeredUsers: Array<User>;
  sessions: string;
  photo: string;
  isCompleted: boolean;
  registrationCount: number;
  behindDate: boolean;

  public get getID(): string {
    return this.id;
  }
  public get getAgeGroup(): string {
    return this.ageGroup;
  }
  public get getBeneficiaries(): string {
    return this.beneficiaries;
  }
  public get getDates(): Array<EventDate> {
    return this.dates;
  }
  public get getDescription(): string {
    return this.description;
  }
  public get getIsVirtual(): boolean {
    return this.isVirtual;
  }
  public get getIsPhysical(): boolean {
    return this.isPhysical;
  }
  public get getLocation(): EventLocation {
    return this.location;
  }
  public get getName(): string {
    return this.name;
  }
  public get getNgoName(): string {
    return this.ngoName;
  }
  public get getPreferredLanguages(): Array<string> {
    return this.preferredLanguages;
  }
  public get getRegisteredUsers(): Array<User> {
    return this.registeredUsers;
  }
  public get getSessions(): string {
    return this.sessions;
  }
  public get getPhoto(): string {
    return this.photo;
  }
  public get getIsCompleted(): boolean {
    return this.isCompleted;
  }
  public set setIsCompleted(value: boolean) {
    this.isCompleted = value;
  }

  public set setPhoto(value: string) {
    this.photo = value;
  }
  public set setSessions(value: string) {
    this.sessions = value;
  }
  public set setPreferredLanguages(value: Array<string>) {
    this.preferredLanguages = value;
  }
  public set setRegisteredUsers(value: Array<User>) {
    this.registeredUsers = value;
  }
  public set setNgoName(value: string) {
    this.ngoName = value;
  }
  public set setName(value: string) {
    this.name = value;
  }
  public set setLocation(value: EventLocation) {
    this.location = value;
  }
  public set setIsPhysical(value: boolean) {
    this.isPhysical = value;
  }
  public set setIsVirtual(value: boolean) {
    this.isVirtual = value;
  }
  public set setDescription(value: string) {
    this.description = value;
  }
  public set setDates(value: Array<EventDate>) {
    this.dates = value;
  }
  public set setBeneficiaries(value: string) {
    this.beneficiaries = value;
  }

  public set setID(value: string) {
    this.id = value;
  }

  public set setageGroup(value: string) {
    this.ageGroup = value;
  }
}
