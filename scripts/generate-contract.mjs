#!/usr/bin/env node
// Genera un contrato de inversión profesional Disart Energy ↔ Inversionista
// para una franquicia de electrolinera en Colombia.
//
// IMPORTANTE: documento de plantilla. Debe ser revisado y adaptado por un
// abogado colombiano licenciado antes de su firma. No constituye asesoría
// legal vinculante.
//
// Output: disart-contrato-inversion.docx

import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageOrientation, LevelFormat, NumberFormat, Footer, Header, PageNumber,
} from 'docx';
import { writeFile } from 'node:fs/promises';

// ============================================================================
// Helpers
// ============================================================================
const FONT = 'Calibri';
const FONT_HEADING = 'Calibri';

const p = (text, opts = {}) => new Paragraph({
  alignment: opts.align ?? AlignmentType.JUSTIFIED,
  spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: 300 },
  indent: opts.indent ? { firstLine: 720 } : undefined,
  children: [new TextRun({ text, font: FONT, size: opts.size ?? 22, bold: opts.bold ?? false, italics: opts.italics ?? false })],
});

const bold = (text) => new TextRun({ text, font: FONT, size: 22, bold: true });
const run  = (text, opts = {}) => new TextRun({ text, font: FONT, size: 22, bold: opts.bold ?? false, italics: opts.italics ?? false });

const pMulti = (runs, opts = {}) => new Paragraph({
  alignment: opts.align ?? AlignmentType.JUSTIFIED,
  spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: 300 },
  indent: opts.indent ? { firstLine: 720 } : undefined,
  children: runs,
});

const heading = (text, level = HeadingLevel.HEADING_1) => new Paragraph({
  alignment: AlignmentType.LEFT,
  heading: level,
  spacing: { before: 280, after: 160 },
  children: [new TextRun({ text, font: FONT_HEADING, size: 26, bold: true, color: '0D3A23' })],
});

const clauseTitle = (text) => new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { before: 280, after: 120 },
  children: [new TextRun({ text, font: FONT_HEADING, size: 24, bold: true, color: '0D3A23' })],
});

const title = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text, font: FONT_HEADING, size: 32, bold: true, color: '0D3A23' })],
});

const subtitle = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 280 },
  children: [new TextRun({ text, font: FONT_HEADING, size: 22, bold: false, color: '4F5C55' })],
});

const bullet = (text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 0, after: 100, line: 280 },
  bullet: { level: 0 },
  children: [new TextRun({ text, font: FONT, size: 22 })],
});

const numbered = (text, num) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 0, after: 100, line: 280 },
  indent: { left: 720, hanging: 360 },
  children: [
    new TextRun({ text: `${num}. `, font: FONT, size: 22, bold: true }),
    new TextRun({ text, font: FONT, size: 22 }),
  ],
});

// ============================================================================
// Contenido del contrato
// ============================================================================

const sections = [];

// Encabezado
sections.push(title('CONTRATO DE INVERSIÓN PRIVADA'));
sections.push(subtitle('PARTICIPACIÓN ACCIONARIA EN ELECTROLINERA — FRANQUICIA DISART ENERGY'));
sections.push(p('Bogotá D.C., Colombia · _____ de ____________ de 2026', { align: AlignmentType.CENTER, italics: true }));
sections.push(p(' ', { after: 200 }));

// COMPARECIENTES
sections.push(clauseTitle('COMPARECIENTES'));
sections.push(p('Entre los suscritos a saber:'));
sections.push(pMulti([
  bold('DISART ENERGY S.A.S.'),
  run(', sociedad comercial constituida bajo las leyes de la República de Colombia, identificada con NIT '),
  bold('[NIT DISART]'),
  run(', con domicilio principal en la ciudad de Bogotá D.C., representada legalmente por '),
  bold('[NOMBRE REPRESENTANTE LEGAL]'),
  run(', mayor de edad, identificado(a) con cédula de ciudadanía No. '),
  bold('[CC]'),
  run(' de '),
  bold('[CIUDAD]'),
  run(', quien actúa en su calidad de Representante Legal, en adelante "'),
  bold('DISART'),
  run('" o "la Compañía"; y por la otra parte:'),
]));

sections.push(pMulti([
  bold('[NOMBRE COMPLETO DEL INVERSIONISTA]'),
  run(', '),
  run('[mayor de edad / persona jurídica]'),
  run(', identificado(a) con '),
  run('[cédula de ciudadanía / cédula de extranjería / pasaporte / NIT]'),
  run(' No. '),
  bold('[NÚMERO]'),
  run(', con domicilio en '),
  bold('[CIUDAD, PAÍS]'),
  run(', '),
  run('[en su nombre propio / representada legalmente por NOMBRE, identificado con CC NÚMERO]'),
  run(', en adelante "'),
  bold('EL INVERSIONISTA'),
  run('".'),
]));

sections.push(p('DISART y EL INVERSIONISTA, en conjunto denominados "las Partes" e individualmente "una Parte", convienen en celebrar el presente Contrato de Inversión Privada (en adelante "el Contrato"), el cual se regirá por las siguientes consideraciones y cláusulas:'));

