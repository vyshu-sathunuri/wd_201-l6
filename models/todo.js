"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, {
        foreignKey: "userid",
      });
    }

    static addTodo({ title, dueDate, userid }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userid,
      });
    }

    static getTodos() {
      return this.findAll();
    }

    // markAsCompleted() {
    //   return this.update({ completed: true });
    // }
    static async overdue(userid) {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") },
          userid,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async dueToday(userid) {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date().toLocaleDateString("en-CA") },
          completed: false,
          userid,
        },

        order: [["id", "ASC"]],
      });
    }
    static async dueLater(userid) {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") },
          completed: false,
          userid,
        },

        order: [["id", "ASC"]],
      });
    }

    static async completedTodos(userid) {
      return await Todo.findAll({
        where: {
          completed: true,
          userid,
        },
      });
    }
    static async remove(id, userid) {
      return this.destroy({
        where: {
          id,
          userid,
        },
      });
    }
    setCompletionStatus(completed) {
      return this.update({ completed: completed });
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};