import { useState, useEffect, useRef } from "react";

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────
const VERSION = "A";
const PASSWORD = "PROPULSIÓN";
const PASSWORD_DISPLAY = ["P","R","O","P","U","L","S","I","Ó","N"];
const EQUIPOS = ["ALFA", "GAMMA", "ÉPSILON"];
const TOTAL_TIME = 90 * 60; // 90 minutos en segundos

const RETOS = [
  // ── BLOQUE 1: CALENTAMIENTO (10 min c/u) ──────────────────────────────────
  {
    id: 1,
    bloque: "CALENTAMIENTO",
    bloqueColor: "#F59E0B",
    tiempo: 10 * 60,
    letra: "P",
    titulo: "RETO 1 — Residuos en la Zona MRO",
    icono: "🛢️",
    tipo: "seleccion",
    enunciado: "Un técnico drena aceite hidráulico usado del tren de aterrizaje de una aeronave en el hangar. Según la normativa ambiental vigente, ¿cuál es el procedimiento correcto de disposición?",
    opciones: [
      { id: "a", texto: "Verterlo en el desagüe del hangar para diluirlo con agua." },
      { id: "b", texto: "Almacenarlo en contenedor etiquetado y entregarlo a un gestor de residuos autorizado.", correcta: true },
      { id: "c", texto: "Mezclarlo con combustible Jet-A para su reutilización en el motor." },
      { id: "d", texto: "Dejarlo evaporar en el área de ventilación del taller." },
    ],
    feedback: "✅ Correcto. El aceite hidráulico es un residuo peligroso. La norma exige contenedor etiquetado con fecha, tipo y volumen, y entrega exclusiva a gestor certificado. Nunca mezclar ni verter.",
    pista: "Piensa en la cadena de custodia de residuos peligrosos según ISO 14001."
  },
  {
    id: 2,
    bloque: "CALENTAMIENTO",
    bloqueColor: "#F59E0B",
    tiempo: 10 * 60,
    letra: "R",
    titulo: "RETO 2 — Huella de Carbono en Banco de Pruebas",
    icono: "✈️",
    tipo: "calculo",
    enunciado: "Un motor CFM56 en banco de pruebas consume 850 kg de combustible Jet-A en 2 horas de prueba. El factor de emisión del Jet-A es 3.16 kg CO₂ por kg de combustible consumido. ¿Cuántas toneladas métricas de CO₂ genera esa prueba?",
    opciones: [
      { id: "a", texto: "1.34 toneladas de CO₂" },
      { id: "b", texto: "2.69 toneladas de CO₂", correcta: true },
      { id: "c", texto: "0.85 toneladas de CO₂" },
      { id: "d", texto: "5.38 toneladas de CO₂" },
    ],
    feedback: "✅ Correcto. 850 kg × 3.16 = 2,686 kg = 2.69 toneladas de CO₂. Cada prueba de motor genera emisiones equivalentes a cientos de vehículos en un día.",
    pista: "Aplica la fórmula: masa de combustible × factor de emisión ÷ 1000 para convertir a toneladas."
  },
  {
    id: 3,
    bloque: "CALENTAMIENTO",
    bloqueColor: "#F59E0B",
    tiempo: 10 * 60,
    letra: "O",
    titulo: "RETO 3 — ODS y el Sector Aeronáutico",
    icono: "🌍",
    tipo: "ordenamiento",
    enunciado: "De los siguientes Objetivos de Desarrollo Sostenible, identifica los 3 DIRECTAMENTE vinculados al impacto ambiental del mantenimiento aeronáutico y ordénalos de MAYOR a MENOR relevancia para el sector MRO.",
    opciones: [
      { id: "a", texto: "ODS 1 — Fin de la pobreza" },
      { id: "b", texto: "ODS 9 — Industria, innovación e infraestructura", correcta: true, orden: 2 },
      { id: "c", texto: "ODS 12 — Producción y consumo responsables", correcta: true, orden: 3 },
      { id: "d", texto: "ODS 13 — Acción por el clima", correcta: true, orden: 1 },
      { id: "e", texto: "ODS 16 — Paz, justicia e instituciones sólidas" },
    ],
    feedback: "✅ Correcto. ODS 13 (clima, emisiones de carbono) → ODS 9 (infraestructura industrial sostenible) → ODS 12 (gestión responsable de aceites, solventes y metales). Estos tres ODS enmarcan la sostenibilidad aeronáutica.",
    pista: "¿Qué ODS habla directamente de emisiones de CO₂ y cambio climático?"
  },

  // ── BLOQUE 2: NÚCLEO TÉCNICO (8 min c/u) ─────────────────────────────────
  {
    id: 4,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "P",
    titulo: "RETO 4 — Protocolo de Respuesta a Derrames",
    icono: "⚠️",
    tipo: "ordenamiento",
    enunciado: "Un técnico detecta un derrame de fluido hidráulico Skydrol en el piso del hangar. Ordena los 5 pasos del protocolo de respuesta ambiental en la secuencia CORRECTA:",
    opciones: [
      { id: "a", texto: "Recolectar los residuos absorbentes en contenedor etiquetado como residuo peligroso", correcta: true, orden: 4 },
      { id: "b", texto: "Contener el derrame inmediatamente con absorbentes industriales", correcta: true, orden: 1 },
      { id: "c", texto: "Completar el Registro de Incidente Ambiental y notificar al gestor", correcta: true, orden: 5 },
      { id: "d", texto: "Notificar al supervisor de turno y al responsable ambiental", correcta: true, orden: 2 },
      { id: "e", texto: "Colocar señalización de área restringida alrededor del derrame", correcta: true, orden: 3 },
    ],
    feedback: "✅ Orden correcto: (1) Contener → (2) Notificar → (3) Señalizar → (4) Recolectar → (5) Registrar. La documentación siempre va al final pero es obligatoria para el sistema de gestión ambiental.",
    pista: "Primero actúa para evitar mayor contaminación, luego comunica, luego documenta."
  },
  {
    id: 5,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "U",
    titulo: "RETO 5 — Normativa Ambiental Aeronáutica",
    icono: "📋",
    tipo: "verdaderofalso",
    enunciado: "Evalúa las siguientes afirmaciones sobre normativa ambiental en aviación. Indica cuáles son VERDADERAS y cuáles son FALSAS:",
    afirmaciones: [
      { id: 1, texto: "El Anexo 16 del Convenio de Chicago (ICAO) regula las emisiones contaminantes y el ruido de motores de aviación.", respuesta: true },
      { id: 2, texto: "Panamá no cuenta con legislación específica para el manejo de residuos peligrosos en aeropuertos.", respuesta: false, explicacion: "FALSA. Existe la Ley 21/1986 y el Decreto Ejecutivo 111/1999 que regulan residuos peligrosos a nivel nacional, aplicables también al sector aeronáutico." },
      { id: 3, texto: "Los solventes halogenados usados en limpieza de componentes están regulados por el Protocolo de Montreal.", respuesta: true },
      { id: 4, texto: "El ruido generado por operaciones aeronáuticas no se considera un impacto ambiental regulable por organismos internacionales.", respuesta: false, explicacion: "FALSA. El Capítulo 14 del Volumen 1 del Anexo 16 de ICAO establece estándares específicos de ruido para aeronaves subsónicas." },
      { id: 5, texto: "La norma ISO 14001:2015 puede certificar sistemas de gestión ambiental en centros MRO aeronáuticos.", respuesta: true },
    ],
    feedback: "✅ V-F-V-F-V. Las afirmaciones 2 y 4 son falsas. Panamá sí tiene marco legal ambiental aplicable a aeropuertos, e ICAO regula el ruido en el Capítulo 14 del Anexo 16.",
    pista: "Recuerda que ICAO tiene dos grandes áreas de regulación ambiental: emisiones y ruido."
  },
  {
    id: 6,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "L",
    titulo: "RETO 6 — Aspectos e Impactos en Pintura de Fuselaje",
    icono: "🎨",
    tipo: "matriz",
    enunciado: "Se realiza un proceso de pintura de fuselaje utilizando pistola aerográfica, solventes orgánicos, selladores epóxicos y cabina de extracción de aire. Completa la tabla de identificación de aspectos e impactos ambientales (mínimo 3 aspectos con su impacto, magnitud y medida de control):",
    tabla: {
      columnas: ["Aspecto Ambiental", "Impacto Identificado", "Magnitud (A/M/B)", "Medida de Control"],
      respuestasEjemplo: [
        ["Emisión de COV (compuestos orgánicos volátiles)", "Contaminación atmosférica e impacto en salud del técnico", "Alta", "Filtros de carbón activado en cabina + EPP respiratorio"],
        ["Residuos de pintura y solventes", "Contaminación de suelo y riesgo de lixiviación", "Media", "Contenedor para residuos peligrosos + gestión certificada"],
        ["Consumo de agua en limpieza de equipos", "Agotamiento del recurso hídrico + generación de efluentes", "Baja", "Sistema de circuito cerrado para reutilización de agua"],
      ]
    },
    feedback: "✅ Los tres aspectos clave son: emisiones de COV (Alta), residuos de pintura/solventes (Media) y consumo de agua (Baja). Toda medida de control debe ser técnicamente viable y asignable a un responsable.",
    pista: "Piensa en qué sale al aire, qué queda en el suelo y qué entra al desagüe durante el proceso de pintura."
  },
  {
    id: 7,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "S",
    titulo: "RETO 7 — Huella Hídrica en Lavado de Aeronaves",
    icono: "💧",
    tipo: "calculo",
    enunciado: "Un centro MRO realiza 3 lavados de aeronave por semana, consumiendo 800 litros de agua por lavado. El centro opera 50 semanas al año. Si instalan un sistema de recirculación que recupera el 65% del agua usada, ¿cuántos litros ahorran anualmente? ¿Qué ODS apoya directamente esta acción?",
    opciones: [
      { id: "a", texto: "Ahorro: 78,000 litros/año — ODS 6 (Agua limpia y saneamiento)", correcta: true },
      { id: "b", texto: "Ahorro: 42,000 litros/año — ODS 13 (Acción por el clima)" },
      { id: "c", texto: "Ahorro: 120,000 litros/año — ODS 6 (Agua limpia y saneamiento)" },
      { id: "d", texto: "Ahorro: 56,000 litros/año — ODS 12 (Producción responsable)" },
    ],
    feedback: "✅ Consumo anual: 3 × 800 × 50 = 120,000 L. Ahorro con recirculación: 120,000 × 0.65 = 78,000 litros/año. El ODS 6 (Agua limpia y saneamiento) es el directamente vinculado.",
    pista: "Paso 1: calcula el consumo total anual. Paso 2: aplica el 65% de recuperación."
  },

  // ── BLOQUE 3: SPRINT FINAL (8 min c/u) ────────────────────────────────────
  {
    id: 8,
    bloque: "SPRINT FINAL",
    bloqueColor: "#8B5CF6",
    tiempo: 8 * 60,
    letra: "I",
    titulo: "RETO 8 — Economía Circular para el Aceite de Motor",
    icono: "♻️",
    tipo: "esquema",
    enunciado: "Diseñen un esquema de ECONOMÍA CIRCULAR para el aceite de motor en un centro MRO. El esquema debe incluir al menos 4 nodos conectados con flechas y etiquetas: fuente → uso → residuo → tratamiento → reintegración o disposición final.",
    criterios: [
      "Mínimo 4 nodos con etiquetas claras y flechas de dirección",
      "Debe incluir el proceso de re-refinado o co-procesamiento como alternativa",
      "Cada nodo debe tener un responsable o actor identificado",
      "El esquema cierra el ciclo (no termina en 'basura' sin tratamiento)",
    ],
    respuestaEjemplo: "Motor en servicio → Drenaje y almacenamiento temporal etiquetado → Gestor autorizado (re-refinado) → Aceite base regenerado → Nuevo lubricante o combustible alternativo → Reintegración al sistema",
    feedback: "✅ El esquema es válido si cierra el ciclo, identifica actores y no tiene vertidos sin tratamiento. La economía circular en MRO reduce costos de gestión de residuos hasta en un 40%.",
    pista: "¿Qué le pasa al aceite después de ser recogido por el gestor? Puede ser re-refinado o usado como combustible alternativo."
  },
  {
    id: 9,
    bloque: "SPRINT FINAL",
    bloqueColor: "#8B5CF6",
    tiempo: 8 * 60,
    letra: "Ó",
    titulo: "RETO 9 — Dilema: Expansión del Aeropuerto Regional",
    icono: "⚖️",
    tipo: "debate",
    enunciado: "DILEMA AMBIENTAL: Un aeropuerto regional panameño propone expandir operaciones aumentando vuelos en un 40%. Esto generará empleo para 200 familias, pero incrementará emisiones de CO₂ en un 35% y el nivel de ruido en comunidades aledañas superará los límites del Anexo 16 de ICAO.",
    pregunta: "¿Debe aprobarse la expansión? Presenten una posición argumentada con AL MENOS 2 condiciones técnicas ambientales concretas que deben exigirse como requisito.",
    criteriosEvaluacion: [
      "Posición clara (aprueba con condiciones / rechaza con alternativa)",
      "Mínimo 2 condiciones técnicas concretas y viables (no genéricas)",
      "Referencia a al menos 1 normativa o estándar (ICAO, ISO, ley nacional)",
      "Consideración del eje social (familias) y ambiental (emisiones/ruido)",
    ],
    ejemploRespuesta: "Posición: Aprobación condicionada. Condiciones: (1) Estudio de Impacto Ambiental (EIA) obligatorio previo a cualquier obra, (2) Instalación de barreras acústicas certificadas para no superar Capítulo 14 ICAO, (3) Compensación de carbono equivalente al 35% de incremento mediante reforestación o bonos de carbono, (4) Monitoreo continuo de emisiones con reporte trimestral a ANAM/MiAmbiente.",
    feedback: "✅ No existe una única respuesta correcta, pero toda posición válida debe incluir condiciones técnicas verificables, no solo principios generales.",
    pista: "Piensen en términos del triángulo de sostenibilidad: ambiental + social + económico. Las 3 dimensiones deben estar en la respuesta."
  },
  {
    id: 10,
    bloque: "SPRINT FINAL",
    bloqueColor: "#8B5CF6",
    tiempo: 8 * 60,
    letra: "N",
    titulo: "RETO 10 — Plan de Acción Correctiva ISO 14001",
    icono: "📊",
    tipo: "planaccion",
    enunciado: "MISIÓN FINAL: El Centro MRO del Aeropuerto de Tocumen recibió una auditoría ISO 14001 con 3 no conformidades detectadas. Tienen 48 horas para presentar el Plan de Acción Correctiva completo:",
    noConformidades: [
      { id: 1, descripcion: "Residuos peligrosos almacenados sin etiquetado ni ficha de seguridad visible." },
      { id: 2, descripcion: "Ausencia de registro documentado de consumo energético mensual." },
      { id: 3, descripcion: "Personal técnico sin capacitación ambiental documentada en los últimos 12 meses." },
    ],
    columnasPlan: ["No Conformidad", "Causa Raíz", "Acción Correctiva", "Responsable", "Plazo"],
    respuestaEjemplo: [
      ["NC1: Sin etiquetado", "Falta de procedimiento de etiquetado y supervisión en área de almacenamiento", "Etiquetar todos los contenedores con tipo, fecha y volumen + instalar fichas SDS visibles", "Jefe de Taller / Responsable Ambiental", "24 horas"],
      ["NC2: Sin registro energético", "No existe formato ni sistema de medición establecido", "Instalar medidores por área y crear formato de registro mensual con responsable asignado", "Jefe de Infraestructura", "48 horas / cierre en 30 días"],
      ["NC3: Sin capacitación documentada", "No se gestionó certificado ni registro de asistencia de la capacitación anterior", "Programar capacitación de 4 horas + emitir certificados + archivar en expediente del técnico", "Recursos Humanos / RRHH", "30 días"],
    ],
    feedback: "✅ El plan es válido si cada NC tiene causa raíz identificada (no solo síntoma), acción específica (no genérica), responsable nominal y plazo diferenciado entre acción inmediata (24-48h) y cierre definitivo (30 días).",
    pista: "La causa raíz NO es la misma que la no conformidad. Pregúntense: ¿por qué ocurrió esto?"
  }
];

