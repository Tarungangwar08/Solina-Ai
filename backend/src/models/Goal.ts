import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  stressLevel: string;
  progress: number;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['health', 'work', 'personal', 'relationships', 'learning', 'finance', 'other'],
    default: 'personal'
  },
  stressLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'extreme'],
    default: 'low'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  dueDate: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Goal = mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;