// CONSIDERANDOS
sections.push(clauseTitle('CONSIDERANDOS'));
sections.push(p('PRIMERO: Que DISART ENERGY S.A.S. es una sociedad comercial colombiana dedicada al diseño, importación, instalación, operación y mantenimiento de electrolineras de carga rápida en corriente continua (DC fast charging) para vehículos eléctricos, así como a la importación de vehículos eléctricos y a la implementación de sistemas solares fotovoltaicos.'));
sections.push(p('SEGUNDO: Que DISART cuenta con los permisos, certificaciones técnicas, registros aduaneros, autorizaciones ambientales y la experiencia operativa necesarios para desarrollar, instalar y operar estaciones de carga rápida en el territorio nacional, dando cumplimiento a la normativa aplicable de la Comisión de Regulación de Energía y Gas (CREG), la Unidad de Planeación Minero-Energética (UPME), el Reglamento Técnico de Instalaciones Eléctricas (RETIE), las normas IEC 61851-1, IEC 61851-23, EN 61851-24 y demás disposiciones legales colombianas.'));
sections.push(p('TERCERO: Que DISART ha desarrollado un modelo de operación de electrolineras integrado por: (i) tres (3) cargadores ultra rápidos DC de doscientos cuarenta kilovatios (240 kW) cada uno, con conectores CCS2 dobles, totalizando setecientos veinte kilovatios (720 kW) de potencia instalada y seis (6) mangueras simultáneas; (ii) un transformador eléctrico de mil kilovoltamperios (1.000 kVA); (iii) la obra civil, sistema eléctrico, conexión, trámites y legalización requeridos; y (iv) una plataforma de software propietaria que incluye aplicación móvil para conductores y panel de gestión para el operador (en adelante "la Electrolinera").'));
sections.push(p('CUARTO: Que DISART, en el marco de su estrategia de expansión, ofrece a inversionistas la posibilidad de participar accionariamente en la propiedad y los resultados de Electrolineras individuales, mediante el aporte de capital privado y bajo el modelo descrito en el presente Contrato.'));
sections.push(p('QUINTO: Que EL INVERSIONISTA manifiesta que conoce, comprende y acepta el modelo de negocio, los riesgos asociados, las proyecciones financieras presentadas con carácter referencial y no vinculante, y declara contar con la capacidad económica, legal y técnica para asumir las obligaciones derivadas del presente Contrato, así como la procedencia lícita de los recursos que aportará.'));
sections.push(p('SEXTO: Que las Partes manifiestan que ningún tercero ha intervenido en la negociación de este Contrato, y que actúan libres de cualquier vicio del consentimiento, en uso pleno de sus facultades y con apego al principio de buena fe consagrado en el artículo 1603 del Código Civil Colombiano y al artículo 871 del Código de Comercio.'));

// CLÁUSULAS
sections.push(clauseTitle('CLÁUSULA PRIMERA — DEFINICIONES'));
sections.push(p('Para efectos del presente Contrato, los siguientes términos tendrán el significado que se les asigna a continuación, los cuales serán aplicables tanto en singular como en plural:'));
sections.push(bullet('CAPEX: corresponde a la inversión total de capital requerida para entregar la Electrolinera en operación comercial, incluyendo cargadores, transformador, obras civiles, sistema eléctrico, conexión y trámites.'));
sections.push(bullet('Electrolinera: estación de carga rápida para vehículos eléctricos compuesta por tres (3) cargadores DC ultra rápidos de 240 kW, infraestructura asociada y software de operación, conforme al considerando TERCERO.'));
sections.push(bullet('Operación Comercial: fecha a partir de la cual la Electrolinera entrega energía al público y genera ingresos por venta de kilovatios-hora (kWh).'));
sections.push(bullet('Participación: porcentaje de propiedad accionaria y económica que adquiere EL INVERSIONISTA sobre la Electrolinera, en proporción al aporte de capital realizado.'));
sections.push(bullet('Utilidad Neta Mensual: ingresos brutos mensuales por venta de energía y servicios asociados, menos costos directos de energía, costos administrativos, depreciación contable, mantenimiento, gastos financieros y obligaciones tributarias aplicables.'));
sections.push(bullet('Plataforma: conjunto de aplicaciones de software propiedad de DISART o licenciadas a éste, que incluyen la aplicación móvil para conductores, el panel de gestión del operador, el sistema de gestión de cargadores (CPMS), y los servicios de monitoreo y soporte.'));
sections.push(bullet('Pesos / COP: pesos colombianos, moneda de curso legal en la República de Colombia.'));
sections.push(bullet('Dólares / USD: dólares de los Estados Unidos de América.'));
sections.push(bullet('TRM: Tasa Representativa del Mercado certificada por la Superintendencia Financiera de Colombia.'));

sections.push(clauseTitle('CLÁUSULA SEGUNDA — OBJETO'));
sections.push(p('Por virtud del presente Contrato, EL INVERSIONISTA aporta capital privado a DISART, con el propósito específico de financiar la implementación de UNA (1) Electrolinera con domicilio operativo en [DIRECCIÓN / ZONA, MUNICIPIO, DEPARTAMENTO], adquiriendo a cambio una Participación accionaria y económica proporcional, en los términos, condiciones y plazos pactados en este documento.'));
sections.push(p('El presente Contrato no constituye una oferta pública de valores, ni una invitación a invertir dirigida al público en general, ni una emisión de títulos sujeta al control de la Superintendencia Financiera de Colombia. Se trata de una inversión privada entre partes determinadas, regulada por las normas del derecho privado colombiano.'));

