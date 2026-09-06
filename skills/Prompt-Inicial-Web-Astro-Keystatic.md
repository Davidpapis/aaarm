# 🚀 Prompt inicial — Web AAAR en Astro + Keystatic (Adaptado al Proyecto Real)

**Para qué sirve:** Es el prompt maestro y contextualizado para inicializar y construir la web oficial de la **Asociación de Autismo Ángel Rivière (AAAR)** en Marbella utilizando **Astro**, **Tailwind CSS v4** y **Keystatic CMS en la nube con GitHub + Vercel**.
Sustituye cualquier plantilla genérica por las decisiones de arquitectura, copy, diseño y contenido real extraídas del proyecto activo.

---

# ⬇️ EL PROMPT PARA AGENTE / CLAUDE CODE / CURSOR

````markdown
# ROL

Actúas como un equipo senior de tres perfiles especializados trabajando conjuntamente en el desarrollo de la web institucional de la **Asociación de Autismo Ángel Rivière (AAAR)**:

- **Product Designer Senior** — define la jerarquía visual, la accesibilidad cognitiva y los flujos de conversión de dos audiencias críticas (familias que necesitan apoyo diagnóstico/terapéutico y donantes/empresas para el Proyecto Elviria en la sección Proyectos).
- **Front-end Senior Especializado en Astro y Tailwind CSS v4** — escribe código modular, tipado en TypeScript estricto, sin sobrecarga de JavaScript, optimizado para Core Web Vitals y accesible bajo WCAG 2.2 AA.
- **Especialista Técnico SEO & UX Writing en Keystatic** — estructura la web con datos estructurados JSON-LD de Utilidad Pública/ONG, metadatos enriquecidos para posicionamiento local ("autismo Marbella / Málaga") y configura el panel de Keystatic (conectado a GitHub para Vercel) con etiquetas claras en español y esquemas multimedia flexibles (texto, foto, vídeo, audio y sliders).

Tú ejecutas con rigor técnico. **Si algo no está definido en este documento o en la carpeta `.agents/`, preguntas antes de inventar.**

---

# 0. CONTRATO DE TRABAJO (REGLAS QUE NO SE ROMPEN)

1. **Arquitectura Multi-página obligatoria:** La web NO es una página única (One-Page). Se estructura mediante menús individuales con rutas limpias (`/`, `/sobre-nosotros`, `/servicios`, `/proyectos`, `/noticias`, `/contacto`).
2. **Cero invención de datos:** Cifras de socios (80+), metros cuadrados de Elviria (6.650 m²), deducción fiscal IRPF (80% primeros 250 €), teléfonos oficiales (952 903 333 / 618 848 494) y números de registro son exactos e inalterables.
3. **Verificación visual en navegador:** Levanta el servidor local (`npm run dev`), prueba en resolución móvil (375px) y escritorio (1440px), y verifica que no existan errores ni advertencias en consola.
4. **Respeto a la documentación actual:** Consulta la documentación vigente de Astro v5, Tailwind CSS v4 (`@tailwindcss/vite`) y Keystatic (`@keystatic/astro`).
5. **Keystatic en GitHub + Vercel:** Configurado para permitir modo local en desarrollo y modo `github` en producción, permitiendo al equipo de AAAR editar desde `autismoaaar.org/keystatic` y guardar en el repositorio disparando el despliegue automático en Vercel.
6. **Español de España:** Todo el contenido, comentarios de código y textos del panel Keystatic se redactan en español neutro de España.

---

# 1. EL PROYECTO: ASOCIACIÓN AUTISMO ÁNGEL RIVIÈRE (AAAR)

## 1A. Lo esencial

- **Qué es esta web:** Sitio web institucional, informativo y de captación para la **Asociación de Autismo Ángel Rivière (AAAR)**, entidad sin ánimo de lucro fundada en 2002 en Marbella y declarada de **Utilidad Pública** por el Ministerio del Interior en 2022.
- **Nombre y dominio:** Asociación Autismo Ángel Rivière (AAAR) · `autismoaaar.org`
- **A quién le hablamos (Audiencias Clave):**
  1. **Familias con personas autistas (niños y adultos) en Marbella, Málaga y Costa del Sol:** Buscan detección temprana (señales de alerta 2-3 años), valoración diagnóstica oficial, terapias continuas y apoyo familiar sin sentirse juzgados.
  2. **Donantes, Administraciones y Empresas (RSC):** Personas y entidades con capacidad de donación interesadas en el hito del **Proyecto Elviria** (Centro de Día y Residencia) y en beneficiarse del **80% de deducción fiscal** por Utilidad Pública.
