# Actividad Dashboard - Minería de Datos
Esta actividad consiste en construir un dashboard lo mas similar a la imagen elegida en la actividad "Selección de gráfica para visualización de datos".

## Descripción

El dashboard simula el panel analítico de una cadena de supermercados ubicada en la provincia de Misiones, con cinco sucursales (Posadas, Oberá, Eldorado, Jardín América e Iguazú) y ocho categorías de productos (Almacén, Frutas y verduras, Carnes y pescados, Lácteos, Panadería, Bebidas, Congelados y Limpieza).

La interfaz muestra cuatro KPIs comparativos (ventas totales, ticket promedio, transacciones y margen bruto), una vista de evolución temporal, la distribución de ventas por categoría y por sucursal, un ranking de productos más vendidos y la composición de clientes frecuentes vs ocasionales. Todo se actualiza al cambiar los filtros de período, sucursal, categoría o tipo de comparación.

## Tecnologías utilizadas

- **Vue 3** con Composition API y TypeScript — framework principal.
- **Vite** — entorno de desarrollo y empaquetado.
- **Pinia** — manejo del estado global (filtros y datos derivados).
- **Vue Router** — navegación entre vistas.
- **Chart.js** (vía vue-chartjs) — gráficos de línea y dona.
- **CSS Grid** — estructura del layout, sin librerías de UI externas.
- **Intl.NumberFormat** — formato de moneda (ARS) y números en locale `es-AR`.

## Datos

El dashboard funciona con **datos estáticos generados localmente**, no se conecta a ninguna API ni base de datos. El detalle:

- Se generan aproximadamente **400 días** de historial, hacia atrás desde una fecha fija de referencia, para que los números se mantengan estables entre recargas.
- Cada fila representa las ventas de un día, una sucursal y una categoría, e incluye monto vendido, costo, cantidad de transacciones, transacciones de clientes frecuentes y unidades.
- El generador aplica patrones realistas: incremento de ventas los fines de semana, peso distinto por sucursal y por categoría, márgenes brutos diferenciados por rubro y una tendencia anual de crecimiento.
- Se incluye además un listado fijo de productos top con marcas argentinas reconocibles (La Serenísima, Quilmes, Skip, Taragüi, Bimbo, entre otras).

A partir de esa tabla única, el dashboard calcula todos los KPIs y agregaciones que se ven en pantalla.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

El servidor de desarrollo queda disponible en `http://localhost:5173`