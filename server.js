const express= require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const app = express();
require('console.table');

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
      database: 'hiring_db'

    },
    console.log(`Connected to the hiring_db database.`)
  );

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do? ",
        name: "task",
        choices: ['Show all Departments', 
        'Show all Roles', 
        'Show all Employees', 
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role']
    }
])
.then ((response)=> {
    const task = response.task;
    if (task === "Show all Departments"){
        db.query('SELECT * FROM department;', function (err, results) {
            console.table(results);
          });
    }
    if (task === "Show all Roles"){
        db.query('SELECT * FROM role;', function (err, results) {
            console.table(results);
            });
    }
    if (task === "Show all Employees"){
        db.query('SELECT * FROM employee;', function (err, results) {
            console.table(results);
            });
    }
    if (task === "Add a Department"){
            inquirer.prompt([
                    {
                        type: "input",
                        message: "Insert Department Name",
                        name: "text"
                    }
                ])
            .then ((res)=> {
                db.query(`INSERT INTO department(names) VALUES ("${res.text}");`, function (err, results) {
                    console.table("Department added");
                  });
                db.query('SELECT * FROM department;', function (err, results) {
                        console.table(results);
            })
        })
    }
})

// db.query(`DELETE FROM favorite_books WHERE id = ?`,deletedRow, (err, result) => {
// if (err) {
//     console.log(err);
// }
// console.log(result);
// });