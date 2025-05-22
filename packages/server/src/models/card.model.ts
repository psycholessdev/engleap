import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  Default,
  NotNull,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { NonAttribute } from 'sequelize'
import { Deck } from './deck.model'
import { User } from './user.model'
import { CardTargetWord } from './cardTargetWord.model'

@Table
export class Card extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @BelongsTo(() => Deck, 'deckId')
  deck!: NonAttribute<Deck>

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => Deck)
  deckId!: string

  @Column({ type: DataType.TEXT })
  sentence!: string

  @BelongsTo(() => User, 'createdByUserId')
  creator!: NonAttribute<User>

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => User)
  createdByUserId!: string

  @HasMany(() => CardTargetWord, 'cardId')
  targetWords!: NonAttribute<CardTargetWord[]>
}
