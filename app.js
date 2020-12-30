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
        choices: ["View All Employees", "View Employees by Department", "View Employees by Role", "Quit",]
    }).then(function (answer) {
        switch (answer.action) {
            case "View All Employees": viewAllEmployees();
                break;
            case "View Employees by Department": viewByDepartment();
                break;
            case "View Employees by Role": viewByRole();
                break;
            case "Quit": connection.end();
                break;
        }
    });
}


function viewAllEmployees() {
    connection.query("SELECT employee.id, first_name, last_name, role.salary, role.title, department.name as department  FROM employee   INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",

        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
}

function viewByDepartment() {
    connection.query("SELECT name FROM department",
        function (err, res) {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: "choice", type: "list",
                    choices: function () {
                        var choiceArr = [];
                        for (var i = 0; i < res.length; i++) { choiceArr.push(res[i].name); }
                        return choiceArr;
                    },
                    message: "Which Department?",
                },
            ])
                .then(function (answer) {
                    // console.log(answer);
                    // console.log(answer.choice);

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

        inquirer
            .prompt([
                {
                    name: "choice", type: "list",
                    choices: function () {
                        var choiceArr = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArr.push(res[i].title);
                        }
                        return choiceArr;
                    },
                    message: "Which Role?",
                },
            ])
            .then(function (answer) {
                console.log(answer);
                console.log(answer.choice);

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