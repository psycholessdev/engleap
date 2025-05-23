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

  @Column({ type: DataType.UUID })
  @Unique('user_card_unique')
  @NotNull
  @ForeignKey(() => User)
  userId!: string

  @BelongsTo(() => Card, 'cardId')
  card!: NonAttribute<Card>

  @Column({ type: DataType.UUID })
  @Unique('user_card_unique')
  @NotNull
  @ForeignKey(() => Card)
  cardId!: string

  @Column({ type: DataType.INTEGER })
  @Default(0)
  repetitionCount!: number

  @Column({ type: DataType.FLOAT })
  @Default(2.5)
  easinessFactor!: number

  @Column({ type: DataType.INTEGER })
  @Default(0)
  intervalDays!: number

  @Column({ type: DataType.DATE })
  @AllowNull
  nextReviewAt!: Date

  @Column({ type: DataType.DATE })
  @AllowNull
  lastReviewedAt!: Date
}
