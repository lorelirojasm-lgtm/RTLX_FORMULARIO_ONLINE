# NASA-TLX (Raw) en español — réplica electrónica de la versión en papel

Formulario web de una sola página para aplicar el **Raw TLX** (las seis escalas del NASA-TLX, sin la fase de ponderación) en computadora, diseñado como réplica fiel del formulario en papel.

## Fundamento del diseño

El diseño sigue la *electronic facsimile* evaluada por **Trujillo (2011)**. Ese estudio no encontró diferencias significativas entre la versión en papel y la réplica electrónica.

| Característica | Papel / Trujillo (2011) | Esta versión |
|---|---|---|
| Escalas por pantalla | Todas en una sola hoja/pantalla | Las 6 en una sola pantalla |
| Descripción de cada escala | Sí | Sí (NTP 544) |
| Marca inicial | Ninguna hasta que se toca la escala | Ninguna |
| Forma de responder | Marca sobre una línea continua | Clic en la línea; aparece una barra vertical |
| Números visibles | No | No |
| Escala | 20 intervalos (21 marcas), 0–100 | 20 intervalos (21 marcas, la central más alta), 0–100 |

Los textos y anclajes en español son de **Arquer y Nogareda (NTP 544, INSHT)**. Solo se corrigió la ortografía y se reemplazó "@" por "o/a".

## Datos que se guardan

Por cada participante se guardan dos tipos de valores:

- **`MD, PD, TD, PE, EF, FR`**: puntaje en la escala de 20 intervalos, es decir, la marca más cercana × 5 (0, 5, …, 100).
- **`*_cont`**: la posición exacta del clic (0–100, con un decimal).
- **`RTLX`**: el promedio simple de las seis subescalas. También se guarda `RTLX_cont`.

Además se registran: participante, condición, tarea, inicio, fin, duración en segundos, ancho de pantalla y versión.

Cada respuesta se guarda **primero en el navegador** y luego se sube a OneDrive. Si se cae el internet, queda pendiente y se sube sola después. En OneDrive quedan:

- `Aplicaciones/<nombre de la app>/respuestas/<ID>_<fecha>.json`, un archivo por participante que nunca se sobrescribe.
- `Aplicaciones/<nombre de la app>/rtlx_respuestas.csv`, el consolidado, que se abre directo en Excel.

La app solo tiene permiso para **su propia carpeta** de OneDrive (`Files.ReadWrite.AppFolder`). No puede ver el resto de tus archivos.

## Cómo publicarlo

### 1. GitHub Pages
1. Subí `index.html`, `README.md` y la carpeta `vendor/` al repositorio.
2. En el repositorio, entrá a **Settings → Pages → Build and deployment**.
3. Elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guardá.
4. La dirección queda como `https://<usuario>.github.io/<repo>/`.

### 2. Registro de la app en Microsoft (gratis, con tu cuenta personal)
1. Entrá a <https://entra.microsoft.com> con tu cuenta personal (outlook/hotmail).
2. Andá a **Applications → App registrations → New registration**.
3. **Nombre**: por ejemplo, `RTLX UCR`. Este será el nombre de la carpeta en OneDrive.
4. **Supported account types**: *Personal Microsoft accounts only*.
5. **Redirect URI**: plataforma **Single-page application (SPA)**, con la dirección exacta de GitHub Pages, incluida la `/` final.
6. Creala y copiá el **Application (client) ID**.
7. En **API permissions → Add a permission → Microsoft Graph → Delegated**, agregá `Files.ReadWrite.AppFolder`.

### 3. Conectar
1. En `index.html`, pegá el ID en `const CLIENT_ID = "";`.
2. Subí el cambio al repositorio.
3. En la computadora del laboratorio, abrí la página y tocá **Conectar OneDrive**. Basta una vez por computadora y navegador.

## Uso en cada sesión
1. Pantalla del investigador: revisá que diga **"Conectado a OneDrive"** y completá el ID, la condición y la tarea.
2. **Iniciar con el participante**: pasa a las instrucciones y luego al formulario.
3. El formulario no deja terminar si falta alguna escala.
4. Al terminar, tocá **Siguiente participante**.
5. Al final del día, revisá que diga **"Todo sincronizado"**. Como respaldo extra, usá **Ver datos guardados → Descargar respaldo CSV**.

No uses modo incógnito, porque se pierden las respuestas que todavía no se hayan subido.

## Referencias
- Arquer, I., y Nogareda, C. (1999). *Estimación de la carga mental de trabajo: el método NASA TLX* (NTP 544). INSHT.
- Hart, S. G., y Staveland, L. E. (1988). Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research. En P. A. Hancock y N. Meshkati (Eds.), *Human Mental Workload* (pp. 139–183). North-Holland.
- López Núñez, M. I., Rubio Valdehita, S., y Luceño Moreno, L. (2010). Fase de ponderación del NASA-TLX: ¿un paso innecesario en la aplicación del instrumento? *EduPsykhé, 9*(2), 159–175.
- Noyes, J. M., y Bruneau, D. P. J. (2007). A self-analysis of the NASA-TLX workload measure. *Ergonomics, 50*(4), 514–519.
- Trujillo, A. C. (2011). *Evaluation of electronic formats of the NASA Task Load Index* (NASA/TM-2011-217166). NASA Langley Research Center.

La biblioteca de inicio de sesión incluida en `vendor/` es MSAL.js de Microsoft (licencia MIT, ver `vendor/MSAL-LICENSE.txt`).
