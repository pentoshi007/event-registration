import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  image: string;
  category: string;
  organizer: string;
  tags: string[];
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    maxAttendees: { type: Number, required: true },
    currentAttendees: { type: Number, default: 0 },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    organizer: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default model<IEvent>('Event', eventSchema); 