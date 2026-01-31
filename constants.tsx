
import React from 'react';
import { LayoutDashboard, Users, FileText, Database, PieChart, Calculator, Truck } from 'lucide-react';
import { CostCenter, ContractType, TerminationCause, PayrollConcept } from './types.ts';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'archivo', label: 'Archivo', icon: <Database size={20} />, subItems: [
    { id: 'empresa', label: 'Creación de Empresa' },
    { id: 'trabajadores', label: 'Trabajadores' },
    { id: 'costos', label: 'Centros de Costos' },
    { id: 'contratos', label: 'Tipos de Contrato' },
    { id: 'causales', label: 'Causales de Finiquito' },
    { id: 'haberes', label: 'Haberes y Descuentos' }
  ]},
  { id: 'movimientos', label: 'Movimientos', icon: <Calculator size={20} />, subItems: [
    { id: 'parametros', label: 'Parámetros Mensuales' },
    { id: 'mensual', label: 'Movimiento Mensual' },
    { id: 'calculo', label: 'Proceso de Cálculo' }
  ]},
  { id: 'liquidaciones', label: 'Liquidaciones', icon: <FileText size={20} /> },
  { id: 'centralizacion', label: 'Centralización', icon: <Truck size={20} /> },
  { id: 'informes', label: 'Informes', icon: <PieChart size={20} /> },
];

export const MOCK_CONCEPTS: PayrollConcept[] = [
  { id: 'h1', codigo: '001', nombre: 'Sueldo Base', tipo: 'Haber', isImponible: true, isTributable: true, isGratificacion: false },
  { id: 'h2', codigo: '005', nombre: 'Asignación de Movilización', tipo: 'Haber', isImponible: false, isTributable: false, isGratificacion: false },
  { id: 'h3', codigo: '006', nombre: 'Asignación de Colación', tipo: 'Haber', isImponible: false, isTributable: false, isGratificacion: false },
  { id: 'h4', codigo: '010', nombre: 'Bono de Producción', tipo: 'Haber', isImponible: true, isTributable: true, isGratificacion: true },
  { id: 'd1', codigo: '501', nombre: 'Anticipo de Sueldo', tipo: 'Descuento', isImponible: false, isTributable: false, isGratificacion: false },
  { id: 'd2', codigo: '505', nombre: 'Préstamo Empresa', tipo: 'Descuento', isImponible: false, isTributable: false, isGratificacion: false },
];

export const MOCK_COMPANY = {
  rut: '76.123.456-7',
  razonSocial: 'Empresa Demo Transtecnia S.A.',
  codigo: '001',
  contador: 'Juan Perez',
  rutContador: '12.345.678-9'
};

export const MOCK_COST_CENTERS: CostCenter[] = [
  { id: 'cc1', codigo: '100', nombre: 'Administración' },
  { id: 'cc2', codigo: '200', nombre: 'Ventas' },
  { id: 'cc3', codigo: '300', nombre: 'Operaciones' }
];

export const MOCK_CONTRACT_TYPES: ContractType[] = [
  { id: 'ct1', nombre: 'Indefinido' },
  { id: 'ct2', nombre: 'Plazo Fijo' },
  { id: 'ct3', nombre: 'Por Obra o Faena' }
];

export const MOCK_TERMINATION_CAUSES: TerminationCause[] = [
  { id: 'tc1', articulo: '159', numero: '1', nombre: 'Mutuo acuerdo de las partes' },
  { id: 'tc2', articulo: '159', numero: '2', nombre: 'Renuncia del trabajador' },
  { id: 'tc3', articulo: '161', numero: '0', nombre: 'Necesidades de la empresa' }
];

export const MOCK_WORKERS = [
  {
    id: '1',
    rut: '18.999.888-7',
    nombre: 'Sebastián',
    apellidoPaterno: 'Opazo',
    apellidoMaterno: 'Candia',
    fechaContrato: '2022-01-01',
    cargo: 'Contador',
    centroCostoId: 'cc1',
    sueldoBase: 850000,
    tipoSalud: 'Fonasa',
    afpNombre: 'Provida',
    hasSeguroCesantia: true,
    gratificacionTipo: 'Calculada',
    contractTypeId: 'ct1'
  }
];
