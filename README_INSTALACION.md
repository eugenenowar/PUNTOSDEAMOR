# Puntos de Amor + Misiones v3 móvil/nube

Esta carpeta contiene una versión preparada para celular, iPad y computador.

## Archivos

- `index.html`: aplicación principal.
- `manifest.webmanifest`, `sw.js` e `icons/`: componentes para abrirla como web app instalada cuando se publique en un hosting estático.
- `google_sheets_backend.gs`: backend opcional para guardar y cargar el mismo estado desde Google Sheets.

## Por qué en algunas nubes se ve el código

Google Drive, OneDrive, Dropbox y servicios similares suelen mostrar los archivos `.html` como vista previa o texto. Eso no equivale a publicarlos como una página web.

Para que en celular se abra como app, publica la carpeta en un hosting estático, por ejemplo Netlify Drop o GitHub Pages.

## Opción rápida: Netlify Drop

1. Entra a Netlify.
2. Usa la opción de arrastrar y soltar carpeta.
3. Sube la carpeta `puntos_amor_app_v3_mobile_cloud`.
4. Abre la URL pública que Netlify genere desde iPhone, iPad o computador.

## Opción GitHub Pages

1. Crea un repositorio.
2. Sube los archivos de esta carpeta.
3. Asegúrate de que el archivo principal se llame `index.html`.
4. Activa GitHub Pages desde Settings > Pages.

## Datos locales vs datos compartidos

- Sin configurar nube: la app guarda en el navegador/dispositivo donde se usa.
- Con backend configurado: la app puede traer y guardar el mismo estado desde varios dispositivos.

## Configurar Google Sheets como nube

1. Crea una Google Sheet.
2. Copia el ID de la hoja desde la URL.
3. Abre Extensiones > Apps Script.
4. Pega el contenido de `google_sheets_backend.gs`.
5. Cambia `PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET` por el ID real.
6. Ejecuta `setup()` una vez y autoriza permisos.
7. Despliega como Web App.
8. Copia la URL terminada en `/exec`.
9. Abre `index.html` y pega esa URL en:

```js
const CLOUD_SYNC_URL = "";
```

Debe quedar así:

```js
const CLOUD_SYNC_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

10. Vuelve a subir/publicar la carpeta.

## Recomendación de uso

Para evitar conflictos, si ambos usan la app desde dispositivos distintos, presionen “Traer datos de la nube” al abrirla y dejen que la app guarde automáticamente después de cada cambio.
