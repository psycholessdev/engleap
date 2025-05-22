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
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { NonAttribute } from 'sequelize'
import { User } from './user.model'

@Table
export class Deck extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @Column
  title!: string

  @Column({ type: DataType.TEXT })
  description!: string

  // only this user can edit
  @BelongsTo(() => User, 'creatorId')
  creator!: NonAttribute<User>

  @Column({ type: DataType.UUID })
  @NotNull
  @ForeignKey(() => User)
  creatorId!: string

  @Column({ type: DataType.BOOLEAN })
  @NotNull
  @Default(true)
  isPublic!: boolean
}
