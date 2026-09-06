---
name: keystatic-clean-multilang-ux
description: Reglas y generador de esquemas para keystatic.config.ts optimizado con UX Writing, Singletons agrupados, multiidioma secuencial y blindaje de diseño.
---

# SKILL: KEYSTATIC SCHEMA & UX WRITING STANDARD

## 1. REGLAS TÉCNICAS DEL ARCHIVO (`keystatic.config.ts`)
- Tipos de campo: Usar SIEMPRE `fields.text()` para cadenas de texto simples o multilínea. NUNCA invocar `fields.string()` (genera TypeError).
- Soporte Multiidioma: Agrupar los campos de idiomas de forma secuencial y paralela (ej: `_es`, `_ca`, `_en`) dentro del mismo contenedor para que el cliente edite todo en una única pantalla sin cambiar de ruta.
- Separación de responsabilidades: El cliente edita contenido y metadatos; el diseño, Tailwind y la maquetación HTML quedan bloqueados fuera del panel.

## 2. UX WRITING OBLIGATORIO EN ETIQUETAS
Prohibido usar nombres técnicos de variables en las propiedades `label` y `description`. Aplicar siempre lenguaje natural de negocio:
- NO: `heroTitle` -> SÍ: `fields.text({ label: 'Titular principal de la portada (H1)', description: 'El texto grande que ve el usuario al entrar' })`
- NO: `metaDescription` -> SÍ: `fields.text({ label: 'Descripción corta para Google', description: 'Resumen que aparece bajo el título en las búsquedas (máx. 160 car.)', multiline: true })`
- NO: `cta_link` -> SÍ: `fields.text({ label: 'Texto del botón de llamada a la acción', description: 'Ej: Contactar por WhatsApp' })`

## 3. ARQUITECTURA DE CONTENIDO
- **Singletons:** Utilizarlos para páginas fijas (`home`, `contacto`, `servicios-global`) y elementos de interfaz independientes (`whatsapp`, `banner-aviso`, `seo-global`). Organizar secciones físicas de la web usando `fields.object()`.
- **Colecciones:** Utilizarlas únicamente para elementos repetibles o dinámicos (artículos de blog, testimonios, FAQs, casos de éxito). Configurar `slugField: 'slug'` en minúsculas y formato kebab-case.
- **Validaciones:** Añadir límites de caracteres mediante `validation: { length: { min: X, max: Y } }` en todos los campos críticos para evitar desbordamientos visuales.