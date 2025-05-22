import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  NotNull,
  AllowNull,
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

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => Word)
  wordId!: string

  @Column
  @NotNull
  text!: string

  @Column({ type: DataType.ENUM('dictionary', 'user') })
  source!: string

  @Column
  @AllowNull
  sourceName?: string

  @Column({ type: DataType.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') })
  @AllowNull
  difficulty?: string

  // only show user defs once you’ve vetted them
  // defs from a trusted source don't need to be vetted
  @Column({ type: DataType.BOOLEAN })
  approved!: boolean

  @BelongsTo(() => User, 'createdByUserId')
  user?: NonAttribute<User>

  @Column({ type: DataType.UUID })
  @AllowNull
  @ForeignKey(() => User)
  createdByUserId?: string
}
