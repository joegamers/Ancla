# Guía de Despliegue de Ancla (Web / PWA)

Para que Ancla esté disponible para tus usuarios sin pasar por la Play Store, la mejor opción es desplegarla como una **PWA (Progressive Web App)**. Aquí tienes los pasos detallados:

## Opción 1: Despliegue en Vercel (Recomendado)

Vercel es gratuito, rápido y configura automáticamente el HTTPS (necesario para que la PWA sea instalable).

1.  **Sube tu código a GitHub**:
    *   Crea un repositorio privado o público en GitHub.
    *   Sube todos los archivos del proyecto (exceptuando `node_modules` y `dist` que ya están en el `.gitignore`).
2.  **Conecta con Vercel**:
    *   Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
    *   Haz clic en "Add New" → "Project".
    *   Importa tu repositorio de `Ancla`.
3.  **Configuración de Build**:
    *   Vercel detectará automáticamente que es un proyecto Vite.
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Desplegar**:
    *   Haz clic en "Deploy". En menos de un minuto tendrás una URL tipo `ancla.vercel.app`.

---

## Opción 2: Despliegue Directo del APK

Si quieres que los usuarios descarguen el archivo `.apk` directamente:

1.  **Genera el APK**:
    *   Ejecuta `./android/gradlew.bat assembleDebug -p ./android` (como hemos hecho antes).
2.  **Sube el APK**:
    *   Sube el archivo `app-debug.apk` a un servicio de almacenamiento (Google Drive, Dropbox, o mejor aún, GitHub Releases).
3.  **Comparte el Link**:
    *   Pon el link directo de descarga en tus redes sociales o en la biografía de tu perfil.

---

## Tips para el Lanzamiento

*   **Dominio Propio**: Si el proyecto crece, considera comprar un dominio como `ancla.space` o `ancla.life` (suelen costar ~$10/año). Esto da mucha más confianza.
*   **Actualizaciones**: Cada vez que hagas un cambio y lo subas a GitHub, Vercel actualizará la Web App automáticamente. Los usuarios recibirán la nueva versión la próxima vez que abran la App.
*   **Marketing**: Usa el botón "Invitar" que hemos añadido para que los primeros usuarios te ayuden a difundir el link de la PWA.

---
*Desarrollado con ❤️ por JoeGamers Dev*
