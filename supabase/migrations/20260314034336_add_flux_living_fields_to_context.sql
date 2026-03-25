/*
  # Add Flux Living section fields to context content

  ## Summary
  Adds editable fields for the "Flux Living" / "Vida en comunidad" section
  that appears below the main context section. These fields include:

  - flux_section_label: Small label above the title (e.g. "Flexibilidad")
  - flux_title: Main heading of the Flux Living section
  - flux_description: Paragraph description below the heading
  - step_1_title, step_1_body: First accordion step
  - step_2_title, step_2_body: Second accordion step
  - step_3_title, step_3_body: Third accordion step
  - step_4_title, step_4_body: Fourth accordion step

  ## Changes
  - Updates existing 'context' row in site_content with merged content_json
    that includes the new Flux Living fields alongside existing fields.
*/

UPDATE site_content
SET content_json = content_json || '{
  "flux_section_label": "Flexibilidad",
  "flux_title": "Así funciona Fluxing Living",
  "flux_description": "Un modelo diseñado para adaptarse a cada etapa de tu vida o negocio, sin fricciones y sin el costo de una mudanza.",
  "step_1_title": "Llegas solo",
  "step_1_body": "Entras en tu apartamento de 1 habitación. Espacio ideal para empezar, sin pagar de más.",
  "step_2_title": "Tu equipo crece",
  "step_2_body": "Avisas con anticipación. Incluimos 2 o 3 habitaciones adicionales — sin mudarte, sin nuevo contrato.",
  "step_3_title": "Flexibilidad total",
  "step_3_body": "Salida anticipada o reducción de configuración. El espacio se adapta a tu realidad, no al revés.",
  "step_4_title": "Tu familia llega",
  "step_4_body": "Conectamos los espacios: de 1 a 3 habitaciones, sala amplia y cocina completa. Todo en el mismo edificio."
}'::jsonb
WHERE key = 'context';
