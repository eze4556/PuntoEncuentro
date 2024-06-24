export interface User {
  id: string;
  nombre: string;
  correo: string;
  tipo_usuario: 'cliente' | 'proveedor'
  fecha_registro: Date;
}
