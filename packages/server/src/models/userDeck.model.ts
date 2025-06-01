import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
  CreatedAt,
  Unique,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { User } from './user.model'
import { Deck } from './deck.model'

@Table
export class UserDeck extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @ForeignKey(() => User)
  @Unique('user_deck_unique')
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string

  @ForeignKey(() => Deck)
  @Unique('user_deck_unique')
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  deckId!: string

  @CreatedAt
  @Column
  subscribedAt!: Date
}
