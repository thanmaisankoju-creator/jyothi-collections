// prisma/seed.js
// Run: node prisma/seed.js
// Seeds 8 default products into the database

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin ──
  const hashedPw = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'jyothi2025', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@jyothicollections.com' },
    update: {},
    create: {
      email: 'admin@jyothicollections.com',
      password: hashedPw,
    },
  });
  console.log('✅ Admin user created');

  // ── Products ──
  const products = [
    {
      name: 'Silk Wrap Dress',
      description: 'Fluid silk-blend wrap dress with a delicate floral print. Adjustable tie waist, V-neckline, and midi length. Perfect from brunch to evening.',
      price: 3499,
      originalPrice: 5999,
      category: 'Dresses',
      emoji: '👗',
      badge: 'sale',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Linen Blazer',
      description: 'Relaxed-fit linen blazer in natural ecru. Unlined for breathability, with patch pockets and a subtle notch lapel.',
      price: 4999,
      category: 'Outerwear',
      emoji: '🧥',
      badge: 'new',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Ribbed Knit Top',
      description: 'Slim-fit ribbed knit top in a soft modal-cotton blend. Crew neck, long sleeves, available in 8 colours.',
      price: 1299,
      category: 'Tops',
      emoji: '👚',
      badge: 'hot',
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Wide-Leg Trousers',
      description: 'High-rise wide-leg trousers in structured crepe. Side pockets, invisible zip, and a flattering full-length cut.',
      price: 2799,
      originalPrice: 3499,
      category: 'Bottoms',
      emoji: '👖',
      badge: 'sale',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Cashmere Scarf',
      description: '100% pure cashmere scarf in a classic herringbone weave. Generously sized at 70×200cm.',
      price: 2199,
      category: 'Accessories',
      emoji: '🧣',
      badge: 'new',
      sizes: ['One Size'],
    },
    {
      name: 'Midi Slip Dress',
      description: 'Bias-cut midi slip dress in satin-finish fabric. Adjustable straps, side slit, and barely-there weight that drapes beautifully.',
      price: 2599,
      category: 'Dresses',
      emoji: '👗',
      badge: null,
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Cropped Linen Shirt',
      description: 'Relaxed cropped linen shirt with a boyfriend fit. Oversized collar, mother-of-pearl buttons.',
      price: 1799,
      originalPrice: 2199,
      category: 'Tops',
      emoji: '👕',
      badge: 'sale',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Pleated Midi Skirt',
      description: 'Flowy pleated midi skirt in lightweight chiffon. Elasticated waistband, fully lined.',
      price: 2199,
      category: 'Bottoms',
      emoji: '👙',
      badge: null,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} products seeded`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('Admin email: admin@jyothicollections.com');
  console.log('Admin password: jyothi2025');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
