const express= require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const app = express();
require('console.table');

let regex = /[ !@#$%^&*()_+\-12345678=\[\]{};:"\\|,.<>\/?]/g;
let re;
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
        'Show Roles & Departments',
        'Show all Employees', 
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role'
    ]   
    }
])
.then ((response)=> {
    const task = response.task;
    re = response.again;
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
    if (task === "Show all Roles"){
        db.query('SELECT * FROM role INNER JOIN department ON role.department_id = department.id;',function (err, results) {
            console.table(results);
            });}
    if (task === "Show all Employees"){
        db.query('SELECT * FROM employees;', function (err, results) {
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
                let depName = res.text;
                if (regex.test(depName)){
                    throw new Error("Enter valid department name.");
                    return;
                } else{
                db.query(`INSERT INTO department(names) VALUES ("${depName}");`, function (err, results) {
                    console.table("Department added");
                  });
                db.query('SELECT * FROM department;', function (err, results) {
                        console.table(results);
                })
        }})
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
            if (regex.test(title)){
                throw new Error("Enter valid role title.");
                return;
            } else{
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
            let role;
            if (regex.test(res.firstName)){
                throw new Error("Enter valid name.");
                return;
            } 
            if (regex.test(res.lastName)){
                throw new Error("Enter valid name.");
                return;
            } 
            db.query(`SELECT title FROM role WHERE id = ${res.roleID};`, function(err, results) {
                if (results.length){
                    role = results;
                } else { 
                    throw new Error("You must select a valid id from the role table.");
                    return;
                }
            })
            const {managerID} = res;
            let managerInfo;
            if (managerID.length){
                db.query(`SELECT first_name FROM employees WHERE id = ${managerID};`, function(err, results) {
                    console.log(results)
                    if (results.length){
                        managerInfo = results;
                    } else { 
                        throw new Error("You must select a valid id from the employees table.");
                        return;
                    }
                })
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES("${res.firstName}", "${res.lastName}", ${res.roleID}, ${res.managerID});`, function (err, results) {
                if (err){
                    console.log(err)
                }else{
                    console.table("Role added.");
                    db.query('SELECT * FROM employees;', function (err, results) {
                        console.table(results);
                })
            }});
            }
            else {
                db.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES("${res.firstName}", "${res.lastName}", ${res.roleID});`, 
                function (err, results) {
                    if (err){
                        console.log(err)
                    }else{
                        console.table("Role added.");
                        db.query('SELECT * FROM employees;', function (err, results) {
                            console.table(results);
                    })
                }});
            }}
    )}
    if (task==='Update an Employee Role'){
        inquirer.prompt([
            {
                type: "input",
                message: "Insert Employee ID",
                name: "employeeID"
            },
            {
                type: "input",
                message: "Insert New Role ID",
                name: "roleID"
            },
            {
                type: "input",
                message: "Insert New Manager ID if any",
                name: "managerID"
            }
        ])
        .then ((res)=> {
            let {employeeID} = res;
            let {managerID} = res;
            let {roleID} = res;
            db.query(`SELECT first_name FROM employees WHERE id = ${employeeID};`, function(err, results) {
                if (results.length){
                    console.log(results);
                } else { 
                    throw new Error("You must select a valid id from the employees table to select an employee.");
                    return;}
            })
            db.query(`SELECT first_name FROM employees WHERE id = ${managerID};`, function(err, results) {
                if (results.length){
                    console.log(results);
                } else { 
                    throw new Error("You must select a valid id from the employees table for the new manager.");
                    return;}
            })
            db.query(`SELECT title FROM role WHERE id = ${roleID};`, function(err, results) {
                if (results.length){
                    console.log(results);
                } else { 
                    throw new Error("You must select a valid role id from the role table.");
                    return;}
            })
            db.query(`UPDATE employees SET role_id = ${roleID} WHERE id = ${employeeID};`, function(err, results) {
                if(err){
                    console.log(err)
                }})
            if (managerID.length){
                db.query(`UPDATE employees SET manager_id = ${managerID} WHERE id = ${employeeID};`, function(err, results) {
                    if(err){
                        console.log(err)
                    }})
            }
            })
        }})