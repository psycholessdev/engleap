import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Default,
  NotNull,
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

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => Card)
  cardId!: string

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => Word)
  wordId!: string

  @HasMany(() => CardDefinition, 'cardTargetWordId')
  definitions!: NonAttribute<CardDefinition[]>
}