sections.push(clauseTitle('CLÁUSULA TERCERA — VALOR DE LA INVERSIÓN Y FORMA DE PAGO'));
sections.push(pMulti([
  run('3.1 '), bold('Monto.'),
  run(' EL INVERSIONISTA se obliga a aportar la suma de '),
  bold('[USD MONTO]'),
  run(' ('),
  bold('[MONTO EN LETRAS]'),
  run(' dólares de los Estados Unidos de América), equivalentes en pesos colombianos según la TRM vigente a la fecha de cada desembolso, en adelante "el Aporte".'),
]));
sections.push(pMulti([
  run('3.2 '), bold('Participación.'),
  run(' El Aporte otorga a EL INVERSIONISTA una Participación equivalente al '),
  bold('[%]'),
  run(' por ciento de la Electrolinera, conforme a la siguiente escala de referencia: USD 19.000 = 10%; USD 38.000 = 20%; USD 57.000 = 30%; USD 95.000 = 50%; USD 190.000 = 100%.'),
]));
sections.push(p('3.3 Forma de pago. El Aporte se desembolsará en moneda extranjera (USD) mediante transferencia bancaria internacional a la cuenta que DISART indicará por escrito, o en pesos colombianos al equivalente TRM, según se acuerde en el Anexo A. Los desembolsos se efectuarán contra hitos de ejecución, así:'));
sections.push(numbered('Cuarenta por ciento (40%) a la firma del presente Contrato.', 'a'));
sections.push(numbered('Treinta por ciento (30%) contra inicio de la obra civil, previa notificación de DISART.', 'b'));
sections.push(numbered('Veinte por ciento (20%) contra llegada y nacionalización de los cargadores y el transformador.', 'c'));
sections.push(numbered('Diez por ciento (10%) a la entrega en Operación Comercial.', 'd'));
sections.push(p('3.4 Comprobantes. DISART entregará a EL INVERSIONISTA un comprobante de recepción de cada desembolso, así como un certificado de Participación al cierre del último desembolso.'));
sections.push(p('3.5 Garantía del Aporte. El Aporte queda respaldado por la propiedad proporcional sobre los activos físicos de la Electrolinera (cargadores, transformador, obra civil y derechos de explotación), conforme se desarrolla en la Cláusula Décima.'));

sections.push(clauseTitle('CLÁUSULA CUARTA — DERECHOS DEL INVERSIONISTA'));
sections.push(p('En contraprestación al Aporte, EL INVERSIONISTA adquiere los siguientes derechos:'));
sections.push(bullet('Participación accionaria y económica proporcional sobre la Electrolinera, en el porcentaje señalado en la Cláusula 3.2.'));
sections.push(bullet('Distribución periódica de Utilidad Neta Mensual, conforme a la Cláusula Octava.'));
sections.push(bullet('Derecho proporcional sobre la valorización del activo y los demás derechos económicos derivados de la operación.'));
sections.push(bullet('Acceso al panel de gestión de la Electrolinera con visibilidad sobre ingresos, costos operativos, eficiencia energética y métricas de desempeño en tiempo real, conforme a la Cláusula Novena.'));
sections.push(bullet('Derecho a recibir informes contables mensuales y un informe consolidado anual, conforme a la Cláusula Décima Primera.'));
sections.push(bullet('Derecho de información ante hechos relevantes que afecten materialmente la Electrolinera (siniestros, cambios regulatorios, interrupciones extraordinarias).'));
sections.push(bullet('Derecho a transferir o ceder su Participación, sujeto al derecho de preferencia previsto en la Cláusula Décima Séptima.'));

sections.push(clauseTitle('CLÁUSULA QUINTA — OBLIGACIONES DE DISART'));
sections.push(p('DISART asume las siguientes obligaciones, todas las cuales son esenciales del Contrato:'));
sections.push(bullet('Importar, nacionalizar, ensamblar e instalar los tres (3) cargadores DC de 240 kW y el transformador de 1.000 kVA, asumiendo el riesgo aduanero y logístico.'));
sections.push(bullet('Ejecutar la totalidad de las obras civiles, instalaciones eléctricas, conexión a la red del operador, y trámites de legalización, hasta dejar la Electrolinera en condiciones de Operación Comercial.'));
sections.push(bullet('Gestionar y mantener vigentes todos los permisos, licencias, certificaciones y autorizaciones ante la CREG, UPME, operador de red local, autoridad ambiental, municipio y demás entidades competentes.'));
sections.push(bullet('Operar la Electrolinera de manera continua, garantizando un nivel de servicio razonable, monitoreo veinticuatro (24) horas al día siete (7) días a la semana, mantenimiento preventivo y correctivo, y atención al usuario final.'));
sections.push(bullet('Llevar la contabilidad de la Electrolinera bajo Normas Internacionales de Información Financiera (NIIF) aplicables, conforme a la Ley 1314 de 2009 y normas reglamentarias.'));
sections.push(bullet('Liquidar y pagar a EL INVERSIONISTA la Utilidad Neta Mensual conforme a la Cláusula Octava.'));
sections.push(bullet('Cumplir con las obligaciones tributarias, parafiscales, laborales y de seguridad social derivadas de la operación.'));
sections.push(bullet('Suministrar la Plataforma de software para el monitoreo y la operación, bajo el modelo de suscripción y los términos comerciales pactados en la Cláusula Novena.'));
sections.push(bullet('Informar oportunamente a EL INVERSIONISTA sobre hechos relevantes, riesgos materiales y cambios regulatorios que puedan afectar la operación.'));
sections.push(bullet('Mantener pólizas de seguro vigentes sobre los activos físicos de la Electrolinera (todo riesgo de bienes, responsabilidad civil extracontractual y, cuando aplique, lucro cesante).'));

