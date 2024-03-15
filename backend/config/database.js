const { Sequelize } = require('sequelize');
const {  DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://youtube_db_zpd3_user:IgLpd1HaQaq8nO0Z0lUNvkTCu0z87t74@dpg-cnpsl98l6cac73apiio0-a.singapore-postgres.render.com/youtube_db_zpd3',{
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      } 
    }
})

const Users = sequelize.define('users', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});



const connectToDB = async () => {
  try {
    await sequelize.authenticate(); 
    console.log('Connection has been established successfully.');
   
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};




module.exports = {connectToDB,sequelize,Users};
