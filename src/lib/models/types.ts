import { ObjectId } from 'mongodb'

export interface Disponibilidad {
  _id?: ObjectId
  fecha: Date
  horaInicio: string   // "10:00"
  horaFin: string      // "12:00"
  disponible: boolean
  creadoEn: Date
}

export interface Reserva {
  _id?: ObjectId
  disponibilidadId: ObjectId
  nombreCliente: string
  emailCliente: string
  telefonoCliente: string
  stripeSessionId: string
  estado: 'pendiente' | 'pagado' | 'confirmado' | 'cancelado'
  monto: number        // in cents
  notas?: string
  creadoEn: Date
}
