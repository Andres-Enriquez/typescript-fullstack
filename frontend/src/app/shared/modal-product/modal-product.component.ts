// Modulos de angular
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Modulos de boostrap
import * as bootstrap from 'bootstrap';

// Modelo de datos
import { Producto } from 'src/app/models/product';

// Servicios
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.css'],
})
export class ModalProductComponent implements OnInit {
  @Output() newItemProduct = new EventEmitter<Boolean>();
  public productForm: FormGroup;
  public productModal: bootstrap.Modal;
  private product?: Producto;

  constructor(
    private _productService: ProductService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Inicializar formulario
    this.initForm();
  }

  // Inicializacion del formulario
  initForm() {
    this.productForm = new FormGroup({
      reference: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      count: new FormControl('', [Validators.required, Validators.min(1)]),
      price: new FormControl('', [Validators.required, Validators.min(500)]),
    });
  }

  /*---------------------------Validaciones del Formulario --------------------- */

  // Resaltar en el campo referencia en rojo si no es valido
  get referenceNotValid() {
    return (
      this.productForm.get('reference').invalid &&
      this.productForm.get('reference').touched
    );
  }

  // Resaltar en el campo descripción en rojo si no es valido
  get descNotValid() {
    return (
      this.productForm.get('description').invalid &&
      this.productForm.get('description').touched
    );
  }

  // Resaltar en el campo cantidad en rojo si no es valido
  get countNotValid() {
    return (
      this.productForm.get('count').invalid &&
      this.productForm.get('count').touched
    );
  }

  // Resaltar en el campo precio en rojo si no es valido
  get priceNotValid() {
    return (
      this.productForm.get('price').invalid &&
      this.productForm.get('price').touched
    );
  }

  /*------------------------------------------------------------------------- */

  /*--------------------------- Logica del componente --------------------- */

  // Abrir el modal para agregar  un producto
  openModal(product?: Producto) {
    // Verificar si contiene datos esto quiere decir que es para actualizar los datos
    // de lo contrario es para crear un nuevo producto
    if (product != undefined) {
      this.product = new Producto().deserialize(product);
      // Establecer información en el formulario
      this.setProduct(this.product);
    } else {
      this.product = undefined;
    }

    // Abrir el modal
    this.productModal = new bootstrap.Modal(
      document.getElementById('productModal'),
      {
        keyboard: false,
        backdrop: 'static',
      }
    );
    // Mostrar componente
    this.productModal.show();
  }

  // Establecer la informacion del producto en el formulario
  setProduct(product: Producto) {
    this.productForm.get('reference').disable();
    this.productForm.get('reference').setValue(product.referencia);
    this.productForm.get('description').setValue(product.descripcion);
    this.productForm.get('count').setValue(product.cantidad);
    this.productForm.get('price').setValue(product.precio);
  }

  // Cerrar el modal de agregar producto
  closeModal() {
    this.productModal.hide();
    this.productForm.reset();
  }

  // Guardar los datos del producto
  saveData() {
    // Mostrar alerta de espera
    this._alertService.showWaitAlert();

    // Construyendo la informacion del producto
    const product = new Producto();
    product.referencia = String(this.productForm.get('reference').value).trim();
    product.descripcion = String(
      this.productForm.get('description').value
    ).trim();
    product.cantidad = this.productForm.get('count').value;
    product.precio = this.productForm.get('price').value;

    // Verificar si es para actualizar o agregar un producto nuevo
    if (this.product != undefined) {
      // Establecer el id del product
      product.id = this.product.id;
      // Actualizar producto
      this._productService.updateProduct(product).subscribe((res: any) => {
        // Operacion en el formulario
        this.operationForm();
        // Mostrar alerta de exito
        this._alertService.showMessageSuccess(
          'Producto',
          'Actualizado con exito'
        );
      });
    } else {
      // Crear producto
      this._productService.crearProducto(product).subscribe((res: any) => {
        if (res.producto != null) {
          // Operacion en el formulario
          this.operationForm();
          // Mostrar alerta de exito
          this._alertService.showMessageSuccess(
            'Producto',
            'Guardado con exito'
          );
        } else {
          // Mostrar alerta de advertencia
          this._alertService.showMessageWarning(
            'Producto Duplicado',
            `Ya se encuentra este producto registrado con la referencia ${product.referencia}`
          );
        }
      });
    }
  }

  // Operaciones para ocultar, limpiar el formulario y enviar el evento al componente padre
  operationForm() {
    // Ocultar la ventana producto
    this.productModal.hide();
    // Limpiar los campos del formulario
    this.productForm.reset();
    // Enviar evento de que se agrego un nuevo producto
    this.newItemProduct.emit(true);
  }

  /*------------------------------------------------------------------------- */
}
