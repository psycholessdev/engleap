import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
  NotNull,
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

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => User)
  userId!: string

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => Deck)
  deckId!: string

  @Column
  @CreatedAt
  subscribedAt!: Date
}
