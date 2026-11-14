# CV de Javier Mercado Velázquez

Sitio personal bilingüe (español / inglés) hecho con Vue 3 y Vite, publicado en Firebase Hosting.

## Desarrollo

```bash
npm install
npm run dev       # servidor local con recarga en vivo
npm run build     # genera dist/
npm run preview   # sirve dist/ para revisarlo antes de publicar
```

## Cómo actualizar el contenido

Todo el texto vive en `src/content/`. No hace falta tocar los componentes:

| Archivo | Qué contiene |
|---|---|
| `src/content/en.js` | Contenido en inglés |
| `src/content/es.js` | Contenido en español |
| `src/content/links.js` | LinkedIn y GitHub |
| `src/content/organizations.js` | Empresas, clientes y escuela, con su logo (`src/assets/logos/`) |

Ambos archivos de idioma tienen la misma estructura. Si agregas algo en uno, agrégalo también en el otro.

**Puestos:** cada puesto apunta a su empresa con `org`, y opcionalmente a `client` o `project`. Las fechas van como `'AAAA-MM'`; un final `null` significa "Actualidad". La duración se calcula sola.

**Habilidades ligadas:** si el nombre de una habilidad aparece igual en el `tech` de algún puesto, se puede seleccionar para ver y resaltar dónde se usó.

**Proyectos:** la sección se muestra sola en cuanto `projects` tenga al menos un elemento.

**Privacidad:** el sitio es público. No agregues teléfono, correo ni datos internos de empleadores o clientes.

## Modo formal y modo creativo

El sitio abre en **modo formal**. El selector del menú lateral activa el **modo creativo**, que cambia la paleta (colores de la gráfica original) y agrega dos secciones:

- **Laboratorio** (`src/components/creative/`): animación de un salto en MTB con trucos, un juego de penales, un juego de gato (tres en raya) con minimax y Conecta 4 con minimax y poda alfa-beta. Todo con SVG, sin librerías.
- **Fuera del código**: gustos y datos curiosos.

Sus textos están en `src/content/creative.es.js` y `creative.en.js`. Este código solo se descarga cuando se activa el modo. Para compartir el sitio directamente en modo creativo: `/es?mode=creative`.

## Asistente con IA

La sección **Asistente IA** tiene dos funciones:

- **Consulte mi CV**: un chat que responde preguntas sobre el CV.
- **¿Encajo en su vacante?**: compara el CV con el texto de una vacante.

La IA corre en **Cloudflare Workers AI**, con el modelo Llama 3.3 70B. Tiene una cuota gratuita diaria y no necesita tarjeta; si la cuota se agota, deja de responder hasta el día siguiente sin cobrar nada.

El sitio no llama directamente a la IA. Pasa por un pequeño servidor en `worker/`, que:

- arma el contexto con `src/content/es.js` y `en.js`, de modo que al actualizar el CV la IA se actualiza sola;
- solo acepta solicitudes desde los dominios del sitio;
- limita la cantidad de consultas por visitante;
- valida las respuestas antes de enviarlas al sitio.

Si la IA no está disponible, el análisis de vacantes se hace por palabras clave (`src/ai/localMatch.js`).

### Publicar el servidor (una sola vez; requiere Node 20 o superior)

1. Crea una cuenta gratuita en https://dash.cloudflare.com/sign-up.
2. Desde la carpeta `worker/`:

   ```bash
   npx wrangler login
   npx wrangler deploy
   ```

3. Copia la URL que imprime el comando (algo como `https://cv-jmv-ai.<tu-subdominio>.workers.dev`) en `.env.production`:

   ```
   VITE_AI_URL=https://cv-jmv-ai.<tu-subdominio>.workers.dev
   ```

4. Publica el sitio como siempre (push a `main`).

Para probarlo en local, pon `ALLOWED_ORIGINS` con `http://localhost:5173` (ya viene incluido), crea `.env.development.local` con la misma URL y reinicia `npm run dev`. Las vistas previas de los pull requests usan otro dominio, así que en ellas el asistente muestra el análisis por palabras clave.

**Ajustes** en `worker/wrangler.toml`: el modelo (`MODEL`), los dominios permitidos (`ALLOWED_ORIGINS`) y el límite por minuto (`ratelimits`). Las instrucciones que recibe la IA están en `worker/src/prompts.js`.

## Idioma

El idioma se toma de la URL (`/es` o `/en`), luego de la última elección guardada y, si no hay ninguna, del navegador. Cualquier otra ruta se corrige a `/es` o `/en`.

## Logos

UNAM, Grupo Salinas, Banco Santander y GFT provienen de Wikimedia Commons; FES Aragón es el de la versión original. Purpose Financial se muestra con sus iniciales porque no hay un logo público disponible: si consigues uno, colócalo en `src/assets/logos/` y referéncialo en `organizations.js`.

## Publicación

Cada push a `main` compila y publica en Firebase Hosting con GitHub Actions (`.github/workflows/`). Cada pull request genera una vista previa temporal.

Configuración inicial, una sola vez:

```bash
npx firebase-tools login
npx firebase-tools init hosting:github
```

Ese comando crea en GitHub el secret `FIREBASE_SERVICE_ACCOUNT_CV_JMV_DBF66`. Si te pregunta si quiere sobrescribir los workflows, responde que no.

Publicación manual, sin GitHub Actions:

```bash
npm run build
npx firebase-tools deploy --only hosting
```
