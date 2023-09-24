const inquire = require("inquirer")
const mysql= require("mysql2")
const {printTable}=require("console-table-printer")

require("dotenv").config()

const db= mysql.createConnection(
    {host: "localhost",
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
port:3306

}
)
db.connect(()=>{
mainMenu()

})

function mainMenu(){
   inquirer.prompt({

type:"list",
message:"What would you like to do?",
name:"selections",
choices:["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
   })
   .then(answer=>{
    if(answer.selection==="view all employees"){
viewEmployees()
    }else if(answer.selection==="add an employee"){
addEmployee()
    }else if(answer.selection==="update an employee role"){
updateEmployeeRole()
    }
   }) 

   .then(answer=>{
    if(answer.selection==="view all departments"){
viewAllDepartments()
    }else if(answer.selection==="add a department"){
addADepartment()
    }
})

.then(answer=>{
    if(answer.selection==="view all roles"){
viewAllRoles()
    }else if(answer.selection==="add a role"){
addARole()
    }
   }) 



}


function viewEployees(){

}
function addEmployee(){

}
function updateEmployeeRole(){

}
function viewAllDepartments(){

}

function addADepartment(){

}
function viewAllRoles(){

}
function addARole(){
    
}