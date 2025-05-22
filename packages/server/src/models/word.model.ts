import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  Default,
  Unique,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'
import { NonAttribute } from 'sequelize'
import { Definition } from './definition.model'

@Table
export class Word extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @Column
  @Unique
  text!: string

  @HasMany(() => Definition, 'wordId')
  definitions!: NonAttribute<Definition[]>
}
