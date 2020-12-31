INSERT INTO department (name) 
VALUES ("Finance"),("HR"),("Production");

INSERT INTO role(title, salary, department_id)
VALUES ("Accountant",70000,1),("Recruiter", 80000, 2),("Engineer",90000,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom","Wood",1,null),
("Ryan","Haralson",1,1),
("Shannon","Weiler",2,1),
("Mike","Hard",2,1),
("Mary","May",3),
("John","Duke",3,5),
("Renate","Wharton",3,5),
("Margaret","Young",3,5),
("Laurie","Paynter",3,5),
("Robert","Hill",3,5);

