import { Badge } from './badge';
import { Event } from './event';

export class User {
  email: string;
  phoneNumber: number;
  role: string;
  displayName: string;
  id: string;
  photoURL: string;
  badges: Array<Badge>;
  events: Array<Event>;
}
