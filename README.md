# ⚽ GoalTasker

Gestor de tareas con temática de fútbol — vanilla HTML, CSS y JavaScript.

Hecha para organizar entrenamientos, partidos, objetivos tácticos y cualquier meta personal con un sistema visual de progreso.

---

## 🧠 Funcionalidades

- **CRUD completo** — crear, editar, completar y eliminar tareas
- **Edición completa** — modal para modificar texto, categoría, prioridad y fecha límite
- **Categorías** — entrenamiento, partido, táctica, físico, nutrición y otras
- **Prioridades** — alta, media y baja con badges de color
- **Fechas límite** — date picker con aviso de tarea vencida
- **Drag & drop** — reordena las tareas arrastrándolas con el ratón
- **Barra de progreso** — porcentaje animado según tareas completadas
- **Búsqueda instantánea** — atajo `Ctrl + K`, filtrado en tiempo real con hint visual
- **Filtros** — todas, pendientes o completadas
- **Idiomas ES/EN** — toggle con banderas SVG y traducción completa del UI
- **Modo oscuro** — toggle con animación spin, persistente en localStorage
- **Undo al eliminar** — toast con botón de deshacer durante 4 segundos
- **Toast de confirmación** — feedback visual al añadir tareas
- **Confetti** — partículas al completar una tarea (canvas)
- **Exportar/Importar JSON** — copia de seguridad y restauración de tareas
- **Modal de confirmación** — diálogos personalizados sin `alert()` ni `confirm()` nativos
- **PWA** — instalable en móvil y escritorio, funciona offline
- **Animaciones** — slideIn, slideOut, bounce del balón, flip en los toggles, spin en el tema, transición de tachado
- **Responsive** — mobile-first, se adapta a cualquier pantalla
- **Accesibilidad** — roles ARIA, aria-live, aria-labels con texto de tarea, keyboard navigation, prefers-reduced-motion, focus-visible
- **Persistencia** — todo se guarda en localStorage, sobrevive a cierres y reinicios

---

## 🛠️ Stack

- HTML5 semántico
- CSS3 (custom properties, flexbox, animaciones, grid, pseudo-elementos)
- JavaScript ES6+ (sin frameworks ni librerías)
- LocalStorage API
- HTML5 Drag & Drop API
- Canvas API (confetti)
- Service Worker + Web Manifest (PWA)
- Font Awesome 6 (iconos)
- Google Fonts (Poppins)

---

## 🚀 Cómo ejecutarlo

Es HTML estático, no necesita build ni dependencias.

```bash
git clone https://github.com/CesarMed06/GoalTasker.git
cd GoalTasker
npx serve .
```

O simplemente abre `index.html` en el navegador (para la PWA necesitarás servidor local).

---

## 📁 Estructura

```
GoalTasker/
├── index.html
├── manifest.json
├── service-worker.js
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

---

## ✍️ Autor

**César Medina** — [GitHub](https://github.com/CesarMed06)

Proyecto personal para portfolio. Si te gusta, dale una estrella ⭐
