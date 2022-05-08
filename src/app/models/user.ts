import { Badge } from './badge';
import { Event } from './event';
import { Session } from './session';

export class User {
  email: string;
  phoneNumber: number;
  role: string;
  displayName: string;
  name: string;
  id: string;
  photoURL: string;
  badges: Array<Badge>;
  events: Array<Session>;
  rejectionReason: string;
  approved: boolean;
  contributed: boolean;
  contributions: Array<Event>;
  editRole: boolean;
}
