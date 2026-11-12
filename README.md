# Dolce Coffee

Rediseño estático de [AnderssonEspinoza/DolceCoffee](https://github.com/AnderssonEspinoza/DolceCoffee), con HTML, CSS y JavaScript nativo. No requiere instalar dependencias ni compilar.

## Ejecutar

Desde la carpeta del proyecto:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Abrir http://127.0.0.1:4173. Usar un servidor HTTP: los módulos JavaScript no funcionan abriendo los HTML con `file://`.

## Incluye

- Ocho rutas originales rediseñadas y navegación adaptable.
- Carta de 15 productos, filtros de café/comida y precios originales.
- Selección con cantidades, total y guardado en localStorage. Funciona en memoria si el almacenamiento está bloqueado.
- Formulario que prepara un mensaje y permite copiarlo, sin enviarlo.
- Tipografías locales con licencias en assets/fonts; fotografías originales del repositorio.

## Límites

El repositorio original no incluye backend. Las cuentas quedan como vista previa deshabilitada, no se guardan contraseñas y no hay pagos, envío de pedidos ni mensajes remotos. No se publican reseñas ficticias. Los nombres descriptivos de productos y el contenido institucional requieren confirmación comercial antes de publicar.

## Archivos

- `index.html`, `pages/`: páginas estáticas.
- `css/styles.css`: diseño y adaptación por pantalla.
- `js/products.js`: datos para la selección; mantener sus IDs y datos sincronizados con la carta HTML si se edita el catálogo.
- `js/main.js`: menú, filtros, selección y preparación de mensajes.
- `DESIGN.md`: paleta, tipografía y reglas visuales.
- `PRODUCT.md`: contexto y límites del producto.

## Verificación

Revisión en Chromium de las ocho rutas a 1440, 768, 390 y 320 px; comprobación de imágenes, desbordamientos, errores JavaScript y jerarquía h1. Pruebas de filtros, agregar/quitar, total, persistencia, diálogo con Escape, menú móvil, preparación del mensaje y movimiento reducido. No hay una suite de tests persistente ni verificación en dispositivos físicos.
