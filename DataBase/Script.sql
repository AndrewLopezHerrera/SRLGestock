--Tablas necesarias

CREATE TABLE Usuario(
	IdUsuario SERIAL PRIMARY KEY NOT NULL,
	CorreoElectronico VARCHAR(50) UNIQUE NOT NULL,
	Nombre VARCHAR(50) NOT NULL,
	ApellidoPaterno VARCHAR(50) NOT NULL,
	ApellidoMaterno VARCHAR(50) NOT NULL,
	Telefono VARCHAR(50) NOT NULL
);

CREATE TABLE Direccion(
	IdUsuario SERIAL PRIMARY KEY NOT NULL,
	Provincia VARCHAR(50) NOT NULL,
	Canton VARCHAR(50) NOT NULL,
	Distrito VARCHAR(50) NOT NULL,
	Senas VARCHAR(50) NOT NULL,
	CONSTRAINT referenciaUsuarioDireccion FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Rol(
	IdRol SERIAL PRIMARY KEY NOT NULL,
	NombreRol VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE RolUsuario(
	IdUsuario INT PRIMARY KEY NOT NULL,
	IdRol INT NOT NULL,
	CONSTRAINT referenciaUsuarioRol FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
	CONSTRAINT referenciaRol FOREIGN KEY (IdRol) REFERENCES Rol(IdRol)
);

CREATE TABLE Contrasena(
	IdUsuario INT PRIMARY KEY NOT NULL,
	ContrasenaActual VARCHAR(60) NOT NULL,
	CONSTRAINT referenciaUsuarioContrasena FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
)

--Datos necesarios

INSERT INTO Rol(NombreRol) VALUES ('Administrador');
INSERT INTO Rol(NombreRol) VALUES ('Vendedor');

--Vistas de los datos

CREATE OR REPLACE VIEW EMPEMPR AS --Vista de empleados
	SELECT 
		Usuario.IdUsuario AS idUsuario,
		CorreoElectronico AS correoElectronico,
		Nombre AS nombre,
		ApellidoPaterno AS apellidoPaterno,
		ApellidoMaterno AS apellidoMaterno,
		ContrasenaActual AS contrasenaActual,
		NombreRol AS nombreRol
	FROM
		Usuario
	INNER JOIN
		Contrasena
	ON
		Usuario.IdUsuario = Contrasena.IdUsuario
	INNER JOIN
		RolUsuario
	ON
		Usuario.IdUsuario = RolUsuario.IdUsuario
	INNER JOIN
		Rol
	ON
		RolUsuario.IdRol = Rol.IdRol;

--Procedimientos almacenados

CREATE OR REPLACE FUNCTION BuscarEmpleado(correoElectronicoIngresado VARCHAR(50))
RETURNS TABLE (
	"idUsuario" INT,
	"correoElectronico" VARCHAR,
	"nombre" VARCHAR,
	"apellidoPaterno" VARCHAR,
	"apellidoMaterno" VARCHAR,
	"contrasenaActual" VARCHAR,
	"nombreRol" VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.idUsuario,
        e.correoElectronico,
        e.nombre,
        e.apellidoPaterno,
        e.apellidoMaterno,
        e.contrasenaActual,
        e.nombreRol
    FROM EMPEMPR e
    WHERE e.correoElectronico = correoElectronicoIngresado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION CrearUsuario(
	correoElectronico VARCHAR(50),
	nombre VARCHAR(50),
	apellidoPaterno VARCHAR(50),
	apellidoMaterno VARCHAR(50),
	contrasenaActual VARCHAR(60),
	idRol INT
)
RETURNS INT AS $$
DECLARE
	nuevoIDUsuario INT;
BEGIN
    INSERT INTO
		Usuario(
			CorreoElectronico,
			Nombre,
			ApellidoPaterno,
			ApellidoMaterno
		)
	VALUES
		(
			correoElectronico,
			nombre,
			apellidoPaterno,
			apellidoMaterno
		)
	RETURNING IdUsuario INTO nuevoIDUsuario;
	INSERT INTO
		Contrasena(
			IdUsuario,
			ContrasenaActual
		)
	VALUES
		(
			nuevoIDUsuario,
			contrasenaActual
		);
	INSERT INTO
		RolUsuario(
			IdUsuario,
			IdRol
		)
	VALUES
		(
			nuevoIDUsuario,
			idRol
		);
	RETURN nuevoIDUsuario;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION TraerRolesActuales()
RETURNS TABLE (
	IdRol int,
	NombreRol VARCHAR
)
AS $$
BEGIN
    RETURN QUERY SELECT * FROM Rol;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION CambiarContrasena(
    correoElectronicoIngresado VARCHAR,
    contrasena VARCHAR
)
RETURNS INT AS $$
DECLARE
    IdUsuarioSeleccionado INT;
BEGIN
    SELECT idUsuario
    INTO IdUsuarioSeleccionado
    FROM EMPEMPR
    WHERE correoElectronico = correoElectronicoIngresado;

    IF IdUsuarioSeleccionado IS NULL THEN
        RETURN 0;
    END IF;

    UPDATE Contrasena
    SET ContrasenaActual = CambiarContrasena.contrasena
    WHERE IdUsuario = IdUsuarioSeleccionado;

    RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION ActualizarDatos(
	idUsuario INT,
	correoElectronico VARCHAR(50),
	nombre VARCHAR(50),
	apellidoPaterno VARCHAR(50),
	apellidoMaterno VARCHAR(50),
	telefono VARCHAR(50),
	provincia VARCHAR(50),
	canton VARCHAR(50),
	distrito VARCHAR(50),
	senas VARCHAR(50)
)
RETURNS INT AS $$
BEGIN
    UPDATE
		Usuario
	SET
		CorreoElectronico = correoElectronico,
		Nombre = nombre,
		ApellidoPaterno = apellidoPaterno,
		ApellidoMaterno = apellidoMaterno,
		Telefono = telefono
	WHERE idUsuario = IdUsuario;
	UPDATE
		Direccion
	SET
		Provincia = provincia,
		Canton = canton,
		Distrito = distrito,
		Senas = senas
	WHERE idUsuario = IdUsuario;
	RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

--Usuario que utiliza el backend para conectarse.
CREATE USER backend WITH PASSWORD 'askjfnsodpme';
GRANT EXECUTE ON FUNCTION BuscarEmpleado(VARCHAR(50)) TO backend;
GRANT EXECUTE ON FUNCTION CrearUsuario(VARCHAR(50),VARCHAR(50),VARCHAR(50),VARCHAR(50),
	VARCHAR(50), INT) TO backend;
GRANT EXECUTE ON FUNCTION CambiarContrasena(VARCHAR,VARCHAR) TO backend;
GRANT EXECUTE ON FUNCTION ActualizarDatos(INT,VARCHAR(50),VARCHAR(50),VARCHAR(50),VARCHAR(50),
	VARCHAR(50),VARCHAR(50),VARCHAR(50),VARCHAR(50),VARCHAR(50)) TO backend;
GRANT EXECUTE ON FUNCTION TraerRolesActuales() TO backend;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE ALL ON TABLES FROM usuario_backend;