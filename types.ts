
export enum SueldoTipo {
  MENSUAL = 'Mensual',
  DIARIO = 'Diario',
  HORA = 'Por Hora',
  EMPRESARIAL = 'Empresarial'
}

export enum SaludTipo {
  FONASA = 'Fonasa',
  ISAPRE = 'Isapre'
}

export interface CalculatedPayroll {
  workerId: string;
  periodo: { month: number, year: number };
  haberes: {
    sueldoBase: number;
    gratificacion: number;
    movilizacion: number;
    colacion: number;
    otrosImponibles: number;
  };
  descuentos: {
    afpMonto: number;
    saludMonto: number;
    seguroCesantia: number;
    impuestoUnico: number;
    anticipos: number;
  };
  totales: {
    totalHaberes: number;
    totalImponible: number;
    totalDescuentos: number;
    alcanceLiquido: number;
  };
}

export interface CostCenter {
  id: string;
  codigo: string;
  nombre: string;
}

export interface ContractType {
  id: string;
  nombre: string;
}

export interface TerminationCause {
  id: string;
  articulo: string;
  numero: string;
  nombre: string;
}

export interface PayrollConcept {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'Haber' | 'Descuento';
  isImponible: boolean;
  isTributable: boolean;
  isGratificacion: boolean;
}

export interface Worker {
  id: string;
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaContrato: string;
  cargo: string;
  centroCostoId: string;
  sueldoBase: number;
  tipoSalud: SaludTipo;
  isapreNombre?: string;
  afpNombre: string;
  hasSeguroCesantia: boolean;
  gratificacionTipo: 'Calculada' | 'Informada' | 'Proporcional';
  contractTypeId: string;
}

export interface Company {
  rut: string;
  razonSocial: string;
  codigo: string;
  contador: string;
  rutContador: string;
}

export interface CentralizationVoucher {
  cuentaContable: string;
  descripcion: string;
  debe: number;
  haber: number;
  centroResultado?: string;
}
