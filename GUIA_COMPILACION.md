# Guía de Compilación de APK para Ancla

Esta guía explica los pasos necesarios para generar el archivo APK de la aplicación sin errores, teniendo en cuenta las configuraciones específicas del entorno.

## Requisitos Previos

- **Node.js**: Instalado y configurado.
- **Android SDK**: Configurado (generalmente vía Android Studio).
- **Java JDK 17**: Es la versión recomendada para esta configuración. La aplicación utiliza el JDK incluido en Android Studio.

## Pasos para Compilar

Sigue estos comandos en orden desde la raíz del proyecto (`c:\xampp\htdocs\Ancla`):

### 1. Construir la aplicación web
Este comando genera los archivos en la carpeta `dist/`.
```powershell
npm run build
```

### 2. Sincronizar con Capacitor
Copia los archivos construidos al proyecto de Android.
```powershell
npx cap sync
```

### 3. Generar el APK
Ejecuta el script de Gradle para ensamblar la versión de depuración (debug).
```powershell
./android/gradlew.bat assembleDebug -p ./android
```

---

## Solución de Problemas Comunes

### Error: "Android Gradle plugin requires Java 17 to run"
Si el sistema intenta usar una versión antigua de Java (como Java 11), el proceso fallará.
- **Solución**: Ya hemos configurado el archivo `android/gradle.properties` para que use automáticamente el JDK de Android Studio:
  `org.gradle.java.home=C:\Program Files\Android\Android Studio\jbr`

### Error: "invalid source release: 21"
Capacitor 8 a veces intenta forzar Java 21.
- **Solución**: Hemos añadido un "override" en `android/app/build.gradle` para forzar la compatibilidad con **Java 17**, que es la versión estable que tienes instalada.

### ¿Dónde está mi APK?
Una vez que el proceso termina con éxito, encontrarás el archivo en:
`android\app\build\outputs\apk\debug\app-debug.apk`

## Consejos Adicionales
- **Limpieza**: Si encuentras errores extraños, borra la carpeta `android/app/build` antes de volver a empezar.
- **Android Studio**: Siempre puedes abrir la carpeta `android/` directamente en Android Studio para generar el APK desde el menú *Build > Build Bundle(s) / APK(s) > Build APK(s)*.
