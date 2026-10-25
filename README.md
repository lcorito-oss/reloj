# Clock Modern Way

Reloj web con anillos concéntricos (día del mes, mes y día de la semana), bandas de resplandor, manecillas en tiempo real y una presentación inicial con un búho y el texto giratorio **Hell-OW**.

Es un solo archivo HTML (HTML + CSS + JavaScript), sin dependencias de paquete ni solicitudes a servicios externos. Usa tipografía local para funcionar igual sin conexión.

## Uso

Abre `index.html` en cualquier navegador.

- **PC / Mac:** pasa el mouse sobre el reloj durante la presentación para ver girar los encabezados. Un clic repite la presentación.
- **Celular:** un toque hace girar los encabezados; otro toque los regresa.

## Publicar con GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)`.

## Comprobación

Con Node.js 18 o posterior, ejecuta `node --test tests/theme-contrast.test.mjs` para verificar que todas las paletas conservan contraste suficiente sobre el fondo negro y que no se solicita una fuente externa.
