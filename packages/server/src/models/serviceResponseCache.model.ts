import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'

// Cache not-found responses from services
@Table
export class ServiceResponseCacheModel extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  override id!: string

  @Column
  serviceName!: string

  @Column
  query!: string

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  similarWords!: string[]
}
