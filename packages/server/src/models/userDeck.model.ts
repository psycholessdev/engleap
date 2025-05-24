import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
  CreatedAt,
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
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string

  @ForeignKey(() => Deck)
  @Column({ type: DataType.UUID, allowNull: false })
  deckId!: string

  @CreatedAt
  @Column
  subscribedAt!: Date
}
