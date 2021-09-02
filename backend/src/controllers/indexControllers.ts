// Importando las interaces de express
import { Request, Response } from "express";
// Importando modulos de postgreSQL
import { QueryResult } from "pg";
// Importando la base de datos para realizar peticiones
import { db } from "../database";
// Importando el modelo de datos
import { Producto } from "../models/product";

// Punto final para crear un nuevo producto
export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Obtener los datos enviados desde el formulario
    const producto = new Producto().deserialize(req.body);

    // Consultar en la base de datos si la referencia a crear no existe
    const result: QueryResult = await db.query(
      "SELECT * FROM producto WHERE LOWER(referencia) = $1",
      [producto.referencia?.toLowerCase()]
    );

    // Verificar si ya existe este producto
    if (result.rows.length > 0) {
      return res.status(200).json({
        message: `Este producto no se puede registrar ya se encuentra un producto con esta referencia ${producto.referencia}`,
        producto: null,
      });
    }

    // // Realizacion de query para guardar datos
    await db.query(
      "INSERT INTO producto (descripcion, referencia, precio, cantidad ) VALUES ($1, $2, $3, $4)",
      [
        producto.descripcion,
        producto.referencia,
        producto.precio,
        producto.cantidad,
      ]
    );
    // Retornar la respuesta al cliente
    return res.status(200).json({
      message: "Producto agregado exitosamente",
      producto,
    });
  } catch (error) {
    // Capturar error de la peticion
    console.error(error);
    return res.status(500).json("Ocurrió un error interno en el servidor");
  }
};

// Punto final para obtener una lista de productos
export const getProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Realizacion de query para consultar los productos
    const resultado: QueryResult = await db.query("SELECT * FROM producto");
    // Creando una lista de productos vacia
    let listProduct: Producto[] = [];
    // Obtener la lista de productos de la base de datos
    listProduct = resultado.rows;
    // Retornar la respuesta al cliente
    return res.status(200).json(listProduct);
  } catch (error) {
    // Capturar error de la petición
    console.error(error);
    return res.status(500).json("Ocurrió un error interno en el servidor");
  }
};

// Punto final para eliminar un producto
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Obtener el id del producto
    const id = req.params.id;
    await db.query("DELETE FROM producto where id = $1", [id]);
    return res.status(200).json("Producto eliminado exitosamente");
  } catch (error) {
    // Capturar error de la petición
    console.error(error);
    return res.status(500).json("Ocurrió un error interno en el servidor");
  }
};

// Punto final para consultar un producto por referencia
// export const getProductById = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     // Obtener la referencia a consultar
//     const ref = req.params.id;
//     // Consultar en la base de datos por referencia
//     const result: QueryResult = await db.query(
//       "SELECT * FROM producto WHERE referencia = $1",
//       [ref]
//     );
//     return res.status(200).json(result.rows);
//   } catch (error) {
//     // Capturar error de la petición
//     console.error(error);
//     return res.status(500).json("Ocurrió un error interno en el servidor");
//   }
// };

// Punto final para actualizar un producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Obtener el id del producto
    const id = parseInt(req.params.id);
    // Obtener los datos enviados desde el formulario
    const producto = new Producto().deserialize(req.body);
    // Actualizar en la base de datos
    await db.query(
      "UPDATE producto SET descripcion = $1, cantidad = $2, precio = $3 WHERE id = $4",
      [producto.descripcion, producto.cantidad, producto.precio, id]
    );
    return res.status(200).json("Producto actualizado exitosamente");
  } catch (error) {
    // Capturar error de la petición
    console.error(error);
    return res.status(500).json("Ocurrió un error interno en el servidor");
  }
};
