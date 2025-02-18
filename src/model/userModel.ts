import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../db/db";

const tableName = "users";

class DataModel extends Model<
  InferAttributes<DataModel>,
  InferCreationAttributes<DataModel>
> {
  declare id?: CreationOptional<number>;
  declare user_id?: number;
  declare name?: string;
  declare email?: string;
  declare password?: string;
}

DataModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: tableName,
    timestamps: true,
    underscored: true, // Converts camelCase fields to snake_case in DB
  }
);

export default DataModel;
