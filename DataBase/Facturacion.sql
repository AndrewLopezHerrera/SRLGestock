CREATE TABLE IF NOT EXISTS Factura (
	IdFactura UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
	Vendedor INT NOT NULL,
	NombreCliente TEXT NOT NULL,
	CorreoElectronicoCliente TEXT NOT NULL,
	IdentificacionCliente TEXT NOT NULL,
	DireccionCliente TEXT NOT NULL,
	Fecha TIMESTAMP NOT NULL,
	SubTotal MONEY NOT NULL,
	Descuento MONEY NOT NULL,
	Total MONEY NOT NULL,
	CONSTRAINT referenciaFacturaEmpleado FOREIGN KEY (Vendedor) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE IF NOT EXISTS DELETE FROM LineaFactura(
	IdLineaFactura Serial NOT NULL,
	IdFactura UUID NOT NULL,
	IdProducto BIGINT NOT NULL,
	Precio MONEY NOT NULL,
	Impuesto REAL NOT NULL,
	Cantidad INT NOT NULL,
	CONSTRAINT referenciaFacturaProducto FOREIGN KEY (IdProducto) REFERENCES Producto(IdProducto),
	CONSTRAINT referenciaFacturaLineaFactura FOREIGN KEY (IdFactura) REFERENCES Factura(IdFactura)
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
	      	'Consecutivo', l.IdProducto::TEXT,
			'Nombre', p.Nombre,
	      	'Precio', l.Precio::NUMERIC,
	      	'Impuesto', l.Impuesto::NUMERIC,
			'Cantidad', l.Cantidad::NUMERIC,
			'Total', (l.Precio::NUMERIC * l.Cantidad::NUMERIC)
	    )
	) AS lineas
FROM
	Factura f
INNER JOIN
	LineaFactura l ON f.IdFactura = l.IdFactura
INNER JOIN
	Usuario u ON f.Vendedor = u.IdUsuario
INNER JOIN
	Producto p ON l.IdProducto = p.IdProducto
GROUP BY
	f.IdFactura,
	u.Nombre,
	u.ApellidoPaterno,
	u.ApellidoMaterno,
	f.DireccionCliente,
	f.NombreCliente,
	f.CorreoElectronicoCliente,
	f.IdentificacionCliente,
	f.Fecha,
	f.SubTotal,
	f.Descuento,
	f.Total;

CREATE OR REPLACE FUNCTION BuscarFactura(pIdFactura TEXT)
RETURNS TABLE(
	"IdFactura" TEXT,
	"NombreCliente" TEXT,
	"Vendedor" TEXT,
	"Fecha" TEXT,
	"Total" NUMERIC
)
AS
$$
BEGIN
	RETURN QUERY SELECT
		f.IdFactura::TEXT AS IdFactura,
		f.NombreCliente,
		f.Vendedor,
		TO_CHAR(f.Fecha, 'DD/MM/YYYY HH24:MI') AS Fecha,
		f.Total::NUMERIC AS Total
	FROM
		FATO f
	WHERE
		f.IdFactura::TEXT LIKE '%' || pIdFactura || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT TO_CHAR(NOW(), 'DD/MM/YYYY HH12:MI:SS AM');

CREATE OR REPLACE FUNCTION CrearFactura(
	pIdentificadorUsuario INT,
	pCedulaCliente TEXT,
	pCorreoElectronico TEXT,
	pNombreCompletoCliente TEXT,
	pDireccionCompletaCliente TEXT,
	pProductos JSON
)
RETURNS TEXT AS
$$
DECLARE
	compra JSON;
	producto RECORD;
	subtotalActual MONEY := 0;
	totalActual MONEY := 0;
	nuevaFactura UUID;
	consecutivo BIGINT;
	cantidadseleccionada INT;
BEGIN
	INSERT INTO FACTURA (
		Vendedor,
		NombreCliente,
		CorreoElectronicoCliente,
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
	)
	RETURNING IdFactura INTO nuevaFactura;

	FOR compra IN
		SELECT * FROM json_array_elements(pProductos)
	LOOP
	    -- Extraemos los valores directamente del JSON
	    consecutivo := (compra ->> 'Consecutivo')::BIGINT;
	    cantidadseleccionada := (compra ->> 'CantidadSeleccionada')::INT;
	    SELECT * INTO producto FROM Producto WHERE IdProducto = consecutivo;
	    INSERT INTO LineaFactura (
	        IdFactura,
	        IdProducto,
	        Precio,
	        Impuesto,
	        Cantidad
	    )
	    VALUES (
	        nuevaFactura,
	        consecutivo,
	        producto.Precio,
	        producto.Impuesto,
	        cantidadseleccionada
	    );
	    totalActual := totalActual + producto.Precio * cantidadseleccionada;
	    subtotalActual := subtotalActual + (producto.Precio - producto.Precio * (producto.Impuesto / 100)) * cantidadseleccionada;
		UPDATE Producto
		SET Cantidad = Cantidad - cantidadseleccionada
		WHERE IdProducto = consecutivo;
		UPDATE RegistroVentas
		SET Cantidad = Cantidad + cantidadseleccionada
		WHERE IdProducto = consecutivo;
	END LOOP;

	UPDATE FACTURA
	SET SubTotal = subtotalActual,
	    Total = totalActual
	WHERE IdFactura = nuevaFactura;
	RETURN nuevaFactura::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.seleccionarfactura(
	pidfactura text)
RETURNS TABLE(
	"IdFactura" text,
	"NombreCliente" text,
	"DireccionCliente" text,
	"IdentificacionCliente" text,
	"CorreoElectronicoCliente" text,
	"Vendedor" text,
	"Fecha" text,
	"SubTotal" numeric,
	"Descuento" numeric,
	"Total" numeric,
	"Lineas" json) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
	RETURN QUERY SELECT
		f.IdFactura::TEXT AS IdFactura,
		f.NombreCliente,
		f.DireccionCliente,
		f.IdentificacionCliente,
		f.CorreoElectronicoCliente,
		f.Vendedor,
		TO_CHAR(f.Fecha, 'DD/MM/YYYY HH24:MI') AS Fecha,
		f.SubTotal::Numeric AS SubTotal,
		f.Descuento::NUMERIC,
		f.Total::NUMERIC AS Total,
		f.Lineas
	FROM
		FATO f
	WHERE
		f.IdFactura::TEXT = pIdFactura;
END;
$BODY$;

ALTER FUNCTION public.seleccionarfactura(text)
    OWNER TO postgres;