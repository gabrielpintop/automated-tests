# Suite de pruebas de RedReader

## Requisitos de ejecución

1) Instalar Node JS https://nodejs.org/es/
2) Instalar Android Studio, realizar todas las configuraciones de ambiente, incluyendo el JAVA_HOME y configurar un emulador https://developer.android.com/studio
3) Instalar Appium http://appium.io/docs/en/about-appium/getting-started/?lang=es#installing-appium
4) Tener un emulador ejecutado y conocer el nombre del mismo

## E2E con Appium

Implementa pruebas automatizadas en ambos APK que se encargan de probar algunas funcionalidades base a partir de lo encontrado en las pruebas exploratorias

1) Ejecutar appium con el comando `appium` en un terminal
2) Entrar a la carpeta `appium-testing` y abrir un terminal en la raíz
3) Instalar las dependencias con el comando `npm i`
4) Ejecutar las pruebas con el comando `node index.js nombreEmulador`. Donde se debe reemplazar `nombreEmulador` por el nombre del emulador que se esta ejecutando

Al final de la ejecución se imprimen los resultados de los tests en la consola y dentro de las carpetas `screenhosts/limpia` y `screenhosts/modificada` se encuentran los tests almacenados

Un ejemplo de la ejecución de las pruebas puede ser visto en el siguiente video https://www.youtube.com/watch?v=HrNspm2NZG0

## VRT con Ressemble JS

Implementa pruebas de VRT a partir de las imagenes creadas en las pruebas E2E con Appium

1) Entrar a la carpeta `vrt-testing` y abrir un terminal en la raíz
2) Instalar las dependencias con el comando `npm i`
3) Ejecutar las pruebas con el comando `node index.js`

Al final de la ejecución se imprimen los porcentajes de diferencias de las capturas en la consola, se guardan los resultados en la carpeta results y se genera un archivo report.json con los resultados de las mismas

Un ejemplo de la ejecución de las pruebas puede ser visto en el siguiente video https://www.youtube.com/watch?v=ssBf6GxFs2w
