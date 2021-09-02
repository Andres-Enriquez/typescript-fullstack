import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Producto } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Solamente lectura
  readonly URL_API = "http://localhost:8000/api/product";

  constructor(private http: HttpClient) {}

  // Consumir api para crear un producto
  crearProducto(producto: Producto) {
    return this.http.post(this.URL_API, producto);
  }

  // Consumir api para mostrar la lista de producto
  listaProducto() {
    return this.http.get<Producto[]>(this.URL_API);
  }

  // Consumir api para eliminar un producto
  deleteProduct(id: number) {
    return this.http.delete(this.URL_API + `/${id}`);
  }

  // Consumiar api para actualizar un producto
  updateProduct(product: Producto) {
    return this.http.put(this.URL_API + `/${product.id}`, product);
  }
}
