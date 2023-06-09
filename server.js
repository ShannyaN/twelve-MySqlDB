//DEPENDENCIES
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

//Selection of possible actions
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
        'Update an Employee Role',
        'Remove Employee',
        'Remove Department',
        'Remove Role',
        "View Employees by Manager"
    ]   
    }
])
.then ((response)=> {
    const task = response.task;
    re = response.again;
    if (task === "Show all Departments"){//print entire table
        db.query('SELECT * FROM department;', function (err, results) {
            console.table(results);
          });
    }
    if (task === "Show all Roles"){
        db.query(`SELECT role.id, role.title, role.salary, department.names as department
                FROM role JOIN department ON role.department_id = department.id;`, function (err, results) {
            console.table(results);
            });
    }
    if (task === "Show all Employees"){
        db.query(`SELECT employees.id as ID, employees.last_name as LastName,
        employees.first_name as FirstName, 
        role.title as Position,
        department.names as Department, 
        role.salary as Salary, 
        CONCAT(manager.first_name,' ',manager.last_name) as Manager FROM employees employees 
        LEFT JOIN employees manager on employees.manager_id = manager.id
        JOIN role ON employees.role_id = role.id 
        JOIN department on role.department_id=department.id
        ORDER BY employees.id;`, function (err, results) {
            if(err){
                console.log(err)
            }else{
            console.table(results);
            }});
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
                db.query(`INSERT INTO department(names) VALUES ("${depName}");`, function (err, results) {
                    console.table("Department added");
                  });
                db.query('SELECT * FROM department;', function (err, results) {//print table with the new data input
                        console.table(results);
                })
            })}
    if (task === "Add a Role"){
        inquirer.prompt([//new prompts to get more info
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
            if (typeof Number(res.salary) !== "number") {//making sure the salary input is a number
                throw new Error("You must input a valid number for the salary. No special characters.");
                return;
            }
            db.query(`SELECT names FROM department WHERE id = ${res.depId};`, function(err, results) {//mkaing sure department ID existed
                console.log(results)
                if (results.length){
                    dep = results;
                } else { 
                    throw new Error("You must select a valid id from the department table.");
                    return;
                }
            })
            db.query(`INSERT INTO role (title, salary, department_id)VALUES("${res.roleTitle}", ${res.salary}, ${res.depId});`, function (err, results) {
                console.log("Role added.");
              });
            db.query('SELECT * FROM role;', function (err, results) {
                    console.table(results);
                    return;
            })
        })}
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
            db.query(`SELECT title FROM role WHERE id = ${res.roleID};`, function(err, results) {//making sure role ID existed
                if (err){
                    console.log(err)}
            })
            const {managerID} = res;
            let managerInfo;
            if (managerID.length){//checking if user input a manager ID
                db.query(`SELECT first_name FROM employees WHERE id = ${managerID};`, function(err, results) {//making sure it exists
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
                        return;
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
                            return;
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
            db.query(`SELECT first_name, last_name FROM employees WHERE id = ${employeeID};`, function(err, results) {
                if (err){
                    console.log(err)}
                console.log("Name of Employee Updated: ")
                console.log(results);
            })
            db.query(`SELECT first_name FROM employees WHERE id = ?;`, res.managerID, function(err, results) {
                if (err){
                    console.log(err)}
            })
            db.query(`SELECT title FROM role WHERE id = ${roleID};`, function(err, results) {
                if (err){
                    console.log(err)}
                console.log("Name of New Position: ")
                console.log(results)
            })
            db.query(`UPDATE employees SET role_id = ${roleID} WHERE id = ${employeeID};`, function(err, results) {
                if(err){
                    console.log(err)
                }})
            if (managerID.length){
                db.query(`UPDATE employees SET manager_id = ${managerID} WHERE id = ${employeeID};`, function(err, results) {
                    if(err){
                        console.log(err)//updating data
                    }})
                db.query(`SELECT * FROM employees;`, function(err,results){
                    if (err){
                        console.log(err)//printing updated info in full table
                    }else{
                        console.table(results)
                    }
                })
            }
            })
        }
    if (task==='Remove Employee'){
        inquirer.prompt([
            {
                type: "input",
                message: "Insert Employee ID to be removed.",
                name: "employeeID"
            },
        ])
        .then((res) =>{
            const{employeeID}=res;
            db.query(`SELECT first_name, last_name FROM employees WHERE id = ${employeeID};`, function(err, results) {//getting name from id
                if (results.length){
                    console.log(results);
                } else { 
                    throw new Error("You must select a valid id from the employees table to select an employee.");
                    return;}
            })
            db.query(`DELETE FROM employees WHERE id=${res.employeeID};`,function(err,results){//removing row from employee tabble
                if (err){
                    console.log(err)
                }else{
                    console.log('Successful deletion')
                }
            })
            db.query(`SELECT * FROM employees;`,function(err,results){//printing updated table
                if (err){
                    console.log(err)
                }else{
                    console.table(results)
                }
            })
    })}
    if (task==='Remove Department'){
        inquirer.prompt([
            {
                type: "input",
                message: "Insert Department ID to be removed.",
                name: "departmentID"
            },
        ])
        .then((res) =>{
            const{departmentID}=res;
            db.query(`SELECT names FROM department WHERE id = ${departmentID};`, function(err, results) {//getting name from id
                if (results.length){
                    console.log("Department to be removed" + results);
                } else { 
                    throw new Error("You must select a valid id from the department table to select a department.");
                    return;}
            })
            db.query(`DELETE FROM department WHERE id=${res.departmentID};`,function(err,results){//removing row from department tabble
                if (err){
                    console.log(err)
                }else{
                    console.log('Successful deletion')
                }
            })
            db.query(`SELECT * FROM department;`,function(err,results){//printing updated table
                if (err){
                    console.log(err)
                }else{
                    console.table(results)
                }
            })  
    })}
    if (task==='Remove Role'){
        inquirer.prompt([
            {
                type: "input",
                message: "Insert Role ID to be removed.",
                name: "roleID"
            },
        ])
        .then((res) =>{
            const{roleID}=res;
            db.query(`SELECT title FROM role WHERE id = ${roleID};`, function(err, results) {//getting name from id
                if (err){
                    console.log(err)}
            })
            db.query(`DELETE FROM role WHERE id=${res.roleID};`,function(err,results){//removing row from role tabble
                if (err){
                    console.log(err)
                }else{
                    console.log('Successful deletion')
                }
            })
            db.query(`SELECT * FROM role;`,function(err,results){//printing updated table
                if (err){
                    console.log(err)
                }else{
                    console.table(results)
                }
            })
            
    })}
    if (task === "View Employees by Manager"){
        inquirer.prompt([
            {
                type: "input",
                message: "Insert manager ID to view their employees.",
                name: "managerID"
            },
        ])
        .then((res) =>{
            const{managerID}=res;//print entire table
            db.query(`SELECT last_name, first_name FROM employees WHERE id = ${managerID};`, function (err, results) {
                if(err){
                    console.log(err)
                }else {
                    console.log("Manager Selected")
                    console.table(results);
            }})
            db.query(`SELECT * FROM employees WHERE manager_id = ${managerID};`, function (err, results) {
                if(err){
                    console.log(err)
                }else {
                console.table(results);
            }})
        })
    }
})