import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface GoalAttributes {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  stressLevel: 'low' | 'medium' | 'high' | 'extreme';
  progress: number;
  dueDate?: Date;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GoalCreationAttributes extends Optional<GoalAttributes, 'id' | 'description' | 'dueDate' | 'progress' | 'completed' | 'createdAt' | 'updatedAt'> {}

class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public description?: string;
  public category!: string;
  public stressLevel!: 'low' | 'medium' | 'high' | 'extreme';
  public progress!: number;
  public dueDate?: Date;
  public completed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Goal.init(
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
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('health', 'work', 'personal', 'relationships', 'learning', 'finance', 'other'),
      defaultValue: 'personal',
    },
    stressLevel: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'extreme'),
      defaultValue: 'low',
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'goals',
    timestamps: true,
  }
);

export default Goal;
