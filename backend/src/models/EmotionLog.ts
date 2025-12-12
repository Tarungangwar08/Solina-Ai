import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EmotionLogAttributes {
  id: string;
  userId: string;
  mood: string;
  moodScore: number;
  note?: string;
  createdAt?: Date;
}

interface EmotionLogCreationAttributes extends Optional<EmotionLogAttributes, 'id' | 'note' | 'createdAt'> {}

class EmotionLog extends Model<EmotionLogAttributes, EmotionLogCreationAttributes> implements EmotionLogAttributes {
  public id!: string;
  public userId!: string;
  public mood!: string;
  public moodScore!: number;
  public note?: string;
  public readonly createdAt!: Date;
}

EmotionLog.init(
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
    mood: {
      type: DataTypes.ENUM('amazing', 'good', 'okay', 'bad', 'terrible'),
      allowNull: false,
    },
    moodScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'emotion_logs',
    timestamps: true,
    updatedAt: false,
  }
);

export default EmotionLog;