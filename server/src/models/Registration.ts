import { Schema, model, Document, Types } from 'mongoose';

export interface IRegistration extends Document {
  eventId: Types.ObjectId;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  ticketType: string;
}

const registrationSchema = new Schema<IRegistration>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    attendeePhone: { type: String, required: true },
    registrationDate: { type: String, required: true },
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending' },
    ticketType: { type: String, required: true },
  },
  { timestamps: true }
);

// Create a compound unique index to prevent duplicate registrations
// A user can only register once per event using the same email
registrationSchema.index({ eventId: 1, attendeeEmail: 1 }, { unique: true });

export default model<IRegistration>('Registration', registrationSchema); 