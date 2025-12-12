import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IMessageDoc {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
  createdAt: Date;
}

interface ConversationAttributes {
  id: string;
  userId: string;
  title: string;
  messages: IMessageDoc[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id' | 'title' | 'messages' | 'createdAt' | 'updatedAt'> {}

class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> implements ConversationAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public messages!: IMessageDoc[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: 'New Conversation',
    },
    messages: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'conversations',
    timestamps: true,
  }
);

export default Conversation;