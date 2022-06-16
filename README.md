Assignment is created in express js and postgres SQL as DB. 
Please import the backup file from Database/kilowott for database. U will get table for users.
Application is running on port 3000. 
Change db-config.js file according to your database connection username and password.

Created Admin user. Credentials: username: sharvari@gmail.com password: Shar@123

You can create Admin user by API : http://localhost:3000/sign-up

Admin functionality:

1)Register admin user
2)login
3)create user (email body is ready, integration is pending as gmail SMTP reqires SSL)
4)delete user
5)disable/enable user
6)see list of non admin users
7)update users

normal user
1)login using auto-generated password (Welcome@kilowott)
2)update self info
3)change password
