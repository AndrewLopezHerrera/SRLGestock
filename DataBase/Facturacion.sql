CREATE TABLE IF NOT EXISTS Factura (
	IdFactura UUID PRIMARY KEY NOT NULL,
	Vendedor INT NOT NULL,
	CedulaCliente VARCHAR(10) NOT NULL,
	CorreoElectronicoCliente VARCHAR(50) NOT NULL,
	NombreCliente VARCHAR(50) NOT NULL,
	PrimerApellidoCliente VARCHAR(50) NOT NULL,
	SegundoApellidoCliente VARCHAR(50) NOT NULL,
	Descuento REAL NOT NULL,
	SubTotal REAL NOT NULL,
	Total REAL NOT NULL,
	CONSTRAINT referenciaVendedorFctura FOREIGN KEY (Vendedor) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE IF NOT EXISTS LineaFactura (
	IdLineaFactura SERIAL NOT NULL,
	IdFactura UUID NOT NULL,
	IdProducto BIGINT NOT NULL,
	Cantidad INT NOT NULL,
	CONSTRAINT referenciaLineaFactura FOREIGN KEY (IdFactura) REFERENCES Factura(IdFactura),
	CONSTRAINT referenciaLineaFacturaProducto FOREIGN KEY (IdProducto) REFERENCES Producto(IdProducto)
);

CREATE OR REPLACE VIEW FATO AS
	SELECT
		*
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
	