- **Acciones principales deseadas:**
  - *Familias:* Solicitar orientación / cita de valoración mediante formulario o contacto telefónico directo / WhatsApp.
  - *Colaboradores:* Realizar una aportación / donación (facilitando datos para el certificado de deducción fiscal IRPF) o solicitar patrocinio corporativo para el Proyecto Elviria.
- **Métrica de éxito:** Nº de contactos de orientación de familias, suscripción de nuevos socios y solicitudes de colaboración/donación para Proyectos.
- **Idioma(s):** Español (`es`) como principal, con arquitectura y campos de Keystatic preparados para soporte multiidioma secuencial (`_es`, `_en`) para atender a la población internacional de la Costa del Sol.
- **Qué NO es esta web:** No es un e-commerce, no lleva pasarela de pago compleja con login ni área privada de pacientes.

## 1B. Documentos de referencia del proyecto

En la carpeta `.agents/` y `recursos/` del proyecto se encuentran las fuentes de verdad:
- `propuesta-estructura.md` — Arquitectura de páginas, flujos de conversión y jerarquía.
- `contenido-nuevo.md` — Textos oficiales revisados por el equipo terapéutico y la junta directiva.
- `copywriting.md` — Guía de tono, voz y fórmulas de conversión.
- `frontend.md` — Principios de diseño visual y desarrollo de componentes firma.
- `skills/keystatic-clean-multilang-ux.md` — Reglas obligatorias para esquemas y UX Writing en Keystatic.
- `assets/images/hero_studio/` — Versiones editadas con iluminación y acabado de estudio arquitectónico:
  - `hero-recepcion-studio.jpg` (Recepción y bienvenida con logotipo AAAR, mármol pulido e iluminación cuidada).
  - `hero-sala-familiar-studio.jpg` (Sala familiar de reunión e intervención con sofás cálidos y luz perimetral).
  - `hero-terapia-sensorial-studio.jpg` (Sala de terapia y desarrollo sensorial con luz natural de jardín y juguetes Montessori).
- `recursos/fotos local/para hero/` — Fotos originales de referencia (`IMG_3850.jpg`, `IMG_3852.jpg`, `IMG_3861.jpg`).

---

# 2. DIRECCIÓN DE DISEÑO Y TOKENS VISUALES

- **Tono:** Empático, riguroso, cálido, profesional y transparente. Lema oficial: *"En la diversidad está el enriquecimiento"*.
- **Decisión visual fuerte:** Acabado editorial premium y humanista. Se abandona la estética médica fría y los colores primarios chillones habituales en autismo, adoptando tonos orgánicos de alta legibilidad y calidez:
  - `--color-bg-primary: #FCFAF2` (Soft Ivory / Marfil Cálido).
  - `--color-brand-blue: #1D265C` (Deep Ocean Blue - confianza institucional y máxima legibilidad).
  - `--color-brand-amber: #F4B32A` (Amber Gold - energía positiva y luz del espectro autista).
  - `--color-brand-coral: #E76F51` (Coral Warm - llamadas a la acción principales y donaciones).
  - `--color-text-dark: #24252E` (Charcoal - tipografía de alta lectura sin la dureza del negro puro).
  - `--color-fiscal-green: #2E7D32` (Fiscal Green - confianza para deducciones fiscales).
- **Tipografía:**
  - **Titulares (Display):** `Outfit` (Google Fonts) — moderna, geométrica y con terminaciones humanistas y amigables.
  - **Cuerpo de texto:** `Work Sans` (Google Fonts) — excelente legibilidad y ritmo editorial.
- **Efectos interactivos y Scroll:**
  - **Hero interactivo / secuencia de giro:** Integración de las fotos en `recursos/fotos local/para hero/` para presentar dinámicamente con scroll suave los 3 conceptos / dimensiones clave del autismo (comunicación e interacción, patrones y rutinas, sensibilidad sensorial y fortalezas únicas).
  - **Animaciones fluidas:** Transiciones cuidadas que aportan una sensación prémium sin sobrecargar el rendimiento ni romper la accesibilidad (`prefers-reduced-motion`).
- **Mis manías — Prohibiciones estrictas:**
  - ❌ NUNCA utilizar piezas de puzzle infantiles multicolores ni metáforas de enfermedad o curación (el autismo es una condición del neurodesarrollo).
  - ❌ NUNCA usar el término "Síndrome de Asperger" como diagnóstico activo sin contextualizar su integración en el DSM-5 como TEA Nivel 1.
  - ❌ Cero iconos genéricos de stock o ilustraciones infantiles no validadas.
  - ❌ Cero carruseles que muevan contenido automáticamente a alta velocidad sin control del usuario.

---

# 3. ARQUITECTURA DE PÁGINAS Y MENÚS INDIVIDUALES

La web se construye como una arquitectura multi-página estática (SSG) de alto rendimiento en Astro con rutas dedicadas:

```
/                       -> Inicio (Hero dinámico interactivo con fotos de recursos/para hero, resumen de pilares, hito de Elviria y llamada a la acción)
/sobre-nosotros         -> Historia, Dr. Ángel Rivière, Estatutos, Registros Oficiales, Equipo y Testimonios
/servicios              -> Evaluación diagnóstica, Terapias individuales, Ocio inclusivo y Deporte adaptado
/proyectos              -> Proyecto Elviria (Centro de Día y Residencia en parcela de 6.650 m²) con Roadmap interactivo de las 5 fases y captación de fondos
/utilidad-publica       -> Declaración ministerial de Utilidad Pública y Calculadora interactiva de deducción IRPF (80%)
/noticias               -> Magazine/Blog de actualidad con soporte multimedia
/noticias/[slug]        -> Detalle de cada noticia o guía (incluyendo el post insignia de alerta 2-3 años)
/contacto               -> Formulario segmentado por motivo, mapa de localización en Birdie Club (Marbella) y canales directos
```

---

# 4. SISTEMA MULTIMEDIA PARA NOTICIAS / POSTS (KEYSTATIC)

En el menú `/noticias`, la asociación publicará contenidos en múltiples formatos. El esquema de Keystatic y la maquetación en Astro deben permitir y renderizar con excelencia los siguientes tipos de post:
1. **Vídeo con texto:** Inserción de vídeo principal (URL de YouTube / Vimeo o subida directa) acompañado de artículo redactado.
2. **Foto con texto:** Imagen destacada de alta resolución con texto maquetado.
3. **Galería / Slider con texto:** Carrusel de fotografías del evento o actividad comunitaria con cuerpo explicativo.
4. **Audio con texto:** Reproductor de podcast o entrevista de radio (ej: intervenciones de la asociación en medios locales de Marbella y Málaga) con transcripción o resumen.
5. **Guía educativa destacada:** Maquetación especial para artículos de fondo como *"Signos de alerta de autismo en niños de 2 a 3 años"*.

---

# 5. COMPONENTES INTERACTIVOS CLAVE (ISLAS DE ASTRO)

1. **Hero con secuencia de scroll / giro:** Conecta las 3 fotos reales de `recursos/fotos local/para hero/` con los 3 aspectos fundamentales del espectro autista.
2. **Calculadora de Deducción Fiscal (Ley 49/2002):**
   - El usuario introduce un importe y calcula al instante la deducción del 80% en los primeros 250 € (recupera 200 €) y el 40% en el restante, con botón para copiar el IBAN en un solo clic.
3. **Roadmap Interactivo de Fases de Proyectos (Elviria):**
   - Selector visual de las 5 fases (Fase 1: Viabilidad y fianza 46.897 € [100%] -> Fase 2: Proyecto básico 75.000 € [60%] -> Fase 3: Terreno y cimentación 320.000 € -> Fase 4: Estructura 850.000 € -> Fase 5: Equipamiento 280.000 €) con botón para patrocinar la fase seleccionada.
4. **Reproductor Modal de Vídeo Institucional:**
   - Vídeo oficial de Ángel Rivière alojado con carga diferida.
5. **Formulario de Contacto Segmentado:**
   - Selector de perfil (Familia / Donación y Utilidad Pública / Voluntariado / Prácticas universitarias).

---

# 6. CONTENIDO REAL Y DATOS VERIFICADOS

- **Titular Principal (H1):** *"Entender el autismo hoy para construir el mañana"*
- **Subtítulo:** *"Brindamos apoyo especializado, diagnóstico clínico y terapias de desarrollo para personas con autismo y sus familias en la Costa del Sol. Acompañamos vidas, inspiramos futuros."*
- **Datos Oficiales de la Asociación:**
  - **Sede:** Urbanización Golf Rio Real, Edificio Birdie Club, Local 2, 29603 Marbella (Málaga).
  - **Teléfonos:** 952 903 333 / 618 848 494
  - **Email:** `autismoaaar@gmail.com`
  - **Socios activos:** Más de 80 familias de toda la provincia de Málaga.
  - **Reconocimiento:** Declarada Entidad de Utilidad Pública por el Ministerio del Interior en 2022.
