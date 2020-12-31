//dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// connecting to mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "11aa22bb",
    database: "Employee_TrackerDB",
});

// application starter
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View Departments",
            "View Roles",
            "View Employees by Department",
            "View Employees by Role",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",

            "Update Employee Manager",
            "View Employees by Manager",
            "Delete Department",
            "Delete Role",
            "Delete Employee",
            "Quit",
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View All Employees": viewAllEmployees();
                break;
            case "View Departments": viewDepartments();
                break;
            case "View Roles": viewRoles();
                break;
            case "View Employees by Department": viewByDepartment();
                break;
            case "View Employees by Role": viewByRole();
                break;
            case "Add Employee": addEmployee();
                break;
            case "Add Department": addDepartment();
                break;
            case "Add Role": addRole();
                break;
            case "Update Employee Role": updateEmpRole();
                break;


            case "Update Employee Manager": updateEmpManager();
                break;
            case "View Employees by Manager": viewByManager();
                break;
            case "Delete Department": deleteDepartment();
                break;
            case "Delete Role": deleteRole();
                break;
            case "Delete Employee": deleteEmployee();
                break;





            case "Quit": connection.end();
                break;
        }
    });
}


function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",

        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
}

function viewDepartments() {
    connection.query("SELECT id ,name  FROM department;",
        function (err, res) {
            if (err) throw err
            console.table(res);
            start();
        })
}

function viewRoles() {
    connection.query("SELECT id,title, salary, department_id FROM role;",
        function (err, res) {
            if (err) throw err
            console.table(res);
            start();
        })
}

function viewByDepartment() {
    connection.query("SELECT name FROM department",
        function (err, res) {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: function () {
                        var choiceArr = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArr.push(res[i].name);
                        }
                        return choiceArr;
                    },
                    message: "Which Department?",
                },
            ])
                .then((answer) => {

                    connection.query("SELECT first_name, last_name, role.salary, role.title, department.name as department FROM employee INNER JOIN role ON employee.role_id = role.id   INNER JOIN department ON role.department_id = department.id WHERE department.name = ? ", answer.choice,

                        function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start();
                        });
                });
        }
    );
}

function viewByRole() {
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    var choiceArr = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArr.push(res[i].title);
                    }
                    return choiceArr;
                },
                message: "Which Role?",
            },
        ]).then((answer) => {

            connection.query("SELECT first_name, last_name, role.salary, role.title, department.name as department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title=?", answer.choice,
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                }
            );
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
            validate: val => /[0-9a-zA-Z-_.]/gi.test(val),
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
            validate: val => /[0-9a-zA-Z-_.]/gi.test(val),
        },
        {
            name: "roleId",
            type: "input",
            message: "Please enter the role id",
            validate: val => /[0-9]/gi.test(val),
        },
        {
            name: "managerId",
            type: "input",
            message: "Please enter manager id",
            validate: val => /[0-9]/gi.test(val),
        }
    ]).then(answer => {

        connection.query(
            "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
            [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
            function (err, res) {
                if (err) throw err
            })
        start();
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "Please enter department name.",
            validate: val => /[0-9a-zA-Z-_.]/gi.test(val),
        },

    ]).then(answer => {
        connection.query("INSERT INTO department SET name = ?", [answer.department],
            function (err, res) {
                if (err) throw err

            })
        start();
    })
}

function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Please enter the role title.",
            validate: val => /[0-9a-zA-Z-_.]/gi.test(val),
        },
        {
            name: "salary",
            type: "input",
            message: "Please enter  role salary.",
            validate: val => /[0-9]/gi.test(val),
        },
        {
            name: "departmentId",
            type: "input",
            message: "Please enter department id.",
            validate: val => /[0-9]/gi.test(val),
        }

    ]).then(answer => {
        connection.query("INSERT INTO role SET title = ?, salary = ?, department_id = ?",
            [answer.title, answer.salary, answer.department_id],
            function (err, res) {
                if (err) throw err
            })
        start();
    })
}

function updateEmpRole() {
    inquirer.prompt([
        {
            name: "employeeId",
            type: "input",
            message: "Please enter employee id",
        },
        {
            name: "roleId",
            type: "input",
            message: "Please enter role id",
        }

    ]).then(answer => {
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?",
            [answer.roleId, answer.employeeId],
            function (err, res) {
                if (err) throw err
            })
        start();
    })
}

function updateEmpManager() {
    inquirer.prompt([
        {
            name: "managerId",
            type: "input",
            message: "Please enter manager id",
        },
        {
            name: "employeeId",
            type: "input",
            message: "Please enter employee id",

        }
    ]).then(answer => {
        connection.query(
            "UPDATE employee SET manager_id = ? WHERE id = ?",
            [answer.managerId, answer.employeeId],
            function (err, res) {
                if (err) throw err;

            })
        start();

    })
}

function viewByManager() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.name, employee.manager_id ,CONCAT(manager.first_name, ' ', manager.last_name) AS manager, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager on manager.id = employee.manager_id",

        function (err, res) {
            if (err) throw err;
            console.table(res);
        })
    start();
}

function deleteDepartment() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "ENTER DEPARTMENT ID",
        }
    ]).then(answer => {
        connection.query("DELETE FROM department WHERE id = ?", [answer.id],
            function (err, res) {
                if (err) throw err
            })
        start();
    })
}

