import mongoose, { Document, Schema } from 'mongoose';

export interface IEmotionLog extends Document {
  userId: mongoose.Types.ObjectId;
  mood: string;
  moodScore: number;
  note?: string;
  createdAt: Date;
}

const EmotionLogSchema = new Schema<IEmotionLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['amazing', 'good', 'okay', 'bad', 'terrible']
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  note: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

const EmotionLog = mongoose.model<IEmotionLog>('EmotionLog', EmotionLogSchema);

export default EmotionLog;