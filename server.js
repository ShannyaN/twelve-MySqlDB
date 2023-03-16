const express= require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const app = express();
require('console.table');

let regex = /[ !@#$%^&*()_+\-12345678=\[\]{};:"\\|,.<>\/?]/g;
let managerID;
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
    if (task === "Add a Role"){
        inquirer.prompt([
                {
                    type: "input",
                    message: "Insert Role Title",
                    name: "roleTitle"
                },
                {
                    type: "input",
                    message: "Role Salary",
                    name: "salary"
                },
                {
                    type: "input",
                    message: "Insert Role's Department id number.",
                    name: "depId"
                }
            ])
        .then ((res)=> {
            let title = res.roleTitle;
            console.log(regex.test(title));
            let bool = regex.test(title);
            if (regex.test(title)){
                throw new Error("Enter valid role title.");
                return;
            } else{
            let dep;
            if (typeof Number(res.salary) !== "number") {
                throw new Error("You must input a number for the salary. No special characters.");
                return;
            }
            db.query(`SELECT names FROM department WHERE id = ${res.depId};`, function(err, results) {
                console.log(results)
                if (results.length){
                    dep = results;
                } else { 
                    throw new Error("You must select a valid id from the department table.");
                    return;
                }
            })
            db.query(`INSERT INTO role (title, salary, department_id)VALUES("${res.roleTitle}", ${res.salary}, ${res.depId});`, function (err, results) {
                console.table("Role added.");
              });
            db.query('SELECT * FROM role;', function (err, results) {
                    console.table(results);
            })
        }})
    }
    if (task === 'Add an Employee'){
        inquirer.prompt([
            {
                type: "input",
                message: "Enter employee's first name: ",
                name: "firstName"
            },
            {
                type: "input",
                message: "Enter employee's last name: ",
                name: "lastName"
            },
            {
                type: "input",
                message: "Insert Employee's Role id number.",
                name: "roleID"
            },
            {
                type: "input",
                message: "Insert Employee's Manager id if applicable.",
                name: "managerID"
            }

        ])
    .then ((res)=> {
        //console.log(res)
        if (res.managerID.length){
            db.query(`INSERT INTO emlployee (first_name, last_name, role_id, manager_id) VALUES("${res.firstName}", "${res.lastName}", ${res.roleID},${res.managerID});`, function (err, results) {
            console.table("Employee added.");
          });}
        else {
            db.query(`INSERT INTO emlployee (first_name, last_name, role_id, manager_id) VALUES("${res.firstName}", "${res.lastName}", ${res.roleID});`, function (err, results) {
                console.table("Employee added.");
            })
        db.query('SELECT * FROM employee;', function (err, results) {
                console.table(results);})
    }})
}})

// db.query(`DELETE FROM favorite_books WHERE id = ?`,deletedRow, (err, result) => {
// if (err) {
//     console.log(err);
// }
// console.log(result);
// });