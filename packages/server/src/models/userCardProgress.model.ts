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
import { NonAttribute } from 'sequelize'
import { User } from './user.model'
import { Card } from './card.model'

@Table
export class UserCardProgress extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @BelongsTo(() => User, 'userId')
  user!: NonAttribute<User>

  @ForeignKey(() => User)
  @Unique('user_card_unique')
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  userId!: string

  @BelongsTo(() => Card, 'cardId')
  card!: NonAttribute<Card>

  @ForeignKey(() => Card)
  @Unique('user_card_unique')
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  cardId!: string

  @Default(0)
  @Column({ type: DataType.INTEGER })
  repetitionCount!: number

  @Default(2.5)
  @Column({ type: DataType.FLOAT })
  easinessFactor!: number

  @Default(0)
  @Column({ type: DataType.INTEGER })
  intervalDays!: number

  @Column({ type: DataType.DATE, allowNull: true })
  nextReviewAt!: Date

  @Column({ type: DataType.DATE, allowNull: true })
  lastReviewedAt!: Date
}
