module.exports = {
    "type": "mysql",
"host": process.env.DB_host || 'localhost',
"port": process.env.DB_port || 3306,
"username": process.env.DB_username || "root",
"password": process.env.DB_password || "",
"database": process.env.DB_database || "thebooker",
"entities": ["dist/**/**.entity{.ts,.js}"],
"bigNumberStrings": false,
"logging": true,
"synchronize": true
}