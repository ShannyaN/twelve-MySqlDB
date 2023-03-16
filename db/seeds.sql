INSERT INTO department(names)
    VALUES ("Research & Development"),
            ("Human Resources"),
            ("IT"),
            ("Executive Board");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
    VALUES("Engineer", 80000, 1),
            ("Researcher", 90000, 1),
            ("Technician", 65000, 3),
            ("Hiring Manager", 45000, 2), 
            ("CEO", 250000, 4),
            ("Executive Manager", 100000, 4);
SELECT * FROM role;

INSERT INTO employees (first_name, last_name, role_id)
    VALUES ("Rick", "Grimes", 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES("Sam", "Winchester", 1, 1),
        ("Dean", "Winchester", 2, 1),
        ("Carl", "Grimes", 3, 1),
        ("Joel", "Miller", 4, 1);
       


SELECT * FROM employees;