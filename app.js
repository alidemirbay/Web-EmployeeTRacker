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
        message: "Choose below.",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Role",
            "Quit",
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View All Employees": viewAll();
                break;
            case "View All Employees by Department": viewAllDepartment();
                break;
            case "View All Employees by Role": viewAllRole();
                break;
            case "Quit": connection.end();
                break;
        }
    });





}