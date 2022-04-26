import { Timestamp } from 'firebase/firestore';
import { EventDate } from './event-date';

export class Session {
  id: string;
  name: string;
  sessions: Array<EventDate>;
}
