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


INSERT INTO activity (title, description, subject, type, id_user) VALUES ('Actividad Pregunta', 'Pregunta 1', 0, 0, 6);
INSERT INTO activity (title, description, subject, type, date_max, id_user) VALUES ('Actividad Pregunta', 'Pregunta 2', 0, 0, '2023-11-19 12:00:00', 6);
INSERT INTO activity (title, description, subject, type, date_max, id_user) VALUES ('Actividad Pregunta', 'Pregunta 3', 1, 0, '2023-11-20 12:00:00', 6);
INSERT INTO activity (title, description, subject, type,  id_user) VALUES ('Actividad Proyecto', 'Proyecto 1', 1, 1, 6);
INSERT INTO activity (title, description, subject, type, date_max, id_user) VALUES ('Actividad Pregunta', 'Pregunta 4', 3, 0, '2023-11-21 12:00:00', 6);
INSERT INTO activity (title, description, subject, type, date_max, id_user) VALUES ('Actividad Proyecto', 'Proyecto 2', 4, 1, '2023-11-22 12:00:00', 6);
INSERT INTO activity (title, description, subject, type, date_max, id_user) VALUES ('Actividad Proyecto', 'Proyecto 3', 4, 1, '2023-11-22 12:00:00', 6);

/******* starter *************/
INSERT INTO user_course (date_start,date_update,state,progress,id_user) VALUES ('2023-11-14 23:59:59', '2023-11-14 23:59:59',0, 0, 6);

INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 1','2023-11-19 23:59:00', 0, 1, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 2','2023-11-19 23:59:00', 0, 2, 6);


/******* all done *******/
INSERT INTO user_course (date_start,date_update,state,progress,id_user) VALUES ('2023-11-14 23:59:59', '2023-11-14 23:59:59',0, 4, 6);

INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 1','2023-11-19 23:59:00', 0, 1, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 2','2023-11-19 23:59:00', 0, 2, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 3','2023-11-20 23:59:00', 0, 3, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 1','2023-11-20 23:59:00', 1, 4, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 4','2023-11-21 23:59:00', 0, 5, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 2','2023-11-22 23:59:00', 1, 6, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 3','2023-11-22 23:59:00', 1, 7, 6);

/******* all done some evaluated *******/
INSERT INTO user_course (date_start,date_update,state,progress,id_user) VALUES ('2023-11-14 23:59:59', '2023-11-14 23:59:59',0, 4, 6);

INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 1','2023-11-19 23:59:00', 0, 1, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 2','2023-11-19 23:59:00', 0, 2, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 3','2023-11-20 23:59:00', 0, 3, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 1','2023-11-20 23:59:00', 1, 4, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 4','2023-11-21 23:59:00', 0, 5, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 2','2023-11-22 23:59:00', 1, 6, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 3','2023-11-22 23:59:00', 1, 7, 6, 20);

/******* some done some evaluated *******/
INSERT INTO user_course (date_start,date_update,state,progress,id_user) VALUES ('2023-11-14 23:59:59', '2023-11-14 23:59:59',0, 4, 6);

INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 3','2023-11-20 23:59:00', 0, 3, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 1','2023-11-20 23:59:00', 1, 4, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 4','2023-11-21 23:59:00', 0, 5, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 2','2023-11-22 23:59:00', 1, 6, 6);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 3','2023-11-22 23:59:00', 1, 7, 6, 20);

/******* all evaluated *******/
INSERT INTO user_course (date_start,date_update,state,progress,id_user) VALUES ('2023-11-14 23:59:59', '2023-11-14 23:59:59',0, 4, 6);

INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 1','2023-11-19 23:59:00', 0, 1, 6, 20);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 2','2023-11-19 23:59:00', 0, 2, 6, 20);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 3','2023-11-20 23:59:00', 0, 3, 6, 20);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 1','2023-11-20 23:59:00', 1, 4, 6, 20);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 4','2023-11-21 23:59:00', 0, 5, 6, 20);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 2','2023-11-22 23:59:00', 1, 6, 6, 20);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 3','2023-11-22 23:59:00', 1, 7, 6, 20);
