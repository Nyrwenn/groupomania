module.exports = (sequelize, DataTypes) => {

    const Article = sequelize.define("Article", {
        //userId: { type: DataTypes.STRING, allowNull: false },
        legend: { type: DataTypes.STRING, allowNull: true },
        picture: { type: DataTypes.STRING, allowNull: false },
    });


    Article.associate = models => {
        Article.belongsTo(models.User, {
            onDelete: "cascade"
        });

        Article.hasMany(models.Like, {
            onDelete: "cascade"
        });

        Article.hasMany(models.Comment, {
            onDelete: "cascade"
        });
    }



    return Article;
};
