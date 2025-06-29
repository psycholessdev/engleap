import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  Unique,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { CardTargetWord } from './cardTargetWord.model'
import { Definition } from './definition.model'
import { NonAttribute } from 'sequelize'

// Which Definition(s) you’ve chosen for each target word on a given Card.
// Chosen definitions will be shown on the top,
// However, all the defs will be shown anyway

@Table
export class CardDefinition extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @BelongsTo(() => CardTargetWord, 'cardTargetWordId')
  cardTargetWord!: NonAttribute<CardTargetWord>

  @ForeignKey(() => CardTargetWord)
  @Unique('cardTargetWord_definition_unique')
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  cardTargetWordId!: string

  @BelongsTo(() => Definition, 'definitionId')
  definition!: NonAttribute<Definition>

  @ForeignKey(() => Definition)
  @Unique('cardTargetWord_definition_unique')
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  definitionId!: string
}
