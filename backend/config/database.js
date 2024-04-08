const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const localDB = "postgres://postgres:1234@127.0.0.1:5432/postgres";
const hostedDb =
  "postgres://youtube_db_zpd3_user:IgLpd1HaQaq8nO0Z0lUNvkTCu0z87t74@dpg-cnpsl98l6cac73apiio0-a.singapore-postgres.render.com/youtube_db_zpd3";
const sequelize = new Sequelize(localDB, {
  // dialectOptions: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   }
  // },
  define: {
    scopes: {
      excludeCreatedAtUpdateAtId: {
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      },
    },
    timestamps: false,
  },
  dialect: "postgres",
  logging: false,
  // logging: console.log,
  // logQueryParameters: true,
});

const Users = sequelize.define("users", {
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
    unique: {
      arg: true,
      msg: "This email Id is already exists",
    },
    allowNull: false,
  },
  avatar: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Users.prototype.getJWTToken = function () {
  return jwt.sign({ id: this.userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

Users.prototype.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return [resetToken, resetPasswordExpire];
};

const Content = sequelize.define(
  "content",
  {
    videoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    videoTime: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    likes: {
      type: DataTypes.NUMERIC,
    },
    dislikes: {
      type: DataTypes.NUMERIC,
    },
    videoMetaData: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    totalViews: {
      type: DataTypes.NUMERIC,
    },
    createdUserId: {
      type: DataTypes.NUMERIC,
      references: {
        model: "users",
        key: "userId",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Content.belongsTo(Users, { foreignKey: "createdUserId" });

const Comments = sequelize.define(
  "comments",
  {
    commentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commentUserId: {
      type: DataTypes.NUMERIC,
      references: {
        model: "Users",
        key: "userId",
      },
    },
    commentMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    commentVideoId: {
      type: DataTypes.NUMERIC,
      references: {
        model: "Content",
        key: "videoId",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
  }
);

Comments.belongsTo(Users, {
  foreignKey: "commentUserId",
});
Comments.belongsTo(Content, {
  foreignKey: "commentVideoId",
});

const Likes = sequelize.define(
  "likes",
  {
    userId: {
      type: DataTypes.NUMERIC,
      references: {
        model: "users",
        key: "userId",
      },
      allowNull: false,
    },
    videoId: {
      type: DataTypes.NUMERIC,
      references: {
        model: "contents",
        key: "videoId",
      },
      allowNull: false,
    },
    isLike: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
Likes.belongsTo(Users, { foreignKey: "userId" });
Likes.belongsTo(Content, { foreignKey: "videoId" });
Likes.removeAttribute("id");
Likes.removeAttribute("updatedAt");
Likes.removeAttribute("createdAt");

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { connectToDB, sequelize, Users, Content, Comments, Likes };
