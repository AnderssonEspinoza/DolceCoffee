# Dolce Coffee — diseño

Una cafetería contemporánea y cercana: tipografía amplia, superficies claras y una bebida real como protagonista. La carta y los precios deben ser fáciles de encontrar. Evitar estética de aplicación administrativa, testimonios inventados, efectos de movimiento repetidos y llamadas a pedidos que no se puedan completar.

## Tokens

| Uso | Valor |
| --- | --- |
| Verde principal | `#234c3b` |
| Verde profundo | `#163d2c` |
| Papel | `#f7f7ed` |
| Amarillo mantequilla | `#f4d978` |
| Salvia | `#e5e9da` |
| Rosa suave | `#eddfd8` |
| Texto secundario | `#536657` |
| Divisores | `#cbd3c5` |
| Títulos y marca | Syne, 600–800, local |
| Texto y controles | DM Sans, 400–700, local |
| Contenido máximo | 1280 px |
| Radios | 6–7 px controles, 13–14 px imágenes y paneles |

## Composición

- Portada: mensaje a la izquierda y frappé recortado sobre arco amarillo a la derecha; una sola entrada animada en escritorio.
- A 900 px la portada se apila; a 760 px aparece el menú desplegable. La carta usa tres, dos o una columna según el espacio disponible.
- Las fotos y recortes proceden del repositorio original. No se generaron imágenes ni testimonios.
- Encabezado, pie, enlaces, foco visible y selección local consistentes en las ocho rutas originales.
- La selección usa un diálogo nativo con cantidades, suma y persistencia local. No representa un pedido enviado.

## Accesibilidad

Idioma español, un h1 por ruta, enlace para saltar al contenido, etiquetas de campos, navegación semántica, nombres de producto en los botones de agregar, estados aria-pressed/expanded, cierre con Escape y respeto a prefers-reduced-motion.

## Contenido pendiente de confirmar

Los nombres de productos son etiquetas descriptivas según las imágenes originales. Los precios conservan los valores originales, en dólares. Los textos institucionales sustituyen Lorem ipsum sin atribuir origen, certificaciones, horarios ni historia comercial. Se requieren datos reales y servicios antes de habilitar cuentas, pagos o contacto remoto.

## Refinamiento local con emil-design-eng

- Botones con respuesta de presión de 140 ms y confirmación temporal al agregar, sin cambiar su tamaño.
- Hover únicamente para puntero preciso; los productos se desplazan 3 px sin rotación.
- Transiciones de interfaz con curvas `--ease-out` y `--ease-drawer`, por debajo de 300 ms. Interacciones de teclado inmediatas.
- Selección en panel lateral con margen en escritorio y panel inferior en móvil; resumen fijo y lista desplazable. Las filas conservan sus nodos y su foco al ajustar cantidades.
- Avisos de cuatro segundos que se pausan con hover, foco o pestaña oculta. Se pueden cerrar manualmente.
- Portada móvil más compacta y destacados con desplazamiento nativo y scroll snap. La carta completa mantiene su cuadrícula.
- Movimiento reducido: se eliminan desplazamientos y se conservan solo fundidos breves.
