# Requirements:

- Install NodeJS: https://nodejs.org/en/ 
- Install MySQL: https://dev.mysql.com/downloads/

# MySQL configuration:

Create a database: `groupomania`

# Backend
Go to the file config.json 
`./config/config.json`

In "development"
- Change username with your MySQL username
- Change password with yours
- Be sure that the "database" and "host" are corrects

# Env
- Create a `.env` file, with a const like this exemple `PassJWT=DONT_SHOW_ME`.

# Install the server
Be sure to be in the folder `Back`.
Open a new terminal and then write `npm install`.

# Run the server
To run the server write `nodemon server` or `node server`in your terminal.

# Create a moderator/admin profile
To create a moderator for your website you have to go into database and type:

```insert into Users (avatar, name, firstname, email, password, admin, createdAt, updatedAt) 
values ('null', 'Modé', 'Rateur', 'moderateur@gmail.com', '$2b$10$zVwuQagFzm0FBFDWgmgH6OtOeDMxelUGLLPXE1pyYUIbduwWK8xoS', 1, NOW(), NOW());```

To be connected to the app, the email is: moderateur@gmail.com and the password is: aaaaaaaa.

If you want to set a normal user as a moderator, type this command in your database:

```update Users 
set admin = true
where email = "your user email"; ```