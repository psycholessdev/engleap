import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  NotNull,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'

@Table
export class User extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @Unique
  @NotNull
  @Column
  username!: string

  @Unique
  @Column
  email!: string

  @NotNull
  @Column
  passwordHash!: string

  @Column({ type: DataType.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') })
  proficiencyLevel!: string
}
