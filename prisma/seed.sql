DROP TABLE IF EXISTS usuario_curso;
DROP TABLE IF EXISTS proyecto;
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  password VARCHAR(50) NOT NULL,
  type INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(50) NOT NULL
);


CREATE TABLE usuario_curso (
  id SERIAL PRIMARY KEY,
  date_start TIMESTAMP NOT NULL,
  date_last_entry TIMESTAMP NOT NULL,
  date_end TIMESTAMP,
  date_project_assigned TIMESTAMP,
  date_project_send_max TIMESTAMP,
  state INT NOT NULL,
  progress INT NOT NULL,
  id_user INT REFERENCES usuario(id)
);

CREATE TABLE proyecto (
  id SERIAL PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(255),
  image1 VARCHAR(255),
  date_upload TIMESTAMP NOT NULL,
  projectScore INT,
  comment VARCHAR(255),
  id_user INT REFERENCES usuario(id)
);

INSERT INTO usuario (password, type, email, name) VALUES ('1234', '1', '', 'Docente 1');
INSERT INTO usuario (password, type, email, name) VALUES ('1234', '0', '', 'Alumno 1');
INSERT INTO usuario (password, type, email, name) VALUES ('1234', '0', '', 'Alumno 2');
INSERT INTO usuario (password, type, email, name) VALUES ('ariana159', '1', 'lucerito.sagas21@gmail.com', 'Profesora');
INSERT INTO usuario (password, type, email, name) VALUES ('123', '0', 'alejandraquiroztoribio@gmail.com', 'Ale 14');
INSERT INTO usuario (password, type, email, name) VALUES ('1234', '2', 'lucerito.sagas21@gmail.com', 'Desarrollador');
INSERT INTO usuario (password, type, email, name) VALUES ('123', '1', '', 'Estudiante');


/********** Simula proyecto que no se subio a tiempo ****/
UPDATE usuario_curso
SET 
	state= 0,
	Date_project_send_max = DATE '2023-11-02',
    Date_project_assigned = DATE '2023-11-01'
WHERE id_user = 6;

delete from proyecto where id_user=2

http://localhost:3000/api/cron

delete from proyecto where id_user=6
delete from usuario_curso where id_user=6
/****************************************************/