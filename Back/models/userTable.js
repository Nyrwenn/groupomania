module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        avatar: { type: DataTypes.STRING, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: false },
        firstname: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        admin: { type: DataTypes.BOOLEAN, allowNull: false }
    });

    User.associate = models => {
        User.hasMany(models.Article, {
            onDelete: "cascade"
        });


        User.hasMany(models.Comment, {
            onDelete: "cascade"
        })

    }
    return User;
};

