import { Timestamp } from 'firebase/firestore';
import { EventDate } from './event-date';
import { User } from './user';

export class Session {
  id: string;
  name: string;
  sessions: Array<EventDate>;
  users: Array<User>;
}
