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

Además se registran: participante (P1–P25), grupo (Mañana/Tarde), condición, tarea, inicio, fin, duración en segundos, ancho de pantalla, versión y la hora en que la hoja recibió la fila (`recibido`).

Cada respuesta se guarda **primero en el navegador** y luego se envía a una **hoja de Google Sheets** en tu Drive, como una fila nueva. Si se cae el internet, queda pendiente y se envía sola después. Si una respuesta llega dos veces, la hoja no la duplica.

## Cómo publicarlo

### 1. GitHub Pages
1. En el repositorio, entrá a **Settings → Pages → Build and deployment**.
2. Elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guardá.
3. La dirección queda como `https://<usuario>.github.io/<repo>/`.

### 2. Hoja de Google Sheets que recibe los datos
1. En tu carpeta de Google Drive, creá una **Hoja de cálculo de Google** nueva, por ejemplo `RTLX resultados`.
2. En la hoja, abrí **Extensiones → Apps Script**.
3. Borrá lo que aparece y pegá todo el contenido de [`apps-script/Code.gs`](apps-script/Code.gs). Guardá con el ícono del disquete.
4. Tocá **Implementar → Nueva implementación**. En el engranaje elegí **Aplicación web**.
5. Configuralo así:
   - **Ejecutar como**: Yo.
   - **Quién tiene acceso**: Cualquier persona.
6. Tocá **Implementar** y aceptá los permisos. Google puede mostrar "Google no verificó esta app": entrá a *Configuración avanzada → Ir a …*, porque la app es tuya.
7. Copiá la **URL de la aplicación web**; termina en `/exec`.

### 3. Conectar
1. En `index.html`, pegá esa URL en `const SHEETS_URL = "";`.
2. `SHEETS_KEY` ya coincide con `CLAVE` en `Code.gs`. Si cambiás una, cambiá la otra.
3. Subí el cambio al repositorio. Al abrir la página tiene que decir **"Conectado a Google Sheets"**.

> Si después modificás `Code.gs`, usá **Implementar → Gestionar implementaciones → Editar → Nueva versión**. Así conservás la misma URL.

**Sobre la clave:** el repositorio es público, así que cualquiera que lea el código podría ver la clave. La clave evita envíos al azar, pero no es una protección fuerte. La hoja solo acepta filas con el formato del formulario, y conviene que revisés que los ID de participante sean los tuyos.

## Uso
**Enlace para estudiantes:** `https://lorelirojasm-lgtm.github.io/RTLX_FORMULARIO_ONLINE/`

1. El estudiante elige su **P asignado** (P1 a P25) y su **grupo** (Mañana o Tarde), y toca **Continuar**. Es el mismo formato del formulario del equipo, así que las respuestas se cruzan por `participante` + `grupo`.
2. Lee las instrucciones y marca las 6 escalas. El formulario no deja terminar si falta alguna.
3. Al terminar ve **"¡Gracias! Sus respuestas se guardaron correctamente"** solo cuando la hoja confirmó que recibió la fila. Si falla el internet, se le pide no cerrar la página y tocar **Reintentar**.

**Parámetros opcionales del enlace** (se guardan en la hoja sin que el estudiante los vea):
- `?cond=socratico` o `?cond=prompt`, para mandarle a cada grupo su propio enlace con la condición.
- `&tarea=T1`, para indicar la tarea.

**Modo investigador:** agregá `?admin=1` al enlace para ver el estado de la conexión, las respuestas pendientes y el respaldo CSV de ese navegador.

## Referencias
- Arquer, I., y Nogareda, C. (1999). *Estimación de la carga mental de trabajo: el método NASA TLX* (NTP 544). INSHT.
- Hart, S. G., y Staveland, L. E. (1988). Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research. En P. A. Hancock y N. Meshkati (Eds.), *Human Mental Workload* (pp. 139–183). North-Holland.
- López Núñez, M. I., Rubio Valdehita, S., y Luceño Moreno, L. (2010). Fase de ponderación del NASA-TLX: ¿un paso innecesario en la aplicación del instrumento? *EduPsykhé, 9*(2), 159–175.
- Noyes, J. M., y Bruneau, D. P. J. (2007). A self-analysis of the NASA-TLX workload measure. *Ergonomics, 50*(4), 514–519.
- Trujillo, A. C. (2011). *Evaluation of electronic formats of the NASA Task Load Index* (NASA/TM-2011-217166). NASA Langley Research Center.
