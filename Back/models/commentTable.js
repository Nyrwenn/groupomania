module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        commentary: { type: DataTypes.STRING(500), allowNull: false },
    });

    Comment.associate = models => {
        Comment.belongsTo(models.User, {
            onDelete: "cascade"
        })

        Comment.belongsTo(models.Article)

    }
    return Comment;

};