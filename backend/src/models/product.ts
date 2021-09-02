export class Producto {
    id?: string;
    descripcion?: string;
    referencia?: string;
    cantidad: number;
    precio: number;

    constructor() {
        this.cantidad = 0;
        this.precio = 0;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}