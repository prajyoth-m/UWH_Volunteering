import { Timestamp } from '@firebase/firestore';

export class EventDate {
  date: Timestamp;
  description: string;
  icon: string;
  link: string;

  public get getDate(): Timestamp {
    return this.date;
  }
  public get getDescription(): string {
    return this.description;
  }
  public get getIcon(): string {
    return this.icon;
  }
  public get getLink(): string {
    return this.link;
  }
  public set setLink(value: string) {
    this.link = value;
  }
  public set setIcon(value: string) {
    this.icon = value;
  }
  public set setDescription(value: string) {
    this.description = value;
  }
  public set setDate(value: Timestamp) {
    this.date = value;
  }
}
