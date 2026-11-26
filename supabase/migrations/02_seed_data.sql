-- ==============================================================================
-- KALARA DISTRO - PRODUCTION SEED DATA
-- Streetwear fashion catalog & default configuration
-- ==============================================================================

-- 1. Default Store Settings
INSERT INTO store_settings (id, store_name, tagline, about_text, contact_email, contact_phone, contact_whatsapp, address, bank_name, bank_account_name, bank_account_number, flat_shipping_rate)
VALUES (
    'default',
    'KALARA DISTRO',
    'WEAR YOUR STYLE, SHOW YOUR IDENTITY.',
    'KALARA DISTRO berdiri dari semangat "Karya Lokal, Rasa Anak Muda". Kami menciptakan pakaian streetwear kontemporer berkualitas tinggi dengan cutting presisi, grafis berani, dan material berstandar internasional yang dirancang untuk ekspresi autentik generasi muda.',
    'support@kalaradistro.id',
    '+62 812-3456-7890',
    '+6281234567890',
    'Jl. Trunojoyo No. 42, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115',
    'BCA (Bank Central Asia)',
    'PT KALARA DISTRO INDONESIA',
    '8830 1928 4710',
    18000
) ON CONFLICT (id) DO NOTHING;

-- 2. Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'T-Shirts', 't-shirts', 'Heavyweight cotton graphic tees and boxy streetwear essentials.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', 1),
    ('22222222-2222-2222-2222-222222222222', 'Hoodies', 'hoodies', 'Oversized fleece drop-shoulder hoodies built for durability and comfort.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop', 2),
    ('33333333-3333-3333-3333-333333333333', 'Crewnecks', 'crewnecks', 'Clean minimalist french terry crewnecks with subtle luxury detailing.', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', 3),
    ('44444444-4444-4444-4444-444444444444', 'Casual Shirts', 'casual-shirts', 'Relaxed fit short-sleeve resort shirts and workwear utility button-ups.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', 4),
    ('55555555-5555-5555-5555-555555555555', 'Pants', 'pants', 'Wide-leg utility cargo pants, loose denim, and relaxed sweatpants.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', 5),
    ('66666666-6666-6666-6666-666666666666', 'Caps', 'caps', 'Distressed vintage dad caps, embroidered 5-panel hats, and beanies.', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', 6)
ON CONFLICT (slug) DO NOTHING;

-- 3. Products
INSERT INTO products (id, category_id, name, slug, description, details, base_price, compare_at_price, is_featured, is_new_arrival, is_active)
VALUES
    -- T-Shirts
    ('a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Kalara Genesis Boxy Heavyweight Tee', 'kalara-genesis-boxy-heavyweight-tee', 'Oversized boxy tee cut from 240 GSM combed cotton. Featuring high-density tactile typographic puff print on chest and spine.', '100% Combed Cotton 240 GSM. Pre-shrunk. Double needle stitch collar. Made in Bandung.', 115000, 145000, TRUE, TRUE, TRUE),
    ('a0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Identity Monogram Raw Edge Tee', 'identity-monogram-raw-edge-tee', 'Minimalist vintage wash tee with raw bottom hem and tonal embroidered Kalara monogram.', '100% Washed Vintage Cotton 220 GSM. Bio-wash treated for ultra-soft hand feel.', 95000, 120000, FALSE, TRUE, TRUE),
    ('a0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Karya Lokal Cyberpunk Graphic Tee', 'karya-lokal-cyberpunk-graphic-tee', 'Futuristic urban streetwear illustration celebrating Indonesian heritage through a sci-fi lens. Plastisol screen print.', '100% Ring-Spun Cotton 210 GSM. High resistance plastisol silkscreen.', 85000, 110000, TRUE, FALSE, TRUE),
    
    -- Hoodies
    ('b0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Architect Heavyweight Drop-Shoulder Hoodie', 'architect-heavyweight-drop-shoulder-hoodie', 'Substantial 380 GSM cotton fleece pullover hoodie. Generous double-lined hood, seamless kangaroo pocket, and woven brand labels.', '380 GSM Cotton Fleece. No drawstrings for a modern editorial silhouette. Heavy rib cuffs.', 195000, 245000, TRUE, TRUE, TRUE),
    ('b0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Nocturne Distressed Acid Wash Hoodie', 'nocturne-distressed-acid-wash-hoodie', 'Hand-treated acid wash hoodie with subtle distressing around pocket trims and cuffs. Each piece has a unique pattern.', '360 GSM Terry Fleece. Individually enzyme and acid washed.', 215000, 260000, FALSE, TRUE, TRUE),

    -- Crewnecks
    ('c0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Statement Minimalist French Terry Crewneck', 'statement-minimalist-french-terry-crewneck', 'Clean luxury streetwear pullover. Refined tonal embroidery at collar line with custom raglan cut for effortless drape.', '330 GSM French Terry Cotton. Raglan sleeve cut. Custom woven neck tag.', 155000, 185000, TRUE, FALSE, TRUE),
    ('c0000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Division Colorblock Street Crewneck', 'division-colorblock-street-crewneck', 'Monochrome split panel construction in pitch black and optic white with reflective piping details.', '320 GSM Cotton Terry. 3M Scotchlite reflective seam inserts.', 165000, 190000, FALSE, TRUE, TRUE),

    -- Casual Shirts
    ('d0000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'Urban Camp Collar Resort Shirt', 'urban-camp-collar-resort-shirt', 'Relaxed boxy silhouette with classic camp collar and matte horn buttons. Breathable rayon blend drape.', 'Rayon Cotton Blend. Camp cuban collar. Chest welt pocket with brand tab.', 135000, 160000, TRUE, TRUE, TRUE),
    ('d0000000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Tactical Utility Pocket Overshirt', 'tactical-utility-pocket-overshirt', 'Heavy cotton twill overshirt with dual 3D pleated chest pockets and branded metal snap closures.', 'Heavyweight Cotton Twill. Matte black tactical snaps. Double reinforced seams.', 150000, 180000, FALSE, FALSE, TRUE),

    -- Pants
    ('e0000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Subway Wide-Leg Cargo Trousers', 'subway-wide-leg-cargo-trousers', 'Relaxed wide cut with modular multi-pocket setup, adjustable ankle toggles, and elasticated back waistband.', 'Cotton Ripstop Fabric. YKK zippers. Multi-function utility loops and deep pockets.', 185000, 225000, TRUE, TRUE, TRUE),
    ('e0000000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'Essential Relaxed Heavy Sweatpants', 'essential-relaxed-heavy-sweatpants', 'Thick 360 GSM fleece sweatpants with elongated drawstrings, deep side pockets, and straight-leg cuff.', '360 GSM Cotton Fleece. Custom metal aglets on extra-long drawstrings.', 145000, 175000, FALSE, FALSE, TRUE),

    -- Caps
    ('f0000000-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666666', 'Kalara Identity Unstructured Dad Cap', 'kalara-identity-unstructured-dad-cap', 'Low profile unstructured 6-panel cap in washed cotton chino. Detailed front logo embroidery and antique brass buckle closure.', '100% Washed Cotton Chino. Antique brass slider closure. Embroidered eyelets.', 65000, 85000, TRUE, TRUE, TRUE),
    ('f0000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666', 'Metropolis Flat-Brim 5-Panel Hat', 'metropolis-flat-brim-5-panel-hat', 'Modern streetwear 5-panel hat with water-resistant nylon fabric and high-density woven badge.', 'Water-repellent matte nylon. Nylon webbing strap with quick-release clip.', 60000, 75000, FALSE, FALSE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 4. Product Images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
    -- Genesis Tee
    ('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', 'Kalara Genesis Boxy Tee Front', TRUE, 1),
    ('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop', 'Kalara Genesis Boxy Tee Back Detail', FALSE, 2),
    -- Monogram Tee
    ('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop', 'Identity Monogram Tee Raw White', TRUE, 1),
    -- Cyberpunk Tee
    ('a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', 'Karya Lokal Cyberpunk Tee Graphic', TRUE, 1),
    
    -- Architect Hoodie
    ('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop', 'Architect Drop-Shoulder Hoodie Black', TRUE, 1),
    ('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop', 'Architect Drop-Shoulder Hoodie Side', FALSE, 2),
    -- Nocturne Hoodie
    ('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop', 'Nocturne Distressed Acid Wash Hoodie', TRUE, 1),

    -- Crewneck Statement
    ('c0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', 'Statement French Terry Crewneck', TRUE, 1),
    -- Split Crewneck
    ('c0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop', 'Division Colorblock Crewneck', TRUE, 1),

    -- Resort Shirt
    ('d0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', 'Urban Camp Collar Resort Shirt', TRUE, 1),
    -- Tactical Overshirt
    ('d0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', 'Tactical Utility Pocket Overshirt', TRUE, 1),

    -- Cargo Trousers
    ('e0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', 'Subway Wide-Leg Cargo Pants', TRUE, 1),
    -- Sweatpants
    ('e0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop', 'Essential Relaxed Heavy Sweatpants', TRUE, 1),

    -- Dad Cap
    ('f0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', 'Kalara Identity Dad Cap Pitch Black', TRUE, 1),
    -- 5-Panel Cap
    ('f0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&auto=format&fit=crop', 'Metropolis Flat-Brim 5-Panel Hat', TRUE, 1);

-- 5. Product Variants (SKU, Size, Color, Stock)
INSERT INTO product_variants (product_id, sku, size, color, stock_quantity, additional_price)
VALUES
    -- Genesis Tee
    ('a0000000-0000-0000-0000-000000000001', 'TEE-GEN-BLK-S', 'S', 'Black', 25, 0),
    ('a0000000-0000-0000-0000-000000000001', 'TEE-GEN-BLK-M', 'M', 'Black', 30, 0),
    ('a0000000-0000-0000-0000-000000000001', 'TEE-GEN-BLK-L', 'L', 'Black', 20, 0),
    ('a0000000-0000-0000-0000-000000000001', 'TEE-GEN-BLK-XL', 'XL', 'Black', 15, 0),
    ('a0000000-0000-0000-0000-000000000001', 'TEE-GEN-WHT-M', 'M', 'White', 20, 0),
    ('a0000000-0000-0000-0000-000000000001', 'TEE-GEN-WHT-L', 'L', 'White', 18, 0),

    -- Architect Hoodie
    ('b0000000-0000-0000-0000-000000000001', 'HD-ARC-BLK-M', 'M', 'Washed Black', 15, 0),
    ('b0000000-0000-0000-0000-000000000001', 'HD-ARC-BLK-L', 'L', 'Washed Black', 20, 0),
    ('b0000000-0000-0000-0000-000000000001', 'HD-ARC-BLK-XL', 'XL', 'Washed Black', 10, 0),
    ('b0000000-0000-0000-0000-000000000001', 'HD-ARC-GRY-L', 'L', 'Heather Grey', 12, 0),

    -- Statement Crewneck
    ('c0000000-0000-0000-0000-000000000001', 'CRW-STM-BLK-M', 'M', 'Jet Black', 14, 0),
    ('c0000000-0000-0000-0000-000000000001', 'CRW-STM-BLK-L', 'L', 'Jet Black', 18, 0),

    -- Resort Shirt
    ('d0000000-0000-0000-0000-000000000001', 'SHR-RES-BLK-M', 'M', 'Onyx Black', 12, 0),
    ('d0000000-0000-0000-0000-000000000001', 'SHR-RES-BLK-L', 'L', 'Onyx Black', 16, 0),

    -- Subway Cargo
    ('e0000000-0000-0000-0000-000000000001', 'CRG-SUB-BLK-28', '28-30 (S)', 'Matte Black', 10, 0),
    ('e0000000-0000-0000-0000-000000000001', 'CRG-SUB-BLK-32', '31-33 (M)', 'Matte Black', 15, 0),
    ('e0000000-0000-0000-0000-000000000001', 'CRG-SUB-BLK-34', '34-36 (L)', 'Matte Black', 8, 0),

    -- Dad Cap
    ('f0000000-0000-0000-0000-000000000001', 'CAP-DAD-BLK-OS', 'One Size', 'Vintage Black', 45, 0),
    ('f0000000-0000-0000-0000-000000000002', 'CAP-5PN-BLK-OS', 'One Size', 'Stealth Black', 30, 0)
ON CONFLICT (sku) DO NOTHING;
