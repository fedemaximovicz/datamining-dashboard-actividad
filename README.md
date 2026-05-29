# Actividad Dashboard - Minería de Datos
Esta actividad consiste en construir un dashboard lo mas similar a la imagen elegida en la actividad "Selección de gráfica para visualización de datos".

## Descripción

El dashboard muestra datos reales de una sesión de **carrera de Fórmula 1**, enfocados en un equipo elegido. La interfaz permite seleccionar un **año**, un **evento (Gran Premio)** y un **equipo**, encadenando los filtros entre sí.

Una vez completada la selección, se muestran tres componentes:

- **Posiciones finales** — tabla con la clasificación de la carrera (paginada de a 10 pilotos), resaltando a los pilotos del equipo elegido.
- **Posición por vuelta** — gráfico de línea con la evolución de los dos pilotos del equipo a lo largo de la carrera.
- **Neumáticos y paradas** — gráfico de stints por piloto, donde cada corte representa una parada en boxes y el color indica el compuesto utilizado.

## Tecnologías utilizadas

- **Vue 3** con Composition API y TypeScript — framework principal.
- **Vite** — entorno de desarrollo y empaquetado.
- **Pinia** — manejo del estado global (filtros, carga y datos derivados).
- **Vue Router** — navegación entre vistas.
- **Chart.js** (vía vue-chartjs) — gráficos de línea y de barras.
- **CSS Grid** — estructura del layout, sin librerías de UI externas.
- Interfaz en **modo oscuro** siguiendo la estética de la F1.

## Datos

El dashboard se conecta a la **API pública de [OpenF1](https://openf1.org)** (`https://api.openf1.org/v1`), sin necesidad de credenciales. El detalle:

- Los filtros se llenan en cascada: el año carga los eventos, el evento resuelve la sesión de carrera y deriva los equipos participantes.
- Al elegir un equipo se consultan la clasificación final, las vueltas, los cambios de posición y los stints de sus pilotos.
- La **posición por vuelta** no viene directa de la API: se deriva cruzando el inicio de cada vuelta con el último cambio de posición registrado.
- Las consultas se hacen de forma secuencial y reintentan ante el límite de peticiones (HTTP 429) de OpenF1.
- Si se elige una carrera que todavía no se disputó, se muestra el aviso correspondiente.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

El servidor de desarrollo queda disponible en `http://localhost:5173`
