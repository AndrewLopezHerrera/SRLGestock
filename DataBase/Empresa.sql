CREATE TABLE IF NOT EXISTS Empresa(
  IdEmpresa INT PRIMARY KEY NOT NULL,
  Cedula TEXT UNIQUE NOT NULL,
  Nombre TEXT UNIQUE NOT NULL,
  TipoEmpresa TEXT NOT NULL,
  Telefono TEXT UNIQUE NOT NULL,
  Fax TEXT UNIQUE NOT NULL,
  Correo TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Direccion(
	IdEmpresa INT PRIMARY KEY NOT NULL,
	Provincia VARCHAR(50) NOT NULL,
	Canton VARCHAR(50) NOT NULL,
	Distrito VARCHAR(50) NOT NULL,
	Senas VARCHAR(50) NOT NULL,
	CONSTRAINT referenciaEmpresaDireccion FOREIGN KEY (IdEmpresa) REFERENCES Empresa(IdEmpresa)
);

CREATE OR REPLACE VIEW EMEX AS
  SELECT
	e.IdEmpresa,
    e.Cedula,
    e.Nombre,
    e.TipoEmpresa,
    e.Telefono,
    e.Fax,
    e.Correo,
    d.Provincia,
    d.Canton,
    d.Distrito,
    d.Senas
  FROM Empresa e
  INNER JOIN Direccion d ON e.IdEmpresa = d.IdEmpresa;

CREATE OR REPLACE FUNCTION SeleccionarEmpresa(pIdEmpresa INT)
RETURNS TABLE (
  "IdEmpresa" INT,
  "Cedula" TEXT,
  "Nombre" TEXT,
  "TipoEmpresa" TEXT,
  "Telefono" TEXT,
  "Fax" TEXT,
  "Correo" TEXT,
  "Provincia" TEXT,
  "Canton" TEXT,
  "Distrito" TEXT,
  "Senas" TEXT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.IdEmpresa,
    e.Cedula,
    e.Nombre,
    e.TipoEmpresa,
    e.Telefono,
    e.Fax,
    e.Correo,
    e.Provincia::TEXT,
    e.Canton::TEXT,
    e.Distrito::TEXT,
    e.Senas::TEXT
  FROM
  	EMEX e
  WHERE
    e.idEmpresa = pIdEmpresa;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION ActualizarEmpresa(
  p_id INT,
  p_cedula TEXT,
  p_nombre TEXT,
  p_tipo_empresa TEXT,
  p_telefono TEXT,
  p_fax TEXT,
  p_correo TEXT,
  p_provincia TEXT,
  p_canton TEXT,
  p_distrito TEXT,
  p_senas TEXT
)
RETURNS VOID
AS $$
BEGIN
  -- Actualizar tabla Empresa
  UPDATE Empresa
  SET
    Cedula = p_cedula,
    Nombre = p_nombre,
    TipoEmpresa = p_tipo_empresa,
    Telefono = p_telefono,
    Fax = p_fax,
    Correo = p_correo
  WHERE IdEmpresa = p_id;

  -- Actualizar tabla Direccion
  UPDATE Direccion
  SET
    Provincia = p_provincia::TEXT,
    Canton = p_canton::TEXT,
    Distrito = p_distrito::TEXT,
    Senas = p_senas::TEXT
  WHERE IdEmpresa = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;