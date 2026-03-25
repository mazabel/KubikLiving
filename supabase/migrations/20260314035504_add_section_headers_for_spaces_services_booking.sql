/*
  # Add editable section headers for Espacios, Servicios, and Booking

  ## Summary
  Inserts new site_content rows to make the section titles, subtitles,
  and helper texts of Espacios, Servicios, and Booking editable from the admin.

  ## New content keys
  - `spaces_header`: Controls "Espacios Compartidos" / "Vida en Comunidad" section header
  - `services_header`: Controls "Servicios" section header, description, and category labels
  - `booking`: Already exists — updates it with more editable fields
*/

INSERT INTO site_content (key, title, content, content_json) VALUES
  (
    'spaces_header',
    'Vida en Comunidad',
    'Lugares diseñados para encuentros espontáneos y conexión genuina.',
    '{"section_label": "Espacios Compartidos"}'::jsonb
  ),
  (
    'services_header',
    'Operación integrada.',
    'El modelo Flux Living incluye servicios operados con estándares de hospitalidad. No como un hotel — como el lugar donde realmente vives, pero sin tener que gestionar nada.',
    '{
      "section_label": "Servicios",
      "subtitle_italic": "Experiencia sin fricción.",
      "label_included": "Lo que está incluido siempre",
      "label_corporate": "Para empresas con equipos en movimiento",
      "label_additional": "Servicios adicionales disponibles"
    }'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

UPDATE site_content
SET content_json = content_json || '{
  "title": "Book Your Stay",
  "section_label": "Reserva",
  "description": "Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas."
}'::jsonb
WHERE key = 'booking';