sections.push(clauseTitle('CLÁUSULA SEXTA — OBLIGACIONES DEL INVERSIONISTA'));
sections.push(p('EL INVERSIONISTA se obliga a:'));
sections.push(bullet('Realizar el Aporte en los plazos y condiciones pactados en la Cláusula Tercera.'));
sections.push(bullet('Garantizar que los recursos aportados provienen de actividades lícitas y declaradas, conforme a la legislación colombiana e internacional aplicable en materia de prevención de lavado de activos y financiación del terrorismo.'));
sections.push(bullet('Suministrar la información, documentos y soportes que DISART requiera para cumplir con su política SAGRILAFT (Sistema de Autocontrol y Gestión del Riesgo Integral de Lavado de Activos, Financiación del Terrorismo y Financiación de la Proliferación de Armas de Destrucción Masiva).'));
sections.push(bullet('Abstenerse de intervenir en la operación técnica, comercial o administrativa de la Electrolinera, salvo en su calidad de inversionista con derecho a información.'));
sections.push(bullet('Guardar estricta confidencialidad sobre la información comercial, financiera, técnica y operativa que reciba con ocasión del Contrato, conforme a la Cláusula Décima Quinta.'));
sections.push(bullet('Asumir, por su cuenta, las obligaciones tributarias personales que se deriven de la percepción de utilidades, conforme a la legislación tributaria aplicable en su país de residencia fiscal.'));
sections.push(bullet('No utilizar los logos, marcas, nombres comerciales o información de DISART sin autorización previa y por escrito.'));
sections.push(bullet('Notificar a DISART por escrito cualquier cambio en sus datos de contacto, situación tributaria o estructura societaria.'));

sections.push(clauseTitle('CLÁUSULA SÉPTIMA — CRONOGRAMA DE EJECUCIÓN'));
sections.push(p('DISART se compromete a llevar la Electrolinera a Operación Comercial en un plazo de entre sesenta (60) y noventa (90) días calendario, contados a partir del cumplimiento simultáneo de los siguientes supuestos:'));
sections.push(numbered('Firma del presente Contrato.', 1));
sections.push(numbered('Recepción del primer desembolso (40%) del Aporte.', 2));
sections.push(numbered('Aseguramiento del predio donde se instalará la Electrolinera.', 3));
sections.push(p('PARÁGRAFO. El plazo aquí pactado podrá extenderse por causas no imputables a DISART, tales como demoras de la autoridad competente, eventos de fuerza mayor o caso fortuito, paros, huelgas, interrupciones logísticas internacionales, o cualquier otro hecho contemplado en la Cláusula Décima Cuarta. DISART notificará por escrito a EL INVERSIONISTA cualquier evento que afecte el cronograma y, de ser necesario, las Partes acordarán un nuevo cronograma de buena fe.'));

sections.push(clauseTitle('CLÁUSULA OCTAVA — DISTRIBUCIÓN DE UTILIDADES'));
sections.push(p('8.1 Cálculo. La Utilidad Neta Mensual se determinará como sigue:'));
sections.push(p('Utilidad Neta Mensual = Ingresos brutos por venta de energía y servicios − Costos directos de energía − Costos administrativos asignados − Depreciación contable − Mantenimiento preventivo y correctivo − Gastos financieros directos − Impuestos y cargas fiscales aplicables a la Electrolinera.', { italics: true }));
sections.push(p('8.2 Periodicidad. La distribución se efectuará mensualmente, dentro de los quince (15) días calendario siguientes al cierre contable del mes inmediatamente anterior. DISART entregará un estado de resultados detallado.'));
sections.push(p('8.3 Forma de pago. La distribución se hará mediante transferencia bancaria a la cuenta que EL INVERSIONISTA designe por escrito, en pesos colombianos o en dólares según se pacte, neta de retenciones y demás obligaciones tributarias aplicables.'));
sections.push(p('8.4 Carácter no garantizado. La Utilidad Neta Mensual depende del volumen de carga efectivamente entregado, de la tarifa eléctrica vigente, de la operación regular de la Electrolinera y de otros factores de mercado. Las proyecciones financieras comunicadas a EL INVERSIONISTA con anterioridad a la firma de este Contrato son meramente referenciales y no constituyen una garantía de rendimiento por parte de DISART.'));

