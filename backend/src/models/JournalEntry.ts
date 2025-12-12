import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface JournalEntryAttributes {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface JournalEntryCreationAttributes extends Optional<JournalEntryAttributes, 'id' | 'mood' | 'tags' | 'createdAt' | 'updatedAt'> {}

class JournalEntry extends Model<JournalEntryAttributes, JournalEntryCreationAttributes> implements JournalEntryAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public content!: string;
  public mood?: string;
  public tags!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JournalEntry.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mood: {
      type: DataTypes.ENUM('amazing', 'good', 'okay', 'bad', 'terrible'),
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'journal_entries',
    timestamps: true,
  }
);

export default JournalEntry;
