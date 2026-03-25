/*
  # Update Services: New Categories and Content

  1. Changes
    - Expand `category` column to support 'included', 'corporate', 'additional'
    - Clear existing seed data and insert new services matching updated copy
    - Add `subtitle` column to `services` for short descriptor lines

  2. New Services Structure
    - included (5): Housekeeping, Concierge 24h, WiFi 1Gbps, Mantenimiento, Check-in flexible
    - corporate (3): Contratos marco, Reporting mensual, Coordinación de llegada
    - additional (5): Transfer aeropuerto, Catering, Lavandería, Coworking, Recomendaciones

  3. No destructive operations — existing data is replaced via DELETE + INSERT
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'subtitle'
  ) THEN
    ALTER TABLE services ADD COLUMN subtitle text DEFAULT NULL;
  END IF;
END $$;

DELETE FROM services;

INSERT INTO services (name, subtitle, description, category, icon_name, display_order) VALUES
  ('Housekeeping semanal', NULL, 'Tu apartamento limpio sin que tengas que organizar nada. Frecuencia adicional disponible a solicitud.', 'included', 'sparkles', 1),
  ('Concierge 24 horas', NULL, 'Un número de WhatsApp real. Una persona real. Sin chatbots, sin formularios, sin esperas.', 'included', 'user', 2),
  ('WiFi 1 Gbps dedicado', NULL, 'No compartido con el edificio entero. Tu conexión, para tus videollamadas, sin interrupciones.', 'included', 'wifi', 3),
  ('Mantenimiento preventivo', NULL, 'Revisamos antes de que algo falle. Si algo falla de todas formas, se resuelve ese día.', 'included', 'shield', 4),
  ('Check-in flexible', NULL, 'Llegas a la hora que llegas. Tu apartamento está listo. Sin filas, sin recepción masificada.', 'included', 'clock', 5),
  ('Contratos marco', NULL, 'Acuerdos de disponibilidad garantizada para empresas con ejecutivos en rotación frecuente en Bogotá.', 'corporate', 'shield', 6),
  ('Reporting mensual', NULL, 'Resumen de estadías, consumo y facturación para tu área de RRHH o compras. Sin que tengas que pedirlo.', 'corporate', 'sparkles', 7),
  ('Coordinación de llegada', NULL, 'Recibimos a tu ejecutivo, le mostramos el edificio, le configuramos la tecnología integrada y le entregamos la guía del barrio.', 'corporate', 'user', 8),
  ('Transfer aeropuerto', NULL, NULL, 'additional', 'car', 9),
  ('Catering de bienvenida', NULL, NULL, 'additional', 'chef', 10),
  ('Servicio de lavandería', NULL, NULL, 'additional', 'shirt', 11),
  ('Coworking privado', NULL, NULL, 'additional', 'wifi', 12),
  ('Recomendaciones curadas', NULL, NULL, 'additional', 'sparkles', 13);
