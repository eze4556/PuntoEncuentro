
export interface Citas {
  id: string;
  servicio_id: string;
  cliente_id: string;
  fecha_cita: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  notas: string;
}
