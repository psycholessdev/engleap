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
  BelongsToMany,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { NonAttribute } from 'sequelize'
import { Deck } from './deck.model'
import { User } from './user.model'
import { CardTargetWord } from './cardTargetWord.model'
import { Definition } from './definition.model'

@Table
export class Card extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @BelongsTo(() => Deck, 'deckId')
  deck!: NonAttribute<Deck>

  @ForeignKey(() => Deck)
  @Column({ type: DataType.UUID, allowNull: false })
  deckId!: string

  @Column({ type: DataType.TEXT })
  sentence!: string

  @BelongsTo(() => User, 'createdByUserId')
  creator!: NonAttribute<User>

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  createdByUserId!: string

  @HasMany(() => CardTargetWord, 'cardId')
  targetWords!: NonAttribute<CardTargetWord[]>

  @BelongsToMany(() => Definition, {
    through: {
      model: () => CardTargetWord,
      unique: false,
    },
    sourceKey: 'id',
    foreignKey: 'cardId',
    otherKey: 'wordId',
    constraints: false,
  })
  definitions!: NonAttribute<Definition[]>
}
