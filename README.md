# Sistema Integral de Gestión, Clipping y Analítica de Prensa
### Subsecretaría de Turismo - Municipalidad de Esquel

Plataforma integral desarrollada para el seguimiento, análisis y carga de gacetillas de prensa y auditoría de clippings de medios de comunicación para la Subsecretaría de Turismo de Esquel.

---

## 🌟 Características Principales

1. **📊 Tablero General de Analítica**:
   - KPIs en tiempo real: volumen de notas producidas, impactos de clipping, tasa de replicabilidad y alcance de la red.
   - Evolución mensual de lanzamientos vs repercusión (Enero a Septiembre).
   - Cadencia semanal continua con promedio de 2.3 gacetillas semanales.
   - Distribución territorial de la cobertura (Local Esquel/Cordillera, Chubut/Patagonia, Nacional e Internacional/Binacional Chile).
   - Tarjetas interactivas de los mayores éxitos noticiosos del año.

2. **📰 Monitor Medio por Medio**:
   - Fichas editoriales personalizadas para medios locales cabecera: **EQS Notas**, **Red 43**, **Diario La Portada**, **Canal 4 Esquel** y **FM del Lago**.
   - Análisis de comportamiento editorial: *qué temas replican generalmente siempre* vs *qué temas suelen ignorar*.
   - Tratamiento especial para **FM del Lago**: Auditoría metodológica y soporte de registro para salidas radiales / entrevistas al aire.
   - Directorio navegable con buscador en vivo de los 150 medios registrados en la base histórica.

3. **🎯 Matriz Causal de Replicabilidad (Éxito vs Falla)**:
   - Desglose de factores determinantes de viralidad (*Factor Récord/Guinness*, *Eclipse Solar Anular 2027*, *Nieve y conectividad*, *Aventura en Los Alerces*).
   - Análisis de denominadores comunes en notas de baja o nula repercusión.
   - **Checklist de Calidad Editorial** para que el redactor verifique los 4 pilares clave antes de emitir una gacetilla.
   - Inventario clasificado de las 83 notas oficiales con filtrado por nivel de impacto.

4. **📝 Panel de Carga y Gestión Operativa**:
   - Formulario para dar de alta **Nuevas Gacetillas** (título, formato, mes, links a Drive y notas web).
   - Formulario para registrar **Nuevos Impactos de Clipping** (con soporte para portales web, TV, gráfica y **Salidas Radiales**).
   - Persistencia local automática en el navegador (`localStorage`).
   - Exportación de la base completa en formato **JSON** y descarga de reportes en **CSV**.

5. **ℹ️ Auditoría y Criterios de Datos**:
   - Modal explicativo en la interfaz que detalla la normalización de medios, criterios de desduplicación y algoritmos de correlación aplicados.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js v18+ (o superior)
- npm o pnpm

### Ejecución Local
```bash
# Clonar el repositorio
git clone https://github.com/leanchoi/esquel-prensa-dashboard.git
cd esquel-prensa-dashboard

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

---

## 🛠️ Tecnologías Utilizadas
- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **Recharts** (Visualizaciones analíticas de series temporales y distribución territorial)
- **Lucide React** (Iconografía)
