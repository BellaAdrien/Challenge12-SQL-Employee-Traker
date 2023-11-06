USE employees_db;

SELECT * FROM department;

SELECT role.id , title,salary,name as department 
from role LEFT JOIN
 department on department.id=  role.department_id;

 SELECT employees.id, employees.first_name, employees.last_name, title, name as department, salary, 
 CONCAT( bosses.first_name, ' ',bosses.last_name) as manager 
 from employees
 left join role on employees.role_id = role.id
 left join department on department.id = role.department_id
 left join employees as bosses on employees.manager_id=bosses.id;

