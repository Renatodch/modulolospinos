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
INSERT INTO usuario (password, type, email, name) VALUES ('1234', '1', 'lucerito.sagas21@gmail.com', 'Docente 2');
INSERT INTO usuario (password, type, email, name) VALUES ('123', '0', 'alejandraquiroztoribio@gmail.com', 'Ale 14');

INSERT INTO proyecto (title, description, image1, image2, date_update, approved, projectScore, id_user)
VALUES ('Project 1', 'Description for Project 1', 'image1.jpg', 'image2.jpg', '2023-11-01 12:00:00', true, 85, 1);

INSERT INTO proyecto (title, description, image1, image2, date_update, approved, projectScore, id_user)
VALUES ('Project 2', 'Description for Project 2', 'image3.jpg', 'image4.jpg', '2023-11-02 13:15:00', false, 92, 1);

INSERT INTO proyecto (title, description, image1, image2, date_update, approved, projectScore, id_user)
VALUES ('Project 3', 'Description for Project 3', 'image5.jpg', 'image6.jpg', '2023-11-03 14:30:00', true, 78, 1);

INSERT INTO proyecto (title, description, image1, image2, date_update, approved, projectScore, id_user)
VALUES ('Project 4', 'Description for Project 4', 'image7.jpg', 'image8.jpg', '2023-11-04 15:45:00', false, 67, 1);

INSERT INTO proyecto (title, description, image1, image2, date_update, approved, projectScore, id_user)
VALUES ('Project 5', 'Description for Project 5', 'image9.jpg', 'image10.jpg', '2023-11-05 16:00:00', true, 73, 1);
