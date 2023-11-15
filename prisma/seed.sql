DROP TABLE IF EXISTS user_course;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  password VARCHAR(50) NOT NULL,
  type INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(50) NOT NULL
);


CREATE TABLE user_course (
  id SERIAL PRIMARY KEY,
  date_start TIMESTAMP NOT NULL,
  date_update TIMESTAMP NOT NULL,
  date_project_assigned TIMESTAMP,
  date_project_send_max TIMESTAMP,
  state INT NOT NULL,
  progress INT NOT NULL,
  id_user INT REFERENCES "user"(id)
);


CREATE TABLE activity (
  id SERIAL PRIMARY KEY,
  title VARCHAR(32) NOT NULL,
  description VARCHAR(255) NOT NULL,
  rubric VARCHAR(255),
  subject INT NOT NULL,
  type INT NOT NULL,
  period DATE,
  id_user INT REFERENCES "user"(id)
);

CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(255),
  image1 VARCHAR(255),
  date_upload TIMESTAMP NOT NULL,
  score INT,
  comment VARCHAR(255),
  type INT NOT NULL,
  id_activity INT REFERENCES activity(id),
  id_user INT REFERENCES "user"(id)
);

INSERT INTO "user" (password, type, email, name) VALUES ('1234', '1', '', 'Docente 1');
INSERT INTO "user" (password, type, email, name) VALUES ('1234', '0', '', 'Alumno 1');
INSERT INTO "user" (password, type, email, name) VALUES ('1234', '0', '', 'Alumno 2');
INSERT INTO "user" (password, type, email, name) VALUES ('ariana159', '1', 'lucerito.sagas21@gmail.com', 'Profesora');
INSERT INTO "user" (password, type, email, name) VALUES ('123', '0', 'alejandraquiroztoribio@gmail.com', 'Ale 14');
INSERT INTO "user" (password, type, email, name) VALUES ('1234', '2', 'lucerito.sagas21@gmail.com', 'Desarrollador');
INSERT INTO "user" (password, type, email, name) VALUES ('123', '1', '', 'Estudiante');


/********** Simula proyecto que no se subio a tiempo ****/

delete from task where id_user=6;
delete from user_course where id_user=6;

UPDATE user_course
SET 
	state= 0,
	Date_project_send_max = DATE '2023-11-02',
    Date_project_assigned = DATE '2023-11-01'
WHERE id_user = 6;


http://localhost:3000/api/cron


/****************************************************/