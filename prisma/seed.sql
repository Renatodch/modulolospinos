DROP TABLE IF EXISTS user_course;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS "subject";
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


CREATE TABLE "subject" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(255),
  url VARCHAR(255),
  "value" INT NOT NULL
);

CREATE TABLE activity (
  id SERIAL PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(255) NOT NULL,
  rubric VARCHAR(255),
  type INT NOT NULL,
  date_max TIMESTAMP,
  id_subject INT REFERENCES "subject"(id),
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
INSERT INTO "user" (password, type, email, name) VALUES ('ariana159', '1', 'lucerito.sagas21@gmail.com', 'Docente 2');
INSERT INTO "user" (password, type, email, name) VALUES ('123', '0', 'alejandraquiroztoribio@gmail.com', 'Alumno 3');
INSERT INTO "user" (password, type, email, name) VALUES ('1234', '2', 'lucerito.sagas21@gmail.com', 'Desarrollador');
INSERT INTO "user" (password, type, email, name) VALUES ('123', '1', '', 'Docente 3');

INSERT INTO subject (title, description, url, value) VALUES ('Qué es una fracción', 'Descripcion del tema 1', 'https://www.youtube.com/embed/g2rI5mAWPeU?si=gaIOzQXC2YIck04Q', 0);
INSERT INTO subject (title, description, url, value) VALUES ('Introducción a fracciones', 'Descripción del tema 2', 'https://www.youtube.com/embed/grlbI4ZgzXA?si=cwo501nM1bxquX2R', 1);
INSERT INTO subject (title, description, url, value) VALUES ('Suma y resta de fracciones con denominadores comunes', 'Descripción del tema 3', 'https://www.youtube.com/embed/qJtoI1ipxs8?si=3lhYpUKrMrkFhmtb', 2);
INSERT INTO subject (title, description, url, value) VALUES ('Suma y resta de fracciones con denominadores diferentes', 'Descripción del tema 4', 'https://www.youtube.com/embed/Ew9yAW7bf7U?si=xU_jO-6wOf2_5jTF', 3);
INSERT INTO subject (title, description, value) VALUES ('Seccion final', 'Descripción del tema 5', 4);


INSERT INTO activity (title, description, id_subject, type, id_user) VALUES ('Actividad Pregunta 1-1', 'Pregunta 1', 1, 0, 6);
INSERT INTO activity (title, description, id_subject, type, date_max, id_user) VALUES ('Actividad Pregunta 2-1', 'Pregunta 2', 1, 0, '2023-11-19 12:00:00', 6);
INSERT INTO activity (title, description, id_subject, type, date_max, id_user) VALUES ('Actividad Pregunta 1-2', 'Pregunta 3', 2, 0, '2023-11-20 12:00:00', 6);
INSERT INTO activity (title, description, id_subject, type,  id_user) VALUES ('Actividad Proyecto 2-2', 'Proyecto 1', 2, 1, 6);
INSERT INTO activity (title, description, id_subject, type, date_max, id_user) VALUES ('Actividad Pregunta 1-3', 'Pregunta 4', 4, 0, '2023-11-21 12:00:00', 6);
INSERT INTO activity (title, description, id_subject, type, date_max, id_user) VALUES ('Actividad Proyecto 1-4', 'Proyecto 2', 5, 1, '2023-11-22 12:00:00', 6);
INSERT INTO activity (title, description, id_subject, type, date_max, id_user) VALUES ('Actividad Proyecto 2-4', 'Proyecto 3', 5, 1, '2023-11-22 12:00:00', 6);

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


/******* all evaluated : reproved *******/
INSERT INTO user_course (date_start,date_update,state,progress,id_user) VALUES ('2023-11-14 23:59:59', '2023-11-14 23:59:59',0, 4, 6);

INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 1','2023-11-19 23:59:00', 0, 1, 6, 10);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 2','2023-11-19 23:59:00', 0, 2, 6, 10);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 3','2023-11-20 23:59:00', 0, 3, 6, 10);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 1','2023-11-20 23:59:00', 1, 4, 6, 10);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Pregunta', 'Tarea de Pregunta 4','2023-11-21 23:59:00', 0, 5, 6, 10);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 2','2023-11-22 23:59:00', 1, 6, 6, 1);
INSERT INTO task (title, description, date_upload, type, id_activity, id_user, score) VALUES ('Tarea Proyecto', 'Tarea de Proyecto 3','2023-11-22 23:59:00', 1, 7, 6, 1);
