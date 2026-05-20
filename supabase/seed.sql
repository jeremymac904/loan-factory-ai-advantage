-- Loan Factory AI Advantage — Seed Data
-- Four published Team Leaders plus a handful of in-flight submissions for the admin dashboard.

insert into team_leader_profiles
  (slug, status, full_name, nmls_number, email, phone, headshot_url, bio, service_areas, languages, specialties, google_review_url, zillow_review_url, template_id)
values
  (
    'jeremy-mcdonald',
    'published',
    'Jeremy McDonald',
    '1195266',
    'jeremy@mcdonald-mtg.com',
    '(904) 555-0100',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    'With over 20 years in finance, I founded The Legends Mortgage Team to bring real expertise, honest guidance, and competitive rates to every client I serve in Northeast Florida. Whether you''re a first-time buyer, a veteran using your VA benefit, or an investor building a portfolio, I''m here to find the right loan at the right rate — backed by my $1,000 Lowest Rate and Fee Guarantee.',
    array['Jacksonville FL','St. Augustine FL','Fleming Island FL','Orange Park FL','Ponte Vedra FL'],
    array['English'],
    array['VA','FHA','Conventional','Jumbo','First-Time Buyer'],
    'https://g.page/r/legends-mortgage',
    'https://www.zillow.com/profile/jeremymcdonald',
    'modern-professional'
  ),
  (
    'carlos-rivera',
    'published',
    'Carlos Rivera',
    '1234567',
    'carlos.rivera@loanfactory.com',
    '(904) 555-0101',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'Helping Jacksonville''s Spanish-speaking community achieve the dream of homeownership. I specialize in VA loans for our veterans and FHA loans for first-time buyers. Hablo español con fluidez — llámame y hablemos de tu futuro hogar.',
    array['Jacksonville FL','Gainesville FL','Lake City FL'],
    array['English','Spanish'],
    array['VA','FHA','First-Time Buyer'],
    'https://g.page/r/carlos-rivera-mortgage',
    null,
    'modern-professional'
  ),
  (
    'mei-chen',
    'published',
    'Mei Chen',
    '2345678',
    'mei.chen@loanfactory.com',
    '(813) 555-0102',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    'Serving Tampa Bay''s Chinese-American community with expert mortgage guidance in English, Mandarin, and Cantonese. I specialize in Jumbo and Conventional loans for move-up buyers and investors. 我很乐意用普通话或粤语与您交流。',
    array['Tampa FL','Clearwater FL','St. Petersburg FL','Brandon FL'],
    array['English','Mandarin','Cantonese'],
    array['Jumbo','Conventional','First-Time Buyer'],
    null,
    'https://www.zillow.com/profile/meichen',
    'modern-professional'
  ),
  (
    'nguyen-van-duc',
    'published',
    'Nguyen Van Duc',
    '3456789',
    'duc.nguyen@loanfactory.com',
    '(407) 555-0103',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'Proud to serve Orlando''s Vietnamese community as your trusted mortgage advisor. I specialize in FHA and USDA loans — programs that help families get into their first home with minimal down payment. Tôi rất vui được phục vụ cộng đồng người Việt tại Orlando.',
    array['Orlando FL','Kissimmee FL','Sanford FL','Apopka FL'],
    array['English','Vietnamese'],
    array['FHA','USDA','First-Time Buyer'],
    'https://g.page/r/duc-nguyen-mortgage',
    null,
    'modern-professional'
  ),
  (
    'ana-martinez',
    'pending_review',
    'Ana Martinez',
    '4567890',
    'ana.martinez@loanfactory.com',
    '(305) 555-0104',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    'Miami mortgage specialist serving the Latino community across South Florida. I make the homebuying process simple and stress-free — in English or Spanish.',
    array['Miami FL','Hialeah FL','Coral Gables FL','Doral FL'],
    array['English','Spanish'],
    array['FHA','Conventional','First-Time Buyer','VA'],
    null,
    null,
    'modern-professional'
  ),
  (
    'david-kim',
    'draft',
    'David Kim',
    '5678901',
    'david.kim@loanfactory.com',
    '(404) 555-0105',
    null,
    'Korean-speaking mortgage advisor serving Atlanta and surrounding areas.',
    array['Atlanta GA','Duluth GA','Suwanee GA'],
    array['English','Korean'],
    array['Conventional','Jumbo'],
    null,
    null,
    'modern-professional'
  )
on conflict (slug) do nothing;
