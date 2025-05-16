CREATE TABLE IF NOT EXISTS Producto(
	IdProducto INT PRIMARY KEY NOT NULL,
	Nombre VARCHAR(50) NOT NULL,
	Descripcion TEXT NOT NULL,
	Precio MONEY NOT NULL,
	Impuesto REAL NOT NULL,
	Cantidad INT NOT NULL
);

CREATE TABLE IF NOT EXISTS RegistroVentas(
	IdProducto INT PRIMARY KEY NOT NULL,
	Cantidad BIGINT NOT NULL,
	CONSTRAINT referenciaProductoVentas FOREIGN KEY (IdProducto) REFERENCES Producto(IdProducto)
);

CREATE VIEW PRCO AS
	SELECT
		P.IdProducto AS Consecutivo,
		P.Nombre AS Nombre,
		P.Descripcion AS Descripcion,
		P.Precio AS Precio,
		P.Impuesto AS Impuesto,
		P.Cantidad AS Cantidad,
		R.Cantidad AS Ventas
	FROM
		Producto P
	INNER JOIN
		RegistroVentas R
	ON
		P.IdProducto = R.IdProducto;

CREATE OR REPLACE FUNCTION CrearProducto(
	consecutivo INT,
	nombre VARCHAR,
	descripcion TEXT,
	precio MONEY,
	impuesto REAL,
	cantidad INT
)
RETURNS INT AS $$
BEGIN

    INSERT INTO
		Producto(
			IdProducto,
			Nombre,
			Descripcion,
			Precio,
			Impuesto,
			Cantidad
		)
	VALUES
		(
			consecutivo,
			nombre,
			descripcion,
			precio,
			impuesto,
			cantidad
		);
	
	RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION BuscarProducto(
	pConsecutivo VARCHAR,
	pNombre VARCHAR
)
RETURNS TABLE (
	Consecutivo INT,
	Nombre VARCHAR,
	Ventas INT
)
AS $$
BEGIN
	IF pConsecutivo <> '' THEN
    	RETURN QUERY SELECT
			Consecutivo,
			Nombre,
			Ventas
		FROM
			PRCO
		WHERE
			PRCO.Consecutivo::text LIKE '%' || pConsecutivo || '%'
		LIMIT 30;
	ELSIF pNombre <> '' THEN
		RETURN QUERY SELECT
			Consecutivo,
			Nombre,
			Ventas
		FROM
			PRCO
		WHERE
			PRCO.Nombre LIKE '%' || pNombre || '%'
		LIMIT 30;
	ELSE
	    RETURN QUERY SELECT
			Consecutivo,
			Nombre,
			Ventas
		FROM
			PRCO
		LIMIT 30;
	END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION SeleccionarProducto(
	pConsecutivo INT
)
RETURNS TABLE (
	Consecutivo INT,
	Nombre VARCHAR,
	Descripcion TEXT,
	Precio MONEY,
	Impuesto REAL,
	Cantidad INT,
	Ventas INT
)
AS $$
BEGIN
	SELECT
		*
	FROM
		Producto
	WHERE
		Producto.Consecutivo = pConsecutivo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION EliminarProducto(
	pConsecutivo INT
)
RETURNS INT AS $$
BEGIN
	DELETE FROM
		Producto
	WHERE
		Producto.Consecutivo = pConsecutivo;
	RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION EditarProducto(
	consecutivo INT,
	nombre VARCHAR,
	descripcion TEXT,
	precio MONEY,
	impuesto REAL,
	cantidad INT
)
RETURNS INT AS $$
BEGIN

    INSERT INTO
		Producto(
			IdProducto,
			Nombre,
			Descripcion,
			Precio,
			Impuesto,
			Cantidad
		)
	VALUES
		(
			consecutivo,
			nombre,
			descripcion,
			precio,
			impuesto,
			cantidad
		);
	
	RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
