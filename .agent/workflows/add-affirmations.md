---
description: Cómo generar y agregar nuevas afirmaciones automáticamente a Ancla
---
# Agregar Nuevas Afirmaciones

Este proceso define cómo la Inteligencia Artificial debe actuar cada vez que el usuario pida agregar nuevas frases, meditaciones o afirmaciones (ya sea basadas en autores famosos, libros, temas o reflexiones propias).

## Reglas Obligatorias de Formato:
1. **Longitud Máxima**: El campo `text` de CADA afirmación **NUNCA debe superar los 120 caracteres**. Si se incluye una cita más una reflexión, ambas deben sumar menos de 120 caracteres en total. (Ej: "Cita del autor. — Mi reflexión personal en primera persona.").
2. **Perspectiva**: Las reflexiones DEBEN estar escritas en primera persona ("Yo...", "Mi...", "Elijo...", "Acepto...", etc.).
3. **Categorías**: Solo usa categorías que estén mapeadas en el sistema (ej. Ansiedad, Estrés, Paz, Relajación, Calma, Serenidad, Entrega, Motivación, Poder, Éxito, Amor, Autoestima, Crecimiento, Salud, Abundancia, Gratitud, Confianza, Seguridad, Enfoque, etc.).
4. **Campos Requeridos**: `id`, `text`, `author`, `category` (`source` es opcional si es un libro).

## Pasos del Agente (IA):

1. **Obtener el último ID**:
   Revisar el final del archivo `src/data/affirmations.json` para saber en qué ID continuo debe comenzar.
   
2. **Generar el contenido**:
   Redactar las afirmaciones solicitadas siguiendo estrictamente las Reglas de Formato (limite de longitud y uso de la primera persona). Si el usuario no específica cuántas crear, genera entre 5 y 10 por defecto.

3. **Insertar en JSON**:
   Agrega los nuevos objetos JSON al final del array en el archivo `src/data/affirmations.json`.

4. **Ejecutar la sincronización**:
   Siempre debes correr el script de sincronización con el Worker.
   // turbo
   `node scripts/sync-affirmations.js`

5. **Desplegar el Worker**:
   Como paso vital, debes hacer el *deploy* a Cloudflare para que las frases y arreglos se apliquen en vivo a los usuarios.
   // turbo
   `cd ancla-push-worker && npm run deploy`

6. **Actualizar el Registro**:
   Abre o modifica el archivo `src/data/Afirmaciones-Registro.md`. 
   Agrega a la lista alfanumérica los nombres del autor, libro o fuentes nuevas que hayas recién generado para mantener el inventario actualizado.

7. **Notificar**:
   Dile al usuario cuáles fueron las frases añadidas (muéstralas en la conversación) y confirma que el worker, el registro y el deploy en Cloudflare han sido ejecutados satisfactoriamente.