sections.push(clauseTitle('CLÁUSULA NOVENA — SERVICIOS DE SOFTWARE (SaaS)'));
sections.push(p('9.1 Plataforma. La operación de la Electrolinera se soporta sobre la Plataforma de software propiedad de DISART, la cual incluye: (i) aplicación móvil para conductores; (ii) panel de gestión para el operador; (iii) sistema de gestión de cargadores (CPMS); (iv) servicios de monitoreo y soporte; y (v) integraciones con pasarelas de pago.'));
sections.push(p('9.2 Suscripción mensual. El uso de la Plataforma está sujeto al pago de una suscripción mensual ("Tarifa SaaS"), cuyo monto será comunicado por escrito por DISART y podrá actualizarse anualmente conforme al Índice de Precios al Consumidor (IPC) certificado por el DANE más hasta tres (3) puntos porcentuales. La Tarifa SaaS se descuenta directamente de los ingresos brutos antes del cálculo de la Utilidad Neta Mensual.'));
sections.push(p('9.3 Versión marca blanca (opcional). EL INVERSIONISTA podrá solicitar que la aplicación móvil y el panel de gestión se desplieguen bajo su propia marca comercial ("Marca Blanca"). En tal caso, DISART facturará un cargo único de implementación ("Setup Fee") que cubre: diseño, desarrollo, publicación en tiendas de aplicaciones, configuración técnica y entrenamiento. El Setup Fee se cotizará por separado y requerirá acuerdo escrito.'));
sections.push(p('9.4 Propiedad intelectual. La Plataforma y su código fuente son propiedad exclusiva de DISART. EL INVERSIONISTA no adquiere derechos de propiedad intelectual sobre el software por virtud de este Contrato; únicamente recibe una licencia de uso no exclusiva, intransferible y limitada al periodo en que mantenga su Participación vigente.'));
sections.push(p('9.5 Disponibilidad. DISART se esforzará razonablemente por mantener una disponibilidad de la Plataforma superior al noventa y nueve por ciento (99%) en cómputo mensual, sin que esto constituya una garantía absoluta. Las interrupciones por mantenimiento programado, fuerza mayor o factores externos no se computarán en la métrica de disponibilidad.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA — PROPIEDAD DEL ACTIVO'));
sections.push(p('10.1 Naturaleza de la Participación. La Participación que adquiere EL INVERSIONISTA es de carácter accionario sobre la Electrolinera entendida como unidad de negocio identificable, con sus activos físicos, intangibles, derechos de explotación, contratos asociados y cuentas por cobrar.'));
sections.push(p('10.2 Modalidad jurídica. Las Partes acuerdan instrumentar la Participación, a opción de DISART y conforme a la regulación vigente, mediante una o más de las siguientes modalidades: (i) emisión de acciones o cuotas en una sociedad vehículo (SPV) por proyecto, constituida bajo la modalidad Sociedad por Acciones Simplificada (S.A.S.) conforme a la Ley 1258 de 2008; (ii) contrato de cuentas en participación, conforme a los artículos 507 y siguientes del Código de Comercio; o (iii) cualquier otra figura legal que asegure los derechos económicos pactados.'));
sections.push(p('10.3 Registro y formalización. DISART asume los costos y diligencias para la formalización jurídica de la Participación, incluyendo el registro mercantil ante la Cámara de Comercio competente, conforme a la modalidad seleccionada.'));
sections.push(p('10.4 Valorización. La valorización del activo se reflejará en los estados financieros anuales auditados de la Electrolinera o de la SPV, según corresponda.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA PRIMERA — CONTABILIDAD, AUDITORÍA E INFORMES'));
sections.push(p('11.1 Contabilidad. DISART llevará la contabilidad de la Electrolinera conforme a las Normas Internacionales de Información Financiera (NIIF) y demás normas contables aplicables en Colombia.'));
sections.push(p('11.2 Informes mensuales. DISART entregará a EL INVERSIONISTA, dentro de los primeros quince (15) días hábiles de cada mes, un informe que incluya: (i) ingresos brutos del mes anterior; (ii) costos y gastos detallados; (iii) Utilidad Neta Mensual; (iv) distribución correspondiente al porcentaje de Participación; (v) métricas operativas clave (kWh entregados, sesiones de carga, disponibilidad).'));
sections.push(p('11.3 Informe anual y auditoría. Anualmente, DISART entregará un informe consolidado y, cuando legalmente sea exigible o a solicitud de EL INVERSIONISTA con una participación igual o superior al treinta por ciento (30%), los estados financieros serán auditados por un revisor fiscal o contador público independiente, cuyo costo será asumido proporcionalmente por la Electrolinera.'));
sections.push(p('11.4 Derecho de revisión. EL INVERSIONISTA podrá, con un (1) preaviso escrito de quince (15) días hábiles y a su costo, designar un contador o auditor independiente para revisar la contabilidad específica de la Electrolinera, siempre que tal revisión no se efectúe más de una vez al año ni interfiera con la operación. La información revisada estará sujeta al deber de confidencialidad pactado en la Cláusula Décima Quinta.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA SEGUNDA — IMPUESTOS Y CARGAS FISCALES'));
sections.push(p('12.1 Régimen aplicable. La Electrolinera estará sujeta al régimen tributario colombiano vigente, incluyendo, sin limitarse a: Impuesto sobre la Renta y Complementarios, Impuesto sobre las Ventas (IVA), Impuesto de Industria y Comercio (ICA), Impuesto al Patrimonio cuando aplique, y demás tributos nacionales, departamentales y municipales.'));
sections.push(p('12.2 Retenciones. DISART practicará las retenciones en la fuente que sean aplicables sobre las distribuciones de Utilidad Neta Mensual conforme al Estatuto Tributario y las disposiciones que lo reglamentan.'));
sections.push(p('12.3 Inversionista extranjero. Cuando EL INVERSIONISTA sea persona natural o jurídica no residente fiscal en Colombia, DISART aplicará el régimen tributario de no residentes, las retenciones aplicables y los convenios para evitar la doble imposición (CDI), cuando existan y sean aplicables.'));
sections.push(p('12.4 Obligaciones del Inversionista. EL INVERSIONISTA es el único responsable de las obligaciones tributarias derivadas de la percepción de utilidades en su país de residencia fiscal.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA TERCERA — LIMITACIÓN DE RESPONSABILIDAD'));
sections.push(p('13.1 Responsabilidad de DISART. DISART responderá únicamente por los daños directos, ciertos y previsibles que se deriven del incumplimiento doloso o gravemente culposo de sus obligaciones esenciales bajo este Contrato.'));
sections.push(p('13.2 Exclusiones. En ningún caso DISART responderá por: (i) lucro cesante distinto del razonablemente esperado bajo escenarios operativos normales; (ii) daños indirectos, consecuenciales, punitivos o ejemplares; (iii) pérdidas de oportunidad; (iv) variaciones de la tasa de cambio; (v) cambios regulatorios, tarifarios o tributarios sobrevinientes; (vi) decisiones unilaterales del operador de red local; (vii) fluctuaciones del mercado de movilidad eléctrica.'));
sections.push(p('13.3 Tope de responsabilidad. La responsabilidad agregada de DISART por todo concepto bajo este Contrato no excederá el monto efectivamente recibido como Aporte de EL INVERSIONISTA, sin perjuicio de las responsabilidades que la ley colombiana imponga como inderogables (dolo, culpa grave).'));
sections.push(p('13.4 Riesgo de inversión. EL INVERSIONISTA reconoce que toda inversión privada conlleva riesgos económicos, regulatorios y de mercado, y declara que los asume de manera informada.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA CUARTA — FUERZA MAYOR Y CASO FORTUITO'));
sections.push(p('Ninguna de las Partes será responsable por el incumplimiento o el retraso en el cumplimiento de sus obligaciones cuando éstos sean consecuencia directa de un evento de fuerza mayor o caso fortuito, en los términos del artículo 1 de la Ley 95 de 1890, del Código Civil y del Código de Comercio, incluyendo, sin limitación: catástrofes naturales, pandemias, conflictos armados, actos de autoridad, paros nacionales, huelgas generales, restricciones aduaneras o cambiarias, interrupciones del sistema interconectado nacional, sabotajes o hechos del príncipe.'));
sections.push(p('La Parte afectada notificará el evento a la otra dentro de los quince (15) días calendario siguientes y propondrá un plan de mitigación. Si el evento se prolonga por más de seis (6) meses, cualquiera de las Partes podrá solicitar la renegociación de las condiciones del Contrato o, de no llegarse a un acuerdo, su terminación anticipada sin lugar a indemnización.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA QUINTA — CONFIDENCIALIDAD'));
sections.push(p('15.1 Información confidencial. Toda información comercial, financiera, técnica, operativa, contable, jurídica o de cualquier otra naturaleza que las Partes intercambien con ocasión del Contrato será considerada confidencial.'));
sections.push(p('15.2 Obligaciones. Las Partes se obligan a: (i) mantener la información confidencial en estricta reserva; (ii) no utilizarla para fines distintos a la ejecución del Contrato; (iii) limitar su divulgación interna a las personas que estrictamente la requieran; (iv) no divulgarla a terceros sin autorización previa y escrita de la otra Parte.'));
sections.push(p('15.3 Vigencia. La obligación de confidencialidad subsistirá por cinco (5) años contados a partir de la terminación del Contrato.'));
sections.push(p('15.4 Excepciones. No se considerará confidencial la información que: (i) sea o pase a ser de dominio público sin culpa de la Parte receptora; (ii) deba revelarse por mandato legal, judicial o administrativo, caso en el cual la Parte requerida notificará a la otra de manera previa cuando sea jurídicamente posible.'));
sections.push(p('15.5 Sanción. El incumplimiento de la obligación de confidencialidad dará lugar al pago de una cláusula penal equivalente al diez por ciento (10%) del Aporte, sin perjuicio de la indemnización de perjuicios adicionales, conforme a los artículos 1592 a 1601 del Código Civil.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA SEXTA — NO COMPETENCIA'));
sections.push(p('Durante la vigencia del Contrato y por un período de dos (2) años posteriores a su terminación, EL INVERSIONISTA se abstendrá de: (i) participar directa o indirectamente en proyectos competitivos de electrolineras de carga rápida en el área geográfica de influencia de la Electrolinera objeto del Contrato (entendida como un radio de diez (10) kilómetros a la redonda); (ii) replicar el modelo de negocio, conocimientos técnicos o procesos operativos de DISART obtenidos con ocasión del Contrato.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA SÉPTIMA — CESIÓN Y TRANSFERENCIA'));
sections.push(p('17.1 Cesión por el Inversionista. EL INVERSIONISTA podrá ceder o transferir total o parcialmente su Participación a terceros, sujeto al derecho de preferencia de DISART y, en su caso, de los demás inversionistas de la Electrolinera. La cesión requerirá: (i) notificación previa por escrito a DISART con al menos sesenta (60) días calendario de anticipación; (ii) cumplimiento de las normas SAGRILAFT respecto del cesionario; (iii) adhesión escrita del cesionario al presente Contrato.'));
sections.push(p('17.2 Derecho de preferencia. DISART y los demás inversionistas tendrán un plazo de treinta (30) días calendario, contados desde la notificación, para ejercer el derecho de preferencia en condiciones similares a las ofrecidas al tercero.'));
sections.push(p('17.3 Cesión por DISART. DISART podrá ceder sus derechos y obligaciones operativas a una sociedad filial, subsidiaria o vehículo de propósito especial, previa notificación a EL INVERSIONISTA y siempre que se mantengan o mejoren las condiciones pactadas.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA OCTAVA — CAUSALES DE TERMINACIÓN'));
sections.push(p('El presente Contrato podrá terminarse por las siguientes causales:'));
sections.push(bullet('Mutuo acuerdo de las Partes, formalizado por escrito.'));
sections.push(bullet('Incumplimiento grave de las obligaciones esenciales de alguna de las Partes, no subsanado dentro de los treinta (30) días calendario siguientes al requerimiento escrito.'));
sections.push(bullet('Pérdida total de la Electrolinera por siniestro no asegurable o por hecho imputable a tercero, en condiciones que hagan imposible la continuidad del negocio.'));
sections.push(bullet('Imposibilidad sobrevenida de la operación por cambio regulatorio sustancial.'));
sections.push(bullet('Fuerza mayor prolongada por más de seis (6) meses, conforme a la Cláusula Décima Cuarta.'));
sections.push(bullet('Disolución, liquidación, concurso de acreedores o insolvencia de alguna de las Partes.'));
sections.push(bullet('Decisión judicial o administrativa firme que ordene la terminación.'));

