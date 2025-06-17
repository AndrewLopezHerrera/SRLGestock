import { Breakpoint, Button, Cascader, CascaderProps, Form, Input, InputNumber, Modal, Spin, Table } from "antd";
import "./PantallaFacturacion.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import eliminarIcono from "../images/EliminarIcono.png"
import LineaFactura from "./LineaFactura";
import ProductoLista from "../ModuloInventario/ProductoLista";
import { CrearFacturaAux, TraerProductosCoincidencias } from "./FuncionesAuxiliaresCrearFactura";
import CoincidenciaBusqueda from "./CoincidenciaBusqueda";
import Producto from "../ModuloInventario/Producto";
import { seleccionarProductoAux } from "../ModuloInventario/FuncionesAuxiliaresEditarProducto";
import { DefaultOptionType } from "antd/es/select";
import Factura from "./Factura";

function PantallaFacturacion(){
  const navegador = useNavigate();
  const [resultados, setResultados] = useState<CoincidenciaBusqueda[]>([]);
  const [lineas, setLineas] = useState<LineaFactura[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const [cedula, setCedula] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [nombre, setNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [provincia, setProvincia] = useState('');
  const [canton, setCanton] = useState('');
  const [distrito, setDistrito] = useState('');
  const [senas, setSenas] = useState('');
  const encabezados = [
    {
      title: 'Consecutivo',
      dataIndex: 'Consecutivo',
      key: 'Consecutivo',
      responsive: ['md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Cantidad',
      dataIndex: 'Cantidad',
      render: (_ : undefined, lineaFactura : LineaFactura) => (
        <InputNumber
          min={1}
          max={lineaFactura.Cantidad}
          defaultValue={1}
          onChange={(valor) => {actualizarTotalProducto(lineaFactura.Consecutivo, valor)}}/>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Precio',
      dataIndex: 'Precio',
      key: 'Precio',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Impuesto',
      dataIndex: 'Impuesto',
      key: 'Impuesto',
      responsive: ['md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'total',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: '',
      key: 'eliminar',
      render: (_ : undefined, producto : LineaFactura) => (
        <Button onClick={() => {eliminarLinea(producto.Consecutivo)}} className="botonEliminarLinea">
          <img src={eliminarIcono} className="imagenEliminarLinea" />
        </Button>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
  ]

  const actualizarTotalProducto = (consecutivo : number , cantidadSeleccionada : number | null) => {
    if(cantidadSeleccionada != null){
      setLineas(prev =>
        prev.map(p =>
          p.Consecutivo === consecutivo ? {
            ...p,
            CantidadSeleccionada: cantidadSeleccionada,
            Total: cantidadSeleccionada * p.Precio
          } : p
        )
      );
    }
  };

  const buscarProducto = async (busqueda : string) => {
    if(busqueda.length != 0){
      const lista : ProductoLista[] = await TraerProductosCoincidencias(busqueda);
      const resultadosAux : CoincidenciaBusqueda[] = [];
      lista.forEach(producto => {
        const coincidencia : CoincidenciaBusqueda = {
          value: String(producto.Consecutivo),
          label: producto.Consecutivo + " - " + producto.Nombre
        }
        resultadosAux.push(coincidencia);
      })
      setResultados(resultadosAux);
    }
    else{
      setResultados([]);
    }
  }

  const SeleccionarProducto: CascaderProps<CoincidenciaBusqueda>['onChange'] = async (value) => {
    try{
      const consecutivo : number = Number(value.pop());
      if(!lineas.find(linea => linea.Consecutivo == consecutivo )){
        const producto : Producto = await seleccionarProductoAux(consecutivo);
        if(producto.Cantidad == 0)
          throw new Error("El producto " + producto.Nombre + " no tiene existencias.");
        const lineaFactura : LineaFactura = {
          Consecutivo: producto.Consecutivo,
          Nombre: producto.Nombre,
          Cantidad: producto.Cantidad,
          CantidadSeleccionada: 1,
          Precio: producto.Precio,
          Impuesto: producto.Impuesto,
          Total: producto.Precio
        }
        setLineas([...lineas, lineaFactura]);
      }
      setResultados([]);
    }
    catch (err) {
      setResultados([]);
      setCargando(false);
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al ingresar el producto");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al ingresar el producto");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  };

  const eliminarLinea = (consecutivo : Number) => {
    const nuevaLineas = lineas.filter(linea => linea.Consecutivo !== consecutivo);
    setLineas(nuevaLineas);
  }

  const limpiarFactura = () => {
    setLineas([]);
  }

  const irMenuFacturacion = () => {
    navegador("/menuFacturacion");
  }

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );

  useEffect(() => {
    let subTotalAux = 0;
    let totalAux = 0;
    lineas.forEach(linea => {
      const totalLinea = linea.CantidadSeleccionada * linea.Precio;
      subTotalAux += totalLinea - (totalLinea * (linea.Impuesto / 100));
      totalAux += totalLinea;
    })
    setSubtotal(subTotalAux);
    setTotal(totalAux);
  }, [lineas]);

  const manejarTextoSoloLetras = (valor: string, setValor: (val: string) => void) => {
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (soloLetras.test(valor)) {
      setValor(valor);
    }
  };

  const crearFactura = async() => {
    try{
      if(lineas.length === 0){
        throw new Error("Debe agregar al menos un producto a la factura.");
      }
      setCargando(true)
      const factura : Factura = {
        IdFactura: "",
        NombreCliente: nombre + " " + primerApellido + " " + segundoApellido,
        DireccionCliente: provincia + " " + canton + " " + distrito + " " + senas, 
        IdentificacionCliente: cedula,
        CorreoElectronicoCliente: correoElectronico,
        Vendedor: "",
        Fecha: "",
        SubTotal: 0,
        Descuento: 0,
        Total: 0,
        Lineas: lineas
      };
      const idFactura : string = await CrearFacturaAux(factura);
      navegador("/verFactura/" + idFactura + "/pantallaFacturacion")
    }
    catch (err) {
      setCargando(false);
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al crear la factura");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al crear la factura");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }

  return(
    <div className="contenedorPantallaFacturacion">
      <div className="contenedorTituloBotonVolverMenuInventario">
        <div className="contenedorBotonVolverMiUsuario">
          <Button onClick={irMenuFacturacion} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloMenuInventario">
          <h1 className="tituloMenuInventario">Facturacion</h1>
        </div>
        <div className="contenedorBotonVolverMiUsuario" />
      </div>
      <div className="contenedorCuerpoFacturacion">
        <div className="contenedorInformacionClienteFacturacion">
          <Form className="formularioCliente">
            <div className="tituloInformacionCliente">Información del Cliente</div>

            <Form.Item
              className="formularioItemInformacionCliente"
              rules={[
                {
                  pattern: /^[1-7]\d{8}$/,
                  message: 'Debe ser un número entre 100000000 y 799999999',
                },
              ]}
            >
              <Input
                value={cedula}
                placeholder="Cédula del cliente"
                className="entradaInformacionCliente"
                type="number"
                onChange={(e) => setCedula(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name={"correo"}
              className="formularioItemInformacionCliente"
              rules={[
                { type: 'email', message: 'Correo electrónico no válido' },
              ]}
            >
              <Input
                value={correoElectronico}
                placeholder="Correo Electrónico"
                className="entradaInformacionCliente"
                onChange={(e) => setCorreoElectronico(e.target.value)}
              />
            </Form.Item>
            <Form.Item className="formularioItemInformacionCliente">
              <Input
                value={nombre}
                placeholder="Nombre del cliente"
                className="entradaInformacionCliente"
                onChange={(e) => manejarTextoSoloLetras(e.target.value, setNombre)}
              />
            </Form.Item>

            <Form.Item className="formularioItemInformacionCliente">
              <Input
                value={primerApellido}
                placeholder="Primer apellido"
                className="entradaInformacionCliente"
                onChange={(e) => manejarTextoSoloLetras(e.target.value, setPrimerApellido)}
              />
            </Form.Item>

            <Form.Item className="formularioItemInformacionCliente">
              <Input
                value={segundoApellido}
                placeholder="Segundo apellido"
                className="entradaInformacionCliente"
                onChange={(e) => manejarTextoSoloLetras(e.target.value, setSegundoApellido)}
              />
            </Form.Item>

            <Form.Item className="formularioItemInformacionCliente">
              <Input
                value={provincia}
                placeholder="Provincia"
                className="entradaInformacionCliente"
                onChange={(e) => manejarTextoSoloLetras(e.target.value, setProvincia)}
              />
            </Form.Item>

            <Form.Item className="formularioItemInformacionCliente">
              <Input
                value={canton}
                placeholder="Cantón"
                className="entradaInformacionCliente"
                onChange={(e) => setCanton(e.target.value)}
              />
            </Form.Item>

            <Form.Item className="formularioItemInformacionCliente">
              <Input
                value={distrito}
                placeholder="Distrito"
                className="entradaInformacionCliente"
                onChange={(e) => setDistrito(e.target.value)}
              />
            </Form.Item>

            <Form.Item className="formularioItemInformacionCliente">
              <Input
                value={senas}
                placeholder="Señas exactas"
                className="entradaInformacionCliente"
                onChange={(e) => setSenas(e.target.value)}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="contenedorFacturacion">
          <div className="contenedorEntradaBusquedaProductosFactura" >
            <Cascader
              className="entradaBusquedaProductosFactura"
              options={resultados}
              onChange={SeleccionarProducto}
              showSearch={{ filter }}
              placeholder="Escriba el consecutivo o nombre y seleccione el producto"
              onSearch={(value) => buscarProducto(value)}
              notFoundContent="No se ha ingresado texto"
            />
          </div>
          <div className="contenedorTablaFactura">
            <Table <LineaFactura>
              columns={encabezados}
              dataSource={lineas}
              pagination={false}
              className="tablaFactura"
              scroll={{ y: '45vh' }}
              locale={{ emptyText: 'Sin productos en la factura' }}
            />
          </div>
          <div className="contedorSubtotalTotalFactura">
            <div className="contenedorSubtotal">
              <div className="subTotal"><strong>Subtotal (sin impuestos): ₡{subtotal}</strong></div>
            </div>
            <div className="contenedorTotal">
              <div className="total"><strong>Total: ₡{total}</strong></div>
            </div>
          </div>
          <div className="contenedorBotonesFacturacion">
            <Button color="primary" variant="dashed" onClick={limpiarFactura}>Limpiar Factura</Button>
            <Button type="primary" onClick={crearFactura}>Facturar</Button>
          </div>
        </div>
      </div>
      <Spin spinning={cargando} size="large" fullscreen />
      <Modal
        title={tituloError}
        open={error}
        onOk={() => setError(false)}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{cuerpoError}</p>
      </Modal>
    </div>
  );
}
;
export default PantallaFacturacion;