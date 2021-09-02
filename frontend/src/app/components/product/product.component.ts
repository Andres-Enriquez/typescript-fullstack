// Modulos de angular
import { Component, OnInit, ViewChild } from '@angular/core';
// Modelo de datos
import { Producto } from 'src/app/models/product';
// Servicio
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';
// Componentes
import { ModalProductComponent } from 'src/app/shared/modal-product/modal-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @ViewChild(ModalProductComponent) modalProduct: ModalProductComponent;
  public listProduct: Producto[];

  constructor(
    private _productService: ProductService,
    private _alertService: AlertService
  ) {
    // Inicializacion de variables
    this.listProduct = [];
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  // Metodo para obtener la lista de productos
  obtenerProductos() {
    this._productService.listaProducto().subscribe((res) => {
      this.listProduct = res;
    });
  }

  // Metodo para eliminar un producto
  async deleteProduct(id: number) {
    // Subtitulo de la alerta
    const text = 'Esta seguro que desea eliminar el producto';
    // Texto para mostrar en el boton de confirmar
    const textBtnConfirm = 'Si, eliminar';
    // Generar alerta de confirmacion
    const result = await this._alertService.alertConfirmation(
      'Eliminar producto',
      text,
      textBtnConfirm
    );
    if (result.isConfirmed) {
      this._productService.deleteProduct(id).subscribe((res) => {
        this._alertService.showMessageSuccess(
          'Producto Eliminado',
          'Se elimino exitosamente'
        );
        // Actualizar la lista
        this.obtenerProductos();
      });
    }
  }

  // Metodo para actualizar un producto
  updateProduct(product: Producto) {
    this.modalProduct.openModal(product);
  }

  // Escuchar el evento de nuevo producto agregado
  addProduct(newProduct: boolean) {
    // Actualizar la lista
    this.obtenerProductos();
  }
}
