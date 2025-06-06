import { Breakpoint, Button, Cascader, CascaderProps, Input, InputNumber, Table } from "antd";
import "./PantallaFacturacion.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import eliminarIcono from "../images/EliminarIcono.png"
import LineaFactura from "./LineaFactura";
import ProductoLista from "../ModuloInventario/ProductoLista";
import { TraerProductosCoincidencias } from "./FuncionesAuxiliaresCrearFactura";
import CoincidenciaBusqueda from "./CoincidenciaBusqueda";
import Producto from "../ModuloInventario/Producto";
import { seleccionarProductoAux } from "../ModuloInventario/FuncionesAuxiliaresEditarProducto";
import { DefaultOptionType } from "antd/es/select";

function PantallaFacturacion(){
  const navegador = useNavigate();
  const [resultados, setResultados] = useState<CoincidenciaBusqueda[]>([]);
  const [lineas, setLineas] = useState<LineaFactura[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
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
    const consecutivo : number = Number(value.pop());
    if(!lineas.find(linea => linea.Consecutivo == consecutivo )){
      const producto : Producto = await seleccionarProductoAux(consecutivo);
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
          <div className="tituloInformacionCliente" >Información del Cliente</div>
          <Input id="cedula" placeholder="Cédula del cliente" className="entradaInformacionCliente" />
          <Input id="correoElectronico" placeholder="Correo Electrónico" className="entradaInformacionCliente" />
          <Input id="nombre" placeholder="Nombre del cliente" className="entradaInformacionCliente" />
          <Input id="primerApellido" placeholder="Primer apellido" className="entradaInformacionCliente" />
          <Input id="segundoApellido" placeholder="Segundo apellido" className="entradaInformacionCliente" />
          <Input id="provincia" placeholder="Provincia" className="entradaInformacionCliente" />
          <Input id="canton" placeholder="Canton" className="entradaInformacionCliente" />
          <Input id="provincia" placeholder="Provincia" className="entradaInformacionCliente" />
          <Input id="senas" placeholder="Señas exactas" className="entradaInformacionCliente" />
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
            <Table
              columns={encabezados}
              dataSource={lineas}
              pagination={false}
              className="tablaFactura"
              scroll={{ y: 250}}
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
            <Button type="primary">Facturar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
;
export default PantallaFacturacion;