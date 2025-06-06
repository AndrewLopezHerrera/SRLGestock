CREATE TABLE IF NOT EXISTS Producto(
	IdProducto BIGINT PRIMARY KEY NOT NULL,
	Nombre VARCHAR(50) NOT NULL,
	Descripcion TEXT NOT NULL,
	Precio MONEY NOT NULL,
	Impuesto REAL NOT NULL,
	Cantidad INT NOT NULL
);

CREATE TABLE IF NOT EXISTS RegistroVentas(
	IdProducto BIGINT PRIMARY KEY NOT NULL,
	Cantidad INT NOT NULL,
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
	consecutivo BIGINT,
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
	INSERT INTO
		RegistroVentas(
			IdProducto,
			Cantidad
		)
	VALUES
		(
			consecutivo,
			0
		);
	
	RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION BuscarProducto(
	pConsecutivo VARCHAR,
	pNombre VARCHAR
)
RETURNS TABLE (
	"Consecutivo" TEXT,
	"Nombre" VARCHAR,
	"Ventas" INT
)
AS $$
BEGIN
	IF pConsecutivo <> '' THEN
    	RETURN QUERY SELECT
			PRCO.Consecutivo::text,
			PRCO.Nombre,
			PRCO.Ventas
		FROM
			PRCO
		WHERE
			PRCO.Consecutivo::text ILIKE '%' || pConsecutivo || '%'
		LIMIT 30;
	ELSIF pNombre <> '' THEN
		RETURN QUERY SELECT
			PRCO.Consecutivo::text,
			PRCO.Nombre,
			PRCO.Ventas
		FROM
			PRCO
		WHERE
			PRCO.Nombre ILIKE '%' || pNombre || '%'
		LIMIT 30;
	ELSE
	    RETURN QUERY SELECT
			PRCO.Consecutivo::text,
			PRCO.Nombre,
			PRCO.Ventas
		FROM
			PRCO
		LIMIT 30;
	END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION SeleccionarProducto(
	pConsecutivo BIGINT
)
RETURNS TABLE (
	"Consecutivo" TEXT,
	"Nombre" VARCHAR,
	"Descripcion" TEXT,
	"Precio" REAL,
	"Impuesto" REAL,
	"Cantidad" INT
)
AS $$
BEGIN
	RETURN QUERY SELECT
		p.Consecutivo::TEXT,
		p.Nombre,
		p.Descripcion,
		(p.Precio::NUMERIC)::REAL,
		p.Impuesto,
		p.Cantidad
	FROM
		PRCO p
	WHERE
		p.Consecutivo = pConsecutivo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION EliminarProducto(
	pConsecutivo BIGINT
)
RETURNS INT AS $$
BEGIN
	DELETE FROM
		RegistroVentas
	WHERE
		RegistroVentas.IdProducto = pConsecutivo;
	DELETE FROM
		Producto
	WHERE
		Producto.IdProducto = pConsecutivo;
	RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION EditarProducto(
	consecutivo BIGINT,
	nombre VARCHAR,
	descripcion TEXT,
	precio MONEY,
	impuesto REAL,
	cantidad INT
)
RETURNS INT AS $$
BEGIN

    UPDATE Producto
    SET
        Nombre = nombre,
        Descripcion = descripcion,
        Precio = precio,
        Impuesto = impuesto,
        Cantidad = Cantidad + cantidad
    WHERE
        IdProducto = consecutivo;
	
	RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
