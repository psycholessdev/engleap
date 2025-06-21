import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { NonAttribute } from 'sequelize'
import { User } from './user.model'
import { Card } from './card.model'

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

  @Default('📗')
  @Column
  emoji!: string

  @Column({ type: DataType.UUID, allowNull: true })
  copiedFrom?: string

  // only this user can edit
  @BelongsTo(() => User, 'creatorId')
  creator!: NonAttribute<User>

  @HasMany(() => Card, 'deckId')
  cards!: NonAttribute<Card[]>

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  creatorId!: string

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isPublic!: boolean
}
