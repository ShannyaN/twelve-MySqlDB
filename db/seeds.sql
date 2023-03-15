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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES("Sam", "Winchester", 1, 4),
        ("Dean", "Winchester", 2, 4),
        ("Carl", "Grimes", 3, 4),;
        ("Rick", "Grimes", 4, 4);

SELECT * FROM role;

-- CREATE TABLE employee (
--     id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--     first_name VARCHAR(30) NOT NULL,
--     last_name VARCHAR(30) NOT NULL,
--     role_id INT,
--     manager_id INT,
--     FOREIGN KEY (role_id)
--     REFERENCES role(id)
--     ON DELETE SET NULL
-- );
--  DESCRIBE employee;