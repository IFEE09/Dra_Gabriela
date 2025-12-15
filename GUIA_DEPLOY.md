# Guía para subir tu sitio a GitHub Pages

¡Tu proyecto ya está listo localmente! He inicializado el repositorio Git y guardado todos tus cambios. Sigue estos pasos para publicarlo en internet:

## Paso 1: Crear el repositorio en GitHub
1. Ve a [GitHub.com](https://github.com) e inicia sesión.
2. Haz clic en el botón **+** (arriba a la derecha) y selecciona **"New repository"**.
3. Nombre del repositorio: `dr-gabriela-canche` (o el que prefieras).
4. Asegúrate de que esté en **Public**.
5. **No** marques ninguna casilla de "Initialize this repository with..." (README, .gitignore, license).
6. Haz clic en **"Create repository"**.

## Paso 2: Conectar y subir tu código
Copia los comandos que aparecen en la sección **"…or push an existing repository from the command line"** en GitHub. Se verán parecidos a estos (¡pero usa los tuyos!):

```bash
git remote add origin https://github.com/TU_USUARIO/dr-gabriela-canche.git
git branch -M main
git push -u origin main
```

Ejecuta esos comandos en tu terminal.

## Paso 3: Activar GitHub Pages
1. Una vez subido el código, ve a la pestaña **Settings** de tu repositorio en GitHub.
2. En el menú de la izquierda, haz clic en **Pages**.
3. En **Source**, selecciona `Deploy from a branch`.
4. En **Branch**, selecciona `main` y la carpeta `/ (root)`.
5. Haz clic en **Save**.

¡Listo! En unos minutos, GitHub te dará el link de tu página web (usualmente `https://tu-usuario.github.io/dr-gabriela-canche/`).
