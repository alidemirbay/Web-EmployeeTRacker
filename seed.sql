INSERT INTO department (name) 
VALUES ("Finance"),("HR"),("Production");

INSERT INTO role(title, salary, department_id)
VALUES ("Accountant",70000,1),("Recruiter", 80000, 2),("Engineer",90000,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom","Wood",1,1),("Mike","Hard",2,1),("Mary","May",3,2),("John","Duke",3,2);