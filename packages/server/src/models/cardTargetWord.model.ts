import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { Card } from './card.model'
import { Word } from './word.model'
import { CardDefinition } from './cardDefinition.model'
import { NonAttribute } from 'sequelize'

// Maps each Card to one of its target Word(s)
// A card with multiple words simply has multiple rows here.

@Table
export class CardTargetWord extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @ForeignKey(() => Card)
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  cardId!: string

  @ForeignKey(() => Word)
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  wordId!: string

  @HasMany(() => CardDefinition, 'cardTargetWordId')
  definitions!: NonAttribute<CardDefinition[]>

  @BelongsTo(() => Word, 'wordId')
  word!: NonAttribute<Word>

  @BelongsTo(() => Card, 'cardId')
  card!: NonAttribute<Card>
}