// ─── UTILIDADES ───────────────────────────────────────────────────────────────
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

// ─── COMPONENTES DE UI ────────────────────────────────────────────────────────
function BarraProgreso({ completados, total, letras }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid #1e3a5f" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#94a3b8", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Fragmentos obtenidos</span>
        <span style={{ color: "#38bdf8", fontSize: 12, fontWeight: 700 }}>{completados}/{total}</span>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
        {PASSWORD_DISPLAY.map((letra, i) => (
          <div key={i} style={{
            width: 32, height: 38, borderRadius: 6,
            background: i < completados ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "#1e293b",
            border: i < completados ? "1px solid #38bdf8" : "1px solid #334155",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: i < completados ? "#fff" : "#334155",
            fontWeight: 900, fontSize: 15,
            fontFamily: "'Courier New', monospace",
            transition: "all 0.4s ease",
            boxShadow: i < completados ? "0 0 10px rgba(56,189,248,0.4)" : "none"
          }}>
            {i < completados ? letra : "?"}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cronometro({ segundos, total, corriendo }) {
  const pct = (segundos / total) * 100;
  const color = pct > 50 ? "#22c55e" : pct > 25 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 42, fontFamily: "'Courier New', monospace", fontWeight: 900,
        color: corriendo ? color : "#64748b",
        textShadow: corriendo ? `0 0 20px ${color}60` : "none",
        transition: "color 0.5s" }}>
        {fmtTime(segundos)}
      </div>
      <div style={{ height: 4, background: "#1e293b", borderRadius: 2, margin: "6px 0", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.5s, background 0.5s" }} />
      </div>
    </div>
  );
}

// ─── PANTALLA: INTRO ──────────────────────────────────────────────────────────
function PantallaIntro({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020617 0%,#0c1a2e 60%,#0a0f1e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Segoe UI', sans-serif" }}>

      <div style={{ fontSize: 64, marginBottom: 8, filter: "drop-shadow(0 0 20px #38bdf8)" }}>✈️</div>

      <div style={{ background: "linear-gradient(90deg,#0ea5e9,#38bdf8,#0ea5e9)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        fontSize: 28, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase",
        textAlign: "center", marginBottom: 4 }}>
        OPERACIÓN
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: 6,
        textTransform: "uppercase", textAlign: "center", marginBottom: 8 }}>
        CÓDIGO VERDE
      </div>

      <div style={{ background: "#1e3a5f", border: "1px solid #0ea5e9", borderRadius: 8,
        padding: "6px 20px", marginBottom: 24, display: "inline-block" }}>
        <span style={{ color: "#38bdf8", fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>VERSIÓN A — {EQUIPOS.join(" · ")}</span>
      </div>

      <div style={{ maxWidth: 400, textAlign: "center", color: "#94a3b8", fontSize: 14,
        lineHeight: 1.7, marginBottom: 32 }}>
        Misión de alto impacto ambiental. Tu equipo tiene <strong style={{ color: "#f59e0b" }}>90 minutos</strong> para superar
        10 retos de gestión ambiental aeronáutica y descifrar el código de acceso al sistema.
        Cada reto superado revela un fragmento del código.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 380, marginBottom: 28 }}>
        {[
          { color: "#F59E0B", label: "BLOQUE 1 — CALENTAMIENTO", sub: "3 retos · 10 min cada uno" },
          { color: "#EF4444", label: "BLOQUE 2 — NÚCLEO TÉCNICO", sub: "4 retos · 8 min cada uno" },
          { color: "#8B5CF6", label: "BLOQUE 3 — SPRINT FINAL", sub: "3 retos · 8 min cada uno" },
        ].map((b, i) => (
          <div key={i} style={{ background: "#0f172a", border: `1px solid ${b.color}40`,
            borderLeft: `3px solid ${b.color}`, borderRadius: 8, padding: "10px 14px",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{b.label}</span>
            <span style={{ color: "#64748b", fontSize: 11 }}>{b.sub}</span>
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{
        background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
        border: "none", borderRadius: 12, padding: "16px 40px",
        color: "#fff", fontSize: 16, fontWeight: 900, letterSpacing: 3,
        textTransform: "uppercase", cursor: "pointer",
        boxShadow: "0 4px 24px rgba(14,165,233,0.5)",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        🚀 INICIAR MISIÓN
      </button>
    </div>
  );
}

// ─── PANTALLA: VICTORIA ───────────────────────────────────────────────────────
function PantallaVictoria({ tiempoRestante }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020617,#0c1a2e)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Segoe UI', sans-serif", textAlign: "center" }}>

      <div style={{ fontSize: 72, marginBottom: 16, animation: "pulse 1s infinite" }}>🏆</div>

      <div style={{ fontSize: 26, fontWeight: 900, color: "#22c55e", letterSpacing: 4,
        textTransform: "uppercase", marginBottom: 8 }}>
        ¡MISIÓN CUMPLIDA!
      </div>
      <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>
        Código descifrado con {fmtTime(tiempoRestante)} de tiempo restante
      </div>

      <div style={{ background: "#0f172a", border: "2px solid #22c55e", borderRadius: 16,
        padding: "20px 32px", marginBottom: 28 }}>
        <div style={{ color: "#64748b", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          Código de acceso desbloqueado
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {PASSWORD_DISPLAY.map((l, i) => (
            <div key={i} style={{
              width: 36, height: 44, borderRadius: 8,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: 18,
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 0 12px rgba(34,197,94,0.5)"
            }}>{l}</div>
          ))}
        </div>
        <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 22, marginTop: 12,
          letterSpacing: 4, fontFamily: "'Courier New', monospace" }}>
          {PASSWORD}
        </div>
      </div>

      <div style={{ color: "#64748b", fontSize: 13, maxWidth: 360 }}>
        Entreguen este código a su Directora Operativa para registrar la victoria del equipo.
      </div>
    </div>
  );
}

// ─── PANTALLA: RETO ───────────────────────────────────────────────────────────
function PantallaReto({ reto, onComplete, retoIndex, totalRetos }) {
  const [seleccion, setSeleccion] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [correcto, setCorrecto] = useState(false);
  const [segundos, setSegundos] = useState(reto.tiempo);
  const [corriendo, setCorriendo] = useState(false);
  const [mostrarPista, setMostrarPista] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setSeleccion(null); setRespondido(false); setCorrecto(false);
    setSegundos(reto.tiempo); setCorriendo(false); setMostrarPista(false);
    clearInterval(timerRef.current);
  }, [reto.id]);

  useEffect(() => {
    if (corriendo && segundos > 0) {
      timerRef.current = setInterval(() => setSegundos(s => s - 1), 1000);
    }
    if (segundos === 0 && corriendo) { clearInterval(timerRef.current); setCorriendo(false); }
    return () => clearInterval(timerRef.current);
  }, [corriendo, segundos]);

  const iniciarCronometro = () => { if (!respondido) setCorriendo(true); };

  const handleSeleccion = (id) => {
    if (respondido || !corriendo) return;
    setSeleccion(id);
    const op = reto.opciones?.find(o => o.id === id);
    if (op?.correcta) {
      setRespondido(true); setCorrecto(true); setCorriendo(false);
      clearInterval(timerRef.current);
    } else {
      setRespondido(true); setCorrecto(false); setCorriendo(false);
      clearInterval(timerRef.current);
    }
  };

  const esTipoAbierto = ["ordenamiento","matriz","esquema","debate","planaccion","verdaderofalso"].includes(reto.tipo);

  const completarManual = () => {
    setRespondido(true); setCorrecto(true); setCorriendo(false);
    clearInterval(timerRef.current);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617",
      fontFamily: "'Segoe UI', sans-serif", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${reto.bloqueColor}20,${reto.bloqueColor}10)`,
        borderBottom: `2px solid ${reto.bloqueColor}40`, padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: reto.bloqueColor, fontSize: 10, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase" }}>{reto.bloque}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{reto.titulo}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#64748b", fontSize: 10 }}>RETO</div>
            <div style={{ color: reto.bloqueColor, fontSize: 20, fontWeight: 900 }}>
              {retoIndex + 1}<span style={{ color: "#334155" }}>/{totalRetos}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Letra fragmento */}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 8px" }}>
          <div style={{ background: "#0f172a", border: `2px solid ${reto.bloqueColor}60`,
            borderRadius: 12, padding: "8px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#64748b", fontSize: 11, letterSpacing: 2 }}>FRAGMENTO</span>
            <div style={{
              width: 36, height: 42, background: respondido && correcto
                ? `linear-gradient(135deg,${reto.bloqueColor},${reto.bloqueColor}aa)`
                : "#1e293b",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              color: respondido && correcto ? "#fff" : "#334155",
              fontWeight: 900, fontSize: 18, fontFamily: "'Courier New', monospace",
              border: `1px solid ${respondido && correcto ? reto.bloqueColor : "#334155"}`,
              boxShadow: respondido && correcto ? `0 0 12px ${reto.bloqueColor}60` : "none",
              transition: "all 0.5s"
            }}>
              {respondido && correcto ? reto.letra : "?"}
            </div>
          </div>
        </div>

        {/* Cronómetro */}
        <div style={{ background: "#0f172a", borderRadius: 12, padding: "12px 16px",
          border: "1px solid #1e293b", marginBottom: 12 }}>
          <Cronometro segundos={segundos} total={reto.tiempo} corriendo={corriendo} />
          {!corriendo && !respondido && (
            <button onClick={iniciarCronometro} style={{
              width: "100%", background: `linear-gradient(135deg,${reto.bloqueColor},${reto.bloqueColor}aa)`,
              border: "none", borderRadius: 8, padding: "10px 0", color: "#fff",
              fontWeight: 700, fontSize: 13, cursor: "pointer", letterSpacing: 1
            }}>▶ INICIAR CRONÓMETRO</button>
          )}
        </div>

        {/* Enunciado */}
        <div style={{ background: "#0f172a", borderRadius: 12, padding: 16,
          border: "1px solid #1e293b", marginBottom: 12 }}>
          <div style={{ color: "#64748b", fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 8 }}>Enunciado</div>
          <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {reto.enunciado}
          </p>
          {reto.pregunta && (
            <p style={{ color: "#f59e0b", fontSize: 14, lineHeight: 1.6, margin: "10px 0 0",
              fontWeight: 600, fontStyle: "italic" }}>{reto.pregunta}</p>
          )}
          {reto.noConformidades && (
            <div style={{ marginTop: 10 }}>
              {reto.noConformidades.map(nc => (
                <div key={nc.id} style={{ background: "#1e293b", borderRadius: 8,
                  padding: "8px 12px", marginBottom: 6, borderLeft: "3px solid #ef4444" }}>
                  <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 12 }}>NC {nc.id}: </span>
                  <span style={{ color: "#cbd5e1", fontSize: 13 }}>{nc.descripcion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Opciones seleccionables */}
        {reto.opciones && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {reto.opciones.map(op => {
              const esSeleccionada = seleccion === op.id;
              const esCorrecta = op.correcta;
              let bg = "#0f172a", border = "#1e293b", color = "#e2e8f0";
              if (respondido) {
                if (esCorrecta) { bg = "#14532d"; border = "#22c55e"; color = "#fff"; }
                else if (esSeleccionada) { bg = "#450a0a"; border = "#ef4444"; color = "#fff"; }
              } else if (esSeleccionada) { bg = "#1e3a5f"; border = "#38bdf8"; }
              return (
                <button key={op.id} onClick={() => handleSeleccion(op.id)} style={{
                  background: bg, border: `1px solid ${border}`, borderRadius: 10,
                  padding: "12px 14px", textAlign: "left", cursor: respondido ? "default" : "pointer",
                  display: "flex", gap: 10, alignItems: "flex-start"
                }}>
                  <span style={{ background: "#1e293b", borderRadius: 6, width: 24, height: 24,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#64748b", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {op.id.toUpperCase()}
                  </span>
                  <span style={{ color, fontSize: 14, lineHeight: 1.5 }}>{op.texto}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Afirmaciones V/F */}
        {reto.afirmaciones && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {reto.afirmaciones.map(af => (
              <div key={af.id} style={{ background: "#0f172a", border: "1px solid #1e293b",
                borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ color: "#e2e8f0", fontSize: 13, margin: "0 0 8px", lineHeight: 1.5 }}>
                  {af.id}. {af.texto}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ background: af.respuesta ? "#14532d" : "#1e293b",
                    border: `1px solid ${af.respuesta ? "#22c55e" : "#334155"}`,
                    color: af.respuesta ? "#22c55e" : "#64748b",
                    padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>V</span>
                  <span style={{ background: !af.respuesta ? "#450a0a" : "#1e293b",
                    border: `1px solid ${!af.respuesta ? "#ef4444" : "#334155"}`,
                    color: !af.respuesta ? "#ef4444" : "#64748b",
                    padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>F</span>
                  {af.explicacion && (
                    <span style={{ color: "#f59e0b", fontSize: 11, alignSelf: "center",
                      flexShrink: 1 }}>⚠️ {af.explicacion}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Criterios para retos abiertos */}
        {(reto.criterios || reto.criteriosEvaluacion) && (
          <div style={{ background: "#0f172a", borderRadius: 12, padding: 14,
            border: "1px solid #1e293b", marginBottom: 12 }}>
            <div style={{ color: "#64748b", fontSize: 10, letterSpacing: 2,
              textTransform: "uppercase", marginBottom: 8 }}>Criterios de evaluación</div>
            {(reto.criterios || reto.criteriosEvaluacion).map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: reto.bloqueColor, fontSize: 12, flexShrink: 0 }}>✦</span>
                <span style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pista */}
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => setMostrarPista(!mostrarPista)} style={{
            background: "transparent", border: "1px solid #334155",
            borderRadius: 8, padding: "8px 14px", color: "#64748b",
            fontSize: 12, cursor: "pointer", width: "100%", textAlign: "left"
          }}>
            {mostrarPista ? "🔒 Ocultar pista" : "💡 Mostrar pista (-10s del tiempo)"}
          </button>
          {mostrarPista && (
            <div style={{ background: "#1c1a08", border: "1px solid #854d0e",
              borderRadius: 8, padding: 12, marginTop: 6 }}>
              <span style={{ color: "#fbbf24", fontSize: 13 }}>💡 {reto.pista}</span>
            </div>
          )}
        </div>

        {/* Feedback */}
        {respondido && (
          <div style={{ background: correcto ? "#14532d" : "#450a0a",
            border: `1px solid ${correcto ? "#22c55e" : "#ef4444"}`,
            borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <p style={{ color: correcto ? "#86efac" : "#fca5a5", fontSize: 13,
              lineHeight: 1.6, margin: 0 }}>{reto.feedback}</p>
          </div>
        )}

        {/* Botón completar reto abierto */}
        {esTipoAbierto && !respondido && corriendo && (
          <button onClick={completarManual} style={{
            width: "100%", background: `linear-gradient(135deg,${reto.bloqueColor},${reto.bloqueColor}90)`,
            border: "none", borderRadius: 10, padding: "14px 0", color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8, letterSpacing: 1
          }}>
            ✅ RETO COMPLETADO — OBTENER FRAGMENTO
          </button>
        )}

        {/* Siguiente reto */}
        {respondido && (
          <button onClick={onComplete} style={{
            width: "100%",
            background: correcto
              ? "linear-gradient(135deg,#22c55e,#16a34a)"
              : "linear-gradient(135deg,#64748b,#475569)",
            border: "none", borderRadius: 10, padding: "14px 0", color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 1
          }}>
            {correcto ? "→ SIGUIENTE RETO" : "→ CONTINUAR (sin fragmento)"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [pantalla, setPantalla] = useState("intro");
  const [retoActual, setRetoActual] = useState(0);
  const [completados, setCompletados] = useState(0);
  const [tiempoGlobal, setTiempoGlobal] = useState(TOTAL_TIME);
  const [tiempoFinal, setTiempoFinal] = useState(0);
  const timerGlobalRef = useRef(null);

  useEffect(() => {
    if (pantalla === "reto") {
      timerGlobalRef.current = setInterval(() => {
        setTiempoGlobal(t => {
          if (t <= 1) { clearInterval(timerGlobalRef.current); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerGlobalRef.current);
  }, [pantalla]);

  const iniciarMision = () => { setPantalla("reto"); setRetoActual(0); };

  const completarReto = (correcto) => {
    const nuevosCompletados = correcto ? completados + 1 : completados;
    setCompletados(nuevosCompletados);
    if (retoActual + 1 >= RETOS.length) {
      setTiempoFinal(tiempoGlobal);
      clearInterval(timerGlobalRef.current);
      setPantalla("victoria");
    } else {
      setRetoActual(r => r + 1);
    }
  };

  if (pantalla === "intro") return <PantallaIntro onStart={iniciarMision} />;
  if (pantalla === "victoria") return <PantallaVictoria tiempoRestante={tiempoFinal} />;

  const reto = RETOS[retoActual];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      {/* Barra superior global */}
      <div style={{ background: "#0a0f1e", borderBottom: "1px solid #1e293b",
        padding: "8px 16px", display: "flex", justifyContent: "space-between",
        alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ color: "#38bdf8", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
          ✈️ CÓDIGO VERDE — V.A
        </span>
        <span style={{
          fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 900,
          color: tiempoGlobal < 600 ? "#ef4444" : tiempoGlobal < 1800 ? "#f59e0b" : "#22c55e"
        }}>
          ⏱ {fmtTime(tiempoGlobal)}
        </span>
      </div>

      {/* Barra de fragmentos */}
      <div style={{ padding: "12px 16px 0" }}>
        <BarraProgreso completados={completados} total={RETOS.length}
          letras={PASSWORD_DISPLAY} />
      </div>

      <PantallaReto
        reto={reto}
        retoIndex={retoActual}
        totalRetos={RETOS.length}
        onComplete={() => completarReto(true)}
      />
    </div>
  );
}
