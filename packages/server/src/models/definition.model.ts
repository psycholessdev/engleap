import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { NonAttribute } from 'sequelize'
import { Word } from './word.model'
import { User } from './user.model'

@Table
export class Definition extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @BelongsTo(() => Word, 'wordId')
  word!: NonAttribute<Word>

  @ForeignKey(() => Word)
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  wordId!: string

  @Column({ allowNull: false, type: DataType.TEXT })
  text!: string

  @Column({ allowNull: false })
  partOfSpeech!: string

  @Column({ allowNull: false, type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  labels!: string[]

  // divided into syllables
  // examples: "in-side", "de-sign"
  @Column({ allowNull: false })
  syllabifiedWord!: string

  @Column({ type: DataType.BOOLEAN })
  offensive!: boolean

  @Column({ type: DataType.ENUM('dictionary', 'user') })
  source!: string

  @Column({ allowNull: true })
  sourceName?: string

  @Column({ type: DataType.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'), allowNull: true })
  difficulty?: string

  // only show user defs once you’ve vetted them
  // defs from a trusted source don't need to be vetted
  @Column({ type: DataType.BOOLEAN })
  approved!: boolean

  @BelongsTo(() => User, 'createdByUserId')
  user?: NonAttribute<User>

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true, onDelete: 'SET NULL' })
  createdByUserId?: string
}
