-- -- SELECT *
-- -- FROM employees LEFT JOIN role
-- -- ON role.id = employees.role_id 
-- --  JOIN department on employees.role_id = department.id;

-- -- SELECT title
-- -- FROM role JOIN employees
-- -- ON employees.role_id = role.id;

-- -- SELECT  role.salary, employees.manager_id, employees.id, department.names, role.title, employees.first_name, employees.last_name
-- SELECT employees.id as ID, employees.last_name as LastName,employees.first_name as FirstName, role.title as Position,department.names as Department, role.salary as Salary, employees.manager_id as ManagerID
-- FROM employees
-- JOIN role
-- ON employees.role_id = role.id 
-- JOIN department 
-- on role.department_id=department.id
-- order by employees.id;
-- SELECT
--     department.names,
--         role.title,
--         role.salary,
-- FROM Employees employee
-- JOIN Employees manager
-- ON employee.ManagerId = manager.Id
-- SELECT
--     role.id,
--         role.title,
--         role.salary,
--         department.names as department
-- FROM role
-- JOIN department
-- ON role.department_id = department.id;
SELECT employees.id as ID, employees.last_name as LastName,
        employees.first_name as FirstName, 
        role.title as Position,
        department.names as Department, 
        role.salary as Salary, ,
        employees.first_name + ' ' +  employees.last_name + ' ' + employees.manager_id  as ManagerName FROM employees 
        JOIN role ON employees.role_id = role.id 
        JOIN department on role.department_id=department.id
        -- JOIN employees on employees.id=employees.manager_id
        order by ID;