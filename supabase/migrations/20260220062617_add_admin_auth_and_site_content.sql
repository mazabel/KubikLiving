/*
  # Admin Auth and Site Content Expansion

  1. Expand site_content table to support all editable sections
  2. Add RLS policies for admin access
  3. Seed initial content for Hero, Context, Location, Footer sections

  Tables modified:
  - site_content: Add policies for authenticated admin users to update
  
  New data:
  - Hero section content (title, subtitle, description, image)
  - Context section content (title, description, stats)
  - Location section content (title, description, address points)
  - Footer content (email, phone, address, social links)
*/

CREATE POLICY "Authenticated users can update site_content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site_content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read site_content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO site_content (key, title, content, content_json) VALUES
  ('hero', 'FLUXING HOME', 'Residencias urbanas amuebladas en Bogotá. Arquitectura, privacidad y permanencia flexible.', 
   '{"subtitle": "Residencias Urbanas", "badge": "8i8", "city": "Bogotá", "cta_primary": "Explorar Suites", "cta_secondary": "Book Now", "image_url": "/Image_202602182333.jpeg"}'::jsonb),
  
  ('context', 'Arquitectura que define un nuevo estándar en Bogotá.', 
   'KubikLiving 8i8 nace de la convicción de que el espacio bien construido transforma la manera en que habitamos la ciudad. Cada residencia es una declaración de precisión material: concreto expuesto, madera natural, luz calculada.',
   '{"description_2": "Sin concesiones estéticas. Solo la permanencia honesta de los materiales, la generosidad del espacio y la ciudad como telón de fondo permanente.", "stat_1_value": "8", "stat_1_label": "Residencias Únicas", "stat_2_value": "78–132", "stat_2_label": "m² Interiores", "stat_3_value": "100%", "stat_3_label": "Amobladas y Equipadas", "section_label": "El Proyecto"}'::jsonb),
  
  ('location', 'En el corazón de Bogotá', 
   'KubikLiving 8i8 está ubicado en una de las zonas más dinámicas de Bogotá. Cerca de los principales centros empresariales, restaurantes, galerías y espacios culturales.',
   '{"section_label": "Ubicación Estratégica", "point_1_name": "Centro Internacional", "point_1_detail": "5 minutos caminando", "point_2_name": "Zona T / Zona G", "point_2_detail": "10 minutos en carro", "point_3_name": "El Dorado Airport", "point_3_detail": "20 minutos en carro"}'::jsonb),

  ('footer', 'KubikLiving 8i8', 
   'Residencias urbanas diseñadas con precisión europea en el corazón de Bogotá.',
   '{"email": "info@kubikliving.com", "phone": "+57 1 300 123 4567", "address": "Bogotá, Colombia", "instagram": "#", "facebook": "#", "linkedin": "#", "copyright": "© 2024 KubikLiving 8i8. All rights reserved."}'::jsonb),

  ('booking', 'Book Your Stay', 
   'Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.',
   '{"section_label": "Reserva"}'::jsonb)

ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  content_json = EXCLUDED.content_json;