sections.push(clauseTitle('CLÁUSULA DÉCIMA NOVENA — RECOMPRA Y SALIDA DEL INVERSIONISTA'));
sections.push(p('19.1 Derecho de recompra. A partir del tercer (3°) año de Operación Comercial, EL INVERSIONISTA podrá solicitar a DISART la recompra de su Participación, mediante notificación escrita con al menos noventa (90) días de antelación. DISART tendrá un derecho preferente, mas no obligación, de recomprar la Participación a un precio determinado mediante valoración independiente (método de flujo de caja descontado o múltiplos de mercado, lo que sea más alto).'));
sections.push(p('19.2 Pago. El precio de recompra se pagará en un máximo de seis (6) cuotas mensuales consecutivas a partir de la suscripción del documento de transferencia.'));
sections.push(p('19.3 Procedimiento alternativo. Si DISART no ejerce su derecho preferente, EL INVERSIONISTA podrá ofrecer su Participación a terceros conforme a la Cláusula Décima Séptima.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA — CUMPLIMIENTO NORMATIVO (LA/FT/PADM, SAGRILAFT)'));
sections.push(p('20.1 Declaraciones. EL INVERSIONISTA declara, bajo la gravedad del juramento, que: (i) los recursos aportados provienen de actividades lícitas; (ii) no se encuentra incluido en listas restrictivas nacionales o internacionales (OFAC, ONU, Unión Europea, listados nacionales); (iii) no ha sido condenado por delitos de lavado de activos, financiación del terrorismo, corrupción transnacional, narcotráfico o conexos.'));
sections.push(p('20.2 Política SAGRILAFT. DISART implementa una política SAGRILAFT conforme a la Circular Básica Jurídica de la Superintendencia de Sociedades, y se reserva el derecho de no celebrar, suspender o terminar el Contrato si la debida diligencia identifica riesgos materiales relacionados con EL INVERSIONISTA o con la procedencia de los recursos.'));
sections.push(p('20.3 Anticorrupción. Las Partes declaran que no han ofrecido, prometido ni entregado dádivas, sobornos o beneficios indebidos a funcionarios públicos o privados con ocasión de este Contrato, en línea con la Ley 1474 de 2011, la Ley 1778 de 2016 y normas internacionales aplicables (FCPA, UK Bribery Act).'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA PRIMERA — TRATAMIENTO DE DATOS PERSONALES'));
sections.push(p('21.1 Marco aplicable. El tratamiento de los datos personales de EL INVERSIONISTA (o de sus representantes legales y beneficiarios finales, según aplique) se regirá por la Ley 1581 de 2012, el Decreto 1377 de 2013 y la política de tratamiento de datos personales de DISART, disponible en disartenergy.com.'));
sections.push(p('21.2 Autorización. EL INVERSIONISTA autoriza expresamente a DISART para recolectar, almacenar, usar, circular y suprimir sus datos personales con los fines de: (i) ejecutar el Contrato; (ii) cumplir obligaciones legales y reglamentarias; (iii) realizar reportes a autoridades competentes; (iv) enviar información comercial relacionada con la Electrolinera. La autorización podrá ser revocada conforme a la ley.'));
sections.push(p('21.3 Derechos del titular. EL INVERSIONISTA conoce que tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales, los cuales podrá ejercer ante DISART mediante comunicación al correo electrónico comercial@disartenergy.com.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA SEGUNDA — PROPIEDAD INTELECTUAL'));
sections.push(p('Todos los derechos de propiedad intelectual, marcas comerciales, nombres comerciales, logotipos, diseños industriales, secretos empresariales, código fuente, documentación técnica y demás bienes intangibles de DISART son y permanecerán como propiedad exclusiva de DISART. EL INVERSIONISTA no adquiere por virtud de este Contrato derecho alguno sobre dichos bienes, distinto a la licencia limitada de uso de la Plataforma descrita en la Cláusula Novena.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA TERCERA — RESOLUCIÓN DE CONTROVERSIAS (ARBITRAJE)'));
sections.push(p('23.1 Negociación directa. Toda controversia, diferencia o conflicto derivado de la interpretación, ejecución o terminación del presente Contrato se intentará resolver primero mediante negociación directa entre las Partes, dentro de un plazo máximo de treinta (30) días calendario.'));
sections.push(p('23.2 Arbitraje. Si la negociación directa fracasa, la controversia se resolverá definitivamente mediante arbitraje administrado por el Centro de Arbitraje y Conciliación de la Cámara de Comercio de Bogotá, conforme al reglamento vigente y a la Ley 1563 de 2012 (Estatuto de Arbitraje Nacional e Internacional). El tribunal estará compuesto por un (1) árbitro si la cuantía es inferior a cuatrocientos (400) salarios mínimos mensuales legales vigentes, o tres (3) árbitros si es superior. El laudo será en derecho.'));
sections.push(p('23.3 Sede e idioma. La sede del arbitraje será Bogotá D.C., Colombia, y el idioma del procedimiento será el español.'));
sections.push(p('23.4 Costos. Los honorarios y gastos del arbitraje serán asumidos por la Parte vencida, salvo decisión expresa del tribunal en contrario.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA CUARTA — LEY APLICABLE Y JURISDICCIÓN'));
sections.push(p('El presente Contrato se rige íntegramente por las leyes de la República de Colombia, con exclusión de cualquier conflicto de leyes. Para todos los efectos legales se entiende como domicilio contractual la ciudad de Bogotá D.C.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA QUINTA — NOTIFICACIONES'));
sections.push(p('Todas las notificaciones, comunicaciones o requerimientos derivados del Contrato deberán hacerse por escrito y dirigirse a las siguientes direcciones:'));
sections.push(p('DISART ENERGY S.A.S.', { bold: true }));
sections.push(p('Atención: Representante Legal'));
sections.push(p('Dirección: [DIRECCIÓN FÍSICA]'));
sections.push(p('Correo electrónico: comercial@disartenergy.com'));
sections.push(p('Teléfono: +57 310 4836462'));
sections.push(p(' '));
sections.push(p('EL INVERSIONISTA', { bold: true }));
sections.push(p('Atención: [NOMBRE]'));
sections.push(p('Dirección: [DIRECCIÓN FÍSICA]'));
sections.push(p('Correo electrónico: [EMAIL]'));
sections.push(p('Teléfono: [TELÉFONO]'));
sections.push(p('Cualquier cambio en los datos anteriores deberá notificarse a la otra Parte con al menos quince (15) días calendario de anticipación.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA SEXTA — MODIFICACIONES'));
sections.push(p('Cualquier modificación al presente Contrato deberá constar por escrito, ser firmada por los representantes legales de ambas Partes y formar parte integrante del Contrato como otrosí o anexo numerado.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA SÉPTIMA — INTEGRIDAD DEL CONTRATO'));
sections.push(p('El presente Contrato, junto con sus anexos, constituye la totalidad del acuerdo entre las Partes respecto del objeto contratado y reemplaza cualquier negociación, propuesta, oferta, acuerdo verbal o escrito previo. No existen pactos, ofertas, garantías o representaciones distintas a las consignadas expresamente en este documento.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA OCTAVA — NULIDAD PARCIAL'));
sections.push(p('Si alguna cláusula o disposición del presente Contrato resultare nula, inválida o inejecutable por decisión judicial o arbitral firme, dicha invalidez no afectará la validez de las demás cláusulas, las cuales seguirán plenamente vigentes. Las Partes se obligan a sustituir la cláusula afectada por otra que refleje, en la medida de lo posible, la intención económica original.'));

sections.push(clauseTitle('CLÁUSULA VIGÉSIMA NOVENA — VARIOS'));
sections.push(p('29.1 Encabezados. Los encabezados de las cláusulas tienen finalidad únicamente de referencia y no afectan la interpretación.'));
sections.push(p('29.2 Renuncia. La falta o demora en el ejercicio de un derecho no constituye renuncia al mismo.'));
sections.push(p('29.3 Ejemplares. El presente Contrato se firma en dos (2) ejemplares del mismo tenor y valor, uno para cada Parte.'));
sections.push(p('29.4 Anexos. Forman parte integrante del Contrato los siguientes anexos: Anexo A — Cronograma de desembolsos; Anexo B — Especificaciones técnicas de la Electrolinera; Anexo C — Política de tratamiento de datos personales; Anexo D — Tarifa SaaS vigente; Anexo E — Pólizas de seguro vigentes.'));

sections.push(clauseTitle('CLÁUSULA TRIGÉSIMA — PERFECCIONAMIENTO Y VIGENCIA'));
sections.push(p('El presente Contrato se perfecciona con la firma de los representantes legales de ambas Partes y entra en vigencia a partir de la fecha de la última firma. Su vigencia se extenderá durante la operación de la Electrolinera, salvo terminación anticipada conforme a las cláusulas precedentes.'));

sections.push(p(' ', { before: 280 }));
sections.push(p('En constancia, las Partes firman el presente Contrato en la ciudad de Bogotá D.C., a los _____ días del mes de ____________ de 2026.', { align: AlignmentType.JUSTIFIED, before: 200, after: 400 }));

// Firmas
sections.push(p(' ', { before: 200 }));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 80 },
  children: [new TextRun({ text: '_______________________________', font: FONT, size: 22 })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 0 },
  children: [new TextRun({ text: 'DISART ENERGY S.A.S.', font: FONT, size: 22, bold: true })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 0 },
  children: [new TextRun({ text: '[NOMBRE REPRESENTANTE LEGAL]', font: FONT, size: 22 })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 0 },
  children: [new TextRun({ text: 'C.C. [NÚMERO]', font: FONT, size: 22 })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 400 },
  children: [new TextRun({ text: 'NIT [NÚMERO]', font: FONT, size: 22 })],
}));

sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 80 },
  children: [new TextRun({ text: '_______________________________', font: FONT, size: 22 })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 0 },
  children: [new TextRun({ text: 'EL INVERSIONISTA', font: FONT, size: 22, bold: true })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 0 },
  children: [new TextRun({ text: '[NOMBRE COMPLETO]', font: FONT, size: 22 })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 0 },
  children: [new TextRun({ text: 'Identificación: [TIPO Y NÚMERO]', font: FONT, size: 22 })],
}));

// Disclaimer
sections.push(p(' ', { before: 600 }));
sections.push(clauseTitle('NOTA DE USO'));
sections.push(p('Este documento es una plantilla profesional preparada con base en la información del negocio Disart Energy y en referencias generales del derecho comercial colombiano. No reemplaza la asesoría legal especializada. Antes de su firma definitiva, debe ser revisado, ajustado y validado por un abogado colombiano licenciado, en función de la operación específica, la modalidad jurídica (S.A.S., cuentas en participación u otra), el perfil del inversionista (residente / no residente), el régimen tributario aplicable y las regulaciones vigentes al momento de la firma. DISART ENERGY S.A.S. y el autor de la plantilla no asumen responsabilidad por su uso sin la debida revisión legal previa.', { italics: true }));

// ============================================================================
// Documento
// ============================================================================

const doc = new Document({
  creator: 'Disart Energy S.A.S.',
  title: 'Contrato de Inversión Privada — Electrolinera Disart',
  description: 'Contrato de inversión accionaria en electrolinera Disart Energy.',
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 22 },
        paragraph: { spacing: { line: 300 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1080, bottom: 1440, left: 1080 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'DISART ENERGY S.A.S.   ·   Contrato de Inversión Privada', font: FONT, size: 18, color: '0D3A23', bold: true })],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Página ', font: FONT, size: 18, color: '4F5C55' }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: '4F5C55' }),
                new TextRun({ text: ' de ', font: FONT, size: 18, color: '4F5C55' }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 18, color: '4F5C55' }),
                new TextRun({ text: '   ·   disartenergy.com', font: FONT, size: 18, color: '4F5C55' }),
              ],
            }),
          ],
        }),
      },
      children: sections,
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
const out = 'disart-contrato-inversion.docx';
await writeFile(out, buffer);

console.log(`✓ Generado: ${out}`);
console.log(`  Cláusulas: 30`);
console.log(`  Editable en Microsoft Word, Google Docs o LibreOffice Writer.`);
console.log(`  ⚠ Validar con abogado colombiano antes de firmar.`);
