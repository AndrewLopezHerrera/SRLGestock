CREATE TABLE IF NOT EXISTS FACTURA (
	IdFactura UUID NOT NULL,
	Vendedor INT NOT NULL,
	NombreCliente TEXT NOT NULL,
	CorreoElectronicoCliente NOT NULL,
	IdentificacionCliente TEXT NOT NULL,
	DireccionCliente TEXT NOT NULL,
	Fecha TIMESTAMP NOT NULL,
	SubTotal MONEY NOT NULL,
	Descuento MONEY NOT NULL,
	Total MONEY NOT NULL
);

CREATE TABLE IF NOT EXISTS LineaFactura(
	IdLineaFactura Serial NOT NULL,
	IdFactura UUID NOT NULL,
	IdProducto INT NOT NULL,
	Precio MONEY NOT NULL,
	Impuesto REAL NOT NULL,
	Cantidad INT NOT NULL
);

CREATE OR REPLACE VIEW FATO AS
	SELECT
		f.IdFactura,
		u.Nombre || ' ' || u.ApellidoPaterno || ' ' || u.ApellidoMaterno AS Vendedor,
		f.DireccionCliente,
		f.NombreCliente,
		f.CorreoElectronicoCliente,
		f.IdentificacionCliente,
		f.Fecha,
		f.SubTotal,
		f.Descuento,
		f.Total,
		json_agg(
		    json_build_object(
		      	'IdProducto', l.IdProducto,
		      	'Precio', l.Precio,
		      	'Impuesto', l.Impuesto,
				'Cantidad' l.Cantidad
		    )
		) AS lineas
	FROM
		Factura f
	INNER JOIN
		LineaFactura l
	ON
		f.IdFactura = l.IdFactura
	INNER JOIN
		Usuario u
	ON
		f.Vendedor = u.IdUsuario
	INNER JOIN
		Producto p
	ON
		l.IdProducto = p.IdProducto

CREATE OR REPLACE FUNCTION BuscarFactura(pIdFactura TEXT)
RETURNS(
	"IdFactura" TEXT,
	"NombreCliente" TEXT,
	"Vendedor" TEXT,
	"Fecha" TEXT,
	"Total" NUMERIC
)
AS
$$
BEGIN
	SELECT
		IdFactura::TEXT AS IdFactura,
		NombreCliente,
		Vendedor,
		Fecha::TEXT AS Fecha,
		Total::NUMERIC AS Total
	FROM
		FATO
	WHERE
		f.IdFactura::TEXT LIKE '%' || pIdFactura || '%'
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION CrearFactura(
	pIdentificadorUsuario INT,
	pCedulaCliente TEXT,
	pCorreoElectronico TEXT,
	pNombreCompletoCliente TEXT,
	pDireccionCompletaCliente TEXT,
	pProductos JSON
)
INT AS
$$
DECLARE
	compra RECORD;
	producto RECORD;
	subtotal MONEY := 0;
	total MONEY := 0;
	nuevaFactura UUID;
BEGIN
	INSERT INTO FACTURA (
		Vendedor,
		NombreCliente,
		CorreoElectronicoClient,
		IdentificacionCliente,
		DireccionCliente,
		Fecha,
		SubTotal,
		Descuento,
		Total
	)
	VALUES (
		pIdentificadorUsuario,
		pNombreCompletoCliente,
		pCorreoElectronico,
		pCedulaCliente,
		pDireccionCompletaCliente,
		CURRENT_TIMESTAMP,
		0,
		0,
		0
	);
	RETURNING IdFactura INTO nuevaFactura;
  	FOR r IN
    	SELECT * FROM json_to_recordset(items)
      	AS x(consecutivo INT, cantidad INT)
  	LOOP
	  	SELECT * INTO producto FROM Producto WHERE id = r.consecutivo;
	  	INSERT INTO LineaFactura(
			IdFactura,
			IdProducto INT NOT NULL,
			Precio MONEY NOT NULL,
			Impuesto REAL NOT NULL,
			CANTIDAD INT NOT NULL
		)
    	VALUES (IdFactura, compra.consecutivo, PRCO.Precio, PRCO.Impuesto, compra.cantidad);
		total += PRCO.Precio * compra.cantidad;
		subtotal += (PRCO.Precio - PRCO.Precio * (PRCO.Impuesto / 100)) * compra.cantidad;
  	END LOOP;
	UPDATE FACTURA
	SET SubTotal = subtotal,
	    Total = total
	WHERE IdFactura = nuevaFactura;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

