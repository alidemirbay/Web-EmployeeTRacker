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
        message: "WHAT WOULD YOU LIKE TO MANAGE?",
        choices: [
            "VIEW ALL EMPLOYEES",
            "VIEW DEPARTMENTS",
            "VIEW ROLES",
            "VIEW EMPLOYEES BY DEPARTMENT",
            "VIEW EMPLOYEES BY ROLE",
            "VIEW EMPLOYEES BY MANAGER",
            "ADD EMPLOYEE",
            "ADD DEPARTMENT",
            "ADD ROLE",
            "UPDATE EMPLOYEE ROLE",
            "UPDATE EMPLOYEE MANAGER",
            "DELETE DEPARTMENT",
            "DELETE ROLE",
            "DELETE EMPLOYEE",
            "QUIT",
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "VIEW ALL EMPLOYEES": viewAllEmployees();
                break;
            case "VIEW DEPARTMENTS": viewDepartments();
                break;
            case "VIEW ROLES": viewRoles();
                break;
            case "VIEW EMPLOYEES BY DEPARTMENT": viewByDepartment();
                break;
            case "VIEW EMPLOYEES BY ROLE": viewByRole();
                break;
            case "VIEW EMPLOYEES BY MANAGER": viewByManager();
                break;
            case "ADD EMPLOYEE": addEmployee();
                break;
            case "ADD DEPARTMENT": addDepartment();
                break;
            case "ADD ROLE": addRole();
                break;
            case "UPDATE EMPLOYEE ROLE": updateEmpRole();
                break;
            case "UPDATE EMPLOYEE MANAGER": updateEmpManager();
                break;
            case "DELETE DEPARTMENT": deleteDepartment();
                break;
            case "DELETE ROLE": deleteRole();
                break;
            case "DELETE EMPLOYEE": deleteEmployee();
                break;
            case "QUIT": connection.end();
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
                    message: "CHOOSE DEPARTMENT",
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
                message: "CHOOSE ROLE",
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

function viewByManager() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.name, employee.manager_id ,CONCAT(manager.first_name, ' ', manager.last_name) AS manager, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager on manager.id = employee.manager_id",

        function (err, res) {
            if (err) throw err;
            console.table(res);
        })
    start();
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "ENTER EMPLOYEE FIRST NAME?",
            validate: val => /[0-9a-zA-Z-_.]/gi.test(val),
        },
        {
            name: "lastName",
            type: "input",
            message: "ENTER EMPLOYEE LAST NAME?",
            validate: val => /[0-9a-zA-Z-_.]/gi.test(val),
        },
        {
            name: "roleId",
            type: "input",
            message: "ENTER THE ROLE ID",
            validate: val => /[0-9]/gi.test(val),
        },
        {
            name: "managerId",
            type: "input",
            message: "ENTER MANAGER ID",
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
            message: "ENTER DEPARTMENT NAME",
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
            message: "ENTER ROLE TITLE",
            validate: val => /[0-9a-zA-Z-_.]/gi.test(val),
        },
        {
            name: "salary",
            type: "input",
            message: "ENTER ROLE SALARY",
            validate: val => /[0-9]/gi.test(val),
        },
        {
            name: "departmentId",
            type: "input",
            message: "ENTER DEPARTMENT ID",
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
            message: "ENTER EMPLOYEE ID",
        },
        {
            name: "roleId",
            type: "input",
            message: "ENTER ROLE ID",
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
            message: "ENTER MANAGER ID",
        },
        {
            name: "employeeId",
            type: "input",
            message: "ENTER EMPLOYEE ID",
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

function deleteRole() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "ENTER ROLE ID",
        }
    ]).then(answer => {
        connection.query("DELETE FROM role WHERE id = ?", [answer.id],
            function (err, res) {
                if (err) throw err
            })
        start();
    })
}

function deleteEmployee() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "ENTER EMPLOYEE ID",
        }
    ]).then(answer => {
        connection.query("DELETE FROM employee WHERE id = ?", [answer.id],
            function (err, res) {
                if (err) throw err
            })
        start();
    })
}