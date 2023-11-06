const inquirer = require("inquirer")
const mysql = require("mysql2")
const { printTable } = require("console-table-printer")

require("dotenv").config()

const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306

    }
)
db.connect(() => {
    mainMenu()

})

function mainMenu(){
    inquirer .prompt({
        type: "list",
        message: "What would you like to do?",
        name: "selections",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    })
        .then(answer => {
            if (answer.selections === "view all employees") {
                viewEmployees()
            } else if (answer.selections === "add an employee") {
                addEmployee()
            } else if (answer.selections === "update an employee role") {
                updateEmployeeRole()
            }
        
            else if (answer.selections === "view all departments") {
                console.log(answer.selections);
                viewAllDepartments()
            } else if (answer.selections === "add a department") {
                addADepartment()
            }
        
            else if (answer.selections === "view all roles") {
                viewAllRoles()
            } else if (answer.selections === "add a role") {
                addARole()
            }
        })



}


function viewEmployees() {
    db.query(` SELECT employees.id, employees.first_name, employees.last_name, title, name as department, salary, 
    CONCAT( bosses.first_name, ' ',bosses.last_name) as manager 
    from employees
    left join role on employees.role_id = role.id
    left join department on department.id = role.department_id
    left join employees as bosses on employees.manager_id=bosses.id;
   
`, (err, data) => {
        printTable(data)
        mainMenu()
    })
}
function addEmployee() {
db.query("SELECT id as value, title as name from role", (err,roleData) => {
    db.query("SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employees WHERE manager_id is null", (err,ManagerData)=>{
inquirer.prompt([
    {
        type:"Input",
        message:"What is the first name?",
        name:"first_name",
        
    },
    {
        type:"Input",
        message:"What is the last name?",
        name:"last_name",
        
    },
    {
        type:"list",
        message:"Choose the following title:",
        name:"role_id",
        choices:roleData
        
    },
    {
        type:"list",
        message:"Choose the following Manager:",
        name:"manager_id",
        choices:ManagerData
        
    },

]). then(answer=>{
    db.query("INSERT INTO employees(first_name, last_name,role_id,manager_id) VALUES(?,?,?,?)", [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], err=>{
        viewEmployees()
    })
})
    })
})


}
function updateEmployeeRole() {
    db.query("SELECT id as value,title as name from role ", (err,roleData)=>{
        db.query("SELECT id as value, CONCAT(first_name,' ', last_name) as name FROM employees  ", (err, employeeData)=>{
            inquirer.prompt([
               
               {
                   type:"list",
                   message:"Choose the following title:",
                   name:"role_id",
                   choices:roleData
                    
               },
               {
                   type:"list",
                   message:"Choose the following employees:",
                   name:"employees_id",
                   choices: employeeData
                    
               },
    
            ]).then(answer=>{
               db.query("UPDATE employees SET role_id = ? WHERE id= ? ",[answer.role_id,answer.employees_id],err=>{
                   viewEmployees()
                })
            })
        })
     })

}
function viewAllDepartments() {
    console.log("viewAllDepartments");
    db.query("SELECT * from department ", (err,departmentData)=>{
        printTable(departmentData);
        mainMenu();
    }); 
    
}

function addADepartment() {
inquirer.prompt([{
    type:"input",
    message:"Enter new department",
    name:"department_name",

}]).then(answer=>{
    db.query("INSERT INTO department(name) values(?)",[answer.department_name],(err)=>{
        viewAllDepartments()
    })
})
}
function viewAllRoles() {
    db.query(` SELECT role.id , title,salary,name as department 
    from role LEFT JOIN
     department on department.id=  role.department_id;`, (err,roleData)=>{
        printTable(roleData);
        mainMenu();
    })

}
function addARole() {
   db.query(`SELECT id value, title name from role`, (err, roleData)=>{
    inquirer.prompt([{
        type:"input",
        message:"enter new title",
        name:"title"
    },
    {
        type:"input",
        message:"enter salary value",
        name:"salary"
    },
    {
        type:"list",
        message:"choose department name",
        name:"department_id",
        choices: roleData
    }
    ]).then(answer =>{
        db.query(`INSERT INTO role (title, salary, department_id) values (?,?,?)`, 
        [answer.title, answer.salary, answer.department_id],(err, roleData)=>{
            viewAllRoles()
        })
    })
   }) 

}