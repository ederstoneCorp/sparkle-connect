-- Sparkle Connect Seed Data: Kenya Universities, Campuses, Sample Communities & Gigs

-- Seed Universities
INSERT INTO public.universities (id, name, short_name, slug, location, website) VALUES
('11111111-1111-1111-1111-111111111101', 'University of Nairobi', 'UoN', 'uon', 'Nairobi', 'https://www.uonbi.ac.ke'),
('11111111-1111-1111-1111-111111111102', 'Kenyatta University', 'KU', 'ku', 'Kahawa, Nairobi', 'https://www.ku.ac.ke'),
('11111111-1111-1111-1111-111111111103', 'Strathmore University', 'Strathmore', 'strathmore', 'Madaraka, Nairobi', 'https://strathmore.edu'),
('11111111-1111-1111-1111-111111111104', 'Jomo Kenyatta University of Agriculture and Technology', 'JKUAT', 'jkuat', 'Juja, Kiambu', 'https://www.jkuat.ac.ke'),
('11111111-1111-1111-1111-111111111105', 'Moi University', 'Moi', 'moi', 'Eldoret, Uasin Gishu', 'https://www.mu.ac.ke'),
('11111111-1111-1111-1111-111111111106', 'Egerton University', 'Egerton', 'egerton', 'Njoro, Nakuru', 'https://www.egerton.ac.ke'),
('11111111-1111-1111-1111-111111111107', 'United States International University - Africa', 'USIU', 'usiu', 'Roysambu, Nairobi', 'https://www.usiu.ac.ke'),
('11111111-1111-1111-1111-111111111108', 'Mount Kenya University', 'MKU', 'mku', 'Thika, Kiambu', 'https://www.mku.ac.ke'),
('11111111-1111-1111-1111-111111111109', 'Technical University of Kenya', 'TUK', 'tuk', 'Haile Selassie Ave, Nairobi', 'https://tukenya.ac.ke'),
('11111111-1111-1111-1111-111111111110', 'Maseno University', 'Maseno', 'maseno', 'Kisumu', 'https://www.maseno.ac.ke'),
('11111111-1111-1111-1111-111111111111', 'Daystar University', 'Daystar', 'daystar', 'Athi River & Nairobi', 'https://www.daystar.ac.ke')
ON CONFLICT (slug) DO NOTHING;

-- Seed Campuses
INSERT INTO public.campuses (university_id, name, location) VALUES
('11111111-1111-1111-1111-111111111101', 'Main Campus', 'University Way, Nairobi'),
('11111111-1111-1111-1111-111111111101', 'Chiromo Campus (Science & Tech)', 'Riverside Drive, Nairobi'),
('11111111-1111-1111-1111-111111111101', 'Parklands Campus (Law)', 'Parklands, Nairobi'),
('11111111-1111-1111-1111-111111111102', 'Main Campus', 'Thika Superhighway, Kahawa'),
('11111111-1111-1111-1111-111111111102', 'Parklands Law Campus', 'Parklands, Nairobi'),
('11111111-1111-1111-1111-111111111103', 'Madaraka Campus', 'Ole Sangale Rd, Madaraka'),
('11111111-1111-1111-1111-111111111104', 'Main Campus Juja', 'Juja, Kiambu County');

-- Seed Standard Interests
INSERT INTO public.interests (name, category, icon) VALUES
('Android & Mobile Dev', 'Technology', 'phone_android'),
('Web & Frontend Dev', 'Technology', 'code'),
('AI & Machine Learning', 'Technology', 'psychology'),
('Graphic Design & UI/UX', 'Creative', 'palette'),
('Campus Entrepreneurship', 'Business', 'trending_up'),
('Photography & Videography', 'Creative', 'photo_camera'),
('Mathematics & Statistics Tutoring', 'Academics', 'calculate'),
('Debate & Public Speaking', 'Leadership', 'record_voice_over'),
('Robotics & IoT', 'Engineering', 'smart_toy'),
('Music & Event Production', 'Entertainment', 'music_note'),
('Fintech & Crypto', 'Finance', 'currency_exchange'),
('Football & Sports Club', 'Recreation', 'sports_soccer')
ON CONFLICT (name) DO NOTHING;
