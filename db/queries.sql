SELECT *
FROM role 
INNER JOIN department
ON role.department_id = department.id;