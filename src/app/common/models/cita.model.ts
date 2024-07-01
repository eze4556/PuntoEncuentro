import { Timestamp } from '@firebase/firestore';

export interface Citas {
  id: string;
  servicio_id: string;
  cliente_id: string;
  proveedor_id: string;
  fecha_cita: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  notas: string;
}