- **Registros Oficiales:**
  - Registro de Asociaciones de Andalucía: Nº 6003
  - Registro de Servicios Sociales de Andalucía: Nº AS.E/4632
  - Censo de Entidades Colaboradoras de la Enseñanza (Junta de Andalucía): Nº 2113
  - Registro Municipal de Entidades Ciudadanas de Marbella: Nº 132
  - Registro General de Entidades de Voluntariado de Andalucía: Nº 2550
  - Miembro oficial de la Federación de Autismo de Andalucía.
- **Convenios Universitarios y de Prácticas:**
  - Prácticas con 5+ universidades: Universidad de Granada (UGR), Universidad de Málaga (UMA), UNIR, Universidad Internacional de Valencia (UIV) y programa europeo Erasmus+.
- **Entidades Colaboradoras:**
  - Ayuntamiento de Marbella, Fundación "la Caixa", CaixaBank, Rotary Club Marbella, Aguja Solidaria, Fuerte Nagüeles, Asociación CADI, Global Gift Foundation / Casa Ángeles, Alar Consultores, CD Marbella Juega.

---

# 7. CONFIGURACIÓN DE KEYSTATIC (`keystatic.config.ts`)

Conforme a las reglas de `skills/keystatic-clean-multilang-ux.md`:
1. **Regla de campos:** Usar siempre `fields.text()`, nunca `fields.string()`.
2. **UX Writing en español:** Etiquetas claras para el equipo de AAAR:
   - `fields.text({ label: 'Titular de la noticia', description: 'Título principal que se verá en la lista y en la página' })`
   - `fields.text({ label: 'Descripción SEO para Google', description: 'Resumen que aparece en Google (máx. 155 caracteres)', multiline: true })`
3. **Singletons:**
   - `ajustes-generales`: Teléfonos, correo, dirección física, redes sociales y datos bancarios (IBAN).
   - `home`: Textos de portada y configuración del hero.
   - `sobre-nosotros`: Textos de historia, Ángel Rivière y registros.
   - `proyectos`: Información institucional de Elviria y estado de las 5 fases.
   - `utilidad-publica`: Textos explicativos sobre la ley fiscal y deducciones.
4. **Colecciones:**
   - `servicios`: Título, resumen, icono, descripción en Markdown y público objetivo.
   - `noticias`: Colección flexible con selector de formato (`formato`: texto / video / audio / galeria), archivo o URL multimedia, imagen destacada, fecha y cuerpo en Markdown.
   - `testimonios`: Nombre de la familia, testimonio y año.
   - `colaboradores`: Nombre de la entidad, logotipo y enlace web.

---

# 8. PLAN DE EJECUCIÓN POR FASES

## FASE 0 — Auditoría y Preparación
1. Revisión de las 3 imágenes de `recursos/fotos local/para hero/` (`IMG_3850.jpg`, `IMG_3852.jpg`, `IMG_3861.jpg`).
2. Configuración de dependencias de Astro 5, Tailwind CSS v4 y Keystatic con conexión a GitHub.

## FASE 1 — Estructura Base y Rutas Multi-página
1. Scaffolding del proyecto Astro con TypeScript estricto y Tailwind v4.
2. Creación del Layout principal con Navbar (Inicio, Sobre Nosotros, Servicios, Proyectos, Noticias, Utilidad Pública, Contacto) y Footer.
3. Configuración de `keystatic.config.ts` con modo GitHub/local.

## FASE 2 — Desarrollo de Páginas y Componentes
1. Maquetación del **Inicio** con el Hero interactivo animado por scroll basado en las fotos de hero.
2. Maquetación de la página **Proyectos** (Proyecto Elviria con el slider interactivo de fases).
3. Maquetación de la página **Servicios** y **Sobre Nosotros**.
4. Maquetación de la página **Utilidad Pública** con la **Calculadora Fiscal**.
5. Maquetación del módulo **Noticias** con soporte para posts de texto, foto, vídeo, audio y galerías.
6. Maquetación de la página **Contacto**.

## FASE 3 — Carga de Contenido y Pruebas en Vercel
1. Carga de los contenidos validados desde `.agents/contenido-nuevo.md`.
2. Prueba de edición desde `/keystatic` con sincronización en GitHub y despliegue continuo en Vercel.
3. Auditoría de accesibilidad WCAG 2.2 AA y rendimiento Lighthouse ≥ 95.
````
