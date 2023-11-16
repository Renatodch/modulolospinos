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
  state INT NOT NULL,
  average INT,
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
  date_max TIMESTAMP,
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