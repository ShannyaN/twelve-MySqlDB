const express= require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: '',
     // database: 
    },
    console.log(`Connected to the " " database.`)
  );

// inquirer.prompt([
//     {
//         type: "input",
//         message: "Logo text: ",
//         name: "text"
//     },
//     {
//         type: "list",
//         message: "Pick a shape. ",
//         name: "shape",
//         choices: ['circle', 'triangle', 'square']
//     }
// ])

// db.query(`DELETE FROM favorite_books WHERE id = ?`,deletedRow, (err, result) => {
// if (err) {
//     console.log(err);
// }
// console.log(result);
// });

// // Query database
// db.query('SELECT * FROM favorite_books', function (err, results) {
// console.log(results);
// });