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
    VALUES("Ellie", "Williams", 4, 1),
        ("Sam", "Winchester", 1, 1),
        ("Dean", "Winchester", 3, 2),
        ("Carl", "Grimes", 2, 1),
        ("Joel", "Miller", 4, 2);
SELECT * FROM employees;