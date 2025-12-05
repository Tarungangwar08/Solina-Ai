import mongoose, { Document, Schema } from 'mongoose';

export interface IMessageDoc {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessageDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const ConversationSchema = new Schema<IConversation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [MessageSchema]
}, {
  timestamps: true
});

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;