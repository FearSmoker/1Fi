import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calculateEMI(principal, annualRate, tenureMonths) {
  if (annualRate === 0) return Math.ceil(principal / tenureMonths);
  const r = annualRate / 12 / 100;
  return Math.ceil(principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1));
}

function generateEMIPlans(price) {
  return [
    { tenure: 3, rate: 0, isNoCost: true },
    { tenure: 6, rate: 0, isNoCost: true },
    { tenure: 12, rate: 0, isNoCost: true },
    { tenure: 24, rate: 0, isNoCost: true },
    { tenure: 36, rate: 10.5, isNoCost: false },
    { tenure: 48, rate: 10.5, isNoCost: false },
    { tenure: 60, rate: 10.5, isNoCost: false },
  ].map(({ tenure, rate, isNoCost }) => {
    const monthlyAmount = calculateEMI(price, rate, tenure);
    return { tenure, monthlyAmount, interestRate: rate, totalAmount: monthlyAmount * tenure, cashback: 7500, isNoCost };
  });
}

const CDN = 'https://cdn.dummyjson.com/product-images';

// image sets per color variant
const IMG = {
  // phones
  iphone_silver:   [`${CDN}/smartphones/iphone-13-pro/1.webp`, `${CDN}/smartphones/iphone-13-pro/2.webp`, `${CDN}/smartphones/iphone-13-pro/3.webp`],
  iphone_black:    [`${CDN}/smartphones/iphone-x/1.webp`, `${CDN}/smartphones/iphone-x/2.webp`, `${CDN}/smartphones/iphone-x/3.webp`],
  samsung_black:   [`${CDN}/smartphones/iphone-5s/1.webp`, `${CDN}/smartphones/iphone-5s/2.webp`, `${CDN}/smartphones/iphone-5s/3.webp`],
  samsung_gray:    [`${CDN}/smartphones/iphone-6/1.webp`, `${CDN}/smartphones/iphone-6/2.webp`, `${CDN}/smartphones/iphone-6/3.webp`],
  oneplus_ocean:   [`${CDN}/smartphones/oppo-f19-pro-plus/1.webp`, `${CDN}/smartphones/oppo-f19-pro-plus/2.webp`, `${CDN}/smartphones/oppo-f19-pro-plus/3.webp`],
  oneplus_dawn:    [`${CDN}/smartphones/oppo-a57/1.webp`, `${CDN}/smartphones/oppo-a57/2.webp`, `${CDN}/smartphones/oppo-a57/3.webp`],
  pixel_obsidian:  [`${CDN}/smartphones/realme-c35/1.webp`, `${CDN}/smartphones/realme-c35/2.webp`, `${CDN}/smartphones/realme-c35/3.webp`],
  pixel_porcelain: [`${CDN}/smartphones/realme-xt/1.webp`, `${CDN}/smartphones/realme-xt/2.webp`, `${CDN}/smartphones/realme-xt/3.webp`],
  oppo_silver:     [`${CDN}/smartphones/oppo-k1/1.webp`, `${CDN}/smartphones/oppo-k1/2.webp`, `${CDN}/smartphones/oppo-k1/3.webp`],
  oppo_gold:       [`${CDN}/smartphones/realme-x/1.webp`, `${CDN}/smartphones/realme-x/2.webp`, `${CDN}/smartphones/realme-x/3.webp`],
  realme_green:    [`${CDN}/smartphones/realme-c35/1.webp`, `${CDN}/smartphones/realme-c35/3.webp`, `${CDN}/smartphones/realme-c35/2.webp`],
  realme_silver:   [`${CDN}/smartphones/realme-xt/1.webp`, `${CDN}/smartphones/realme-xt/3.webp`, `${CDN}/smartphones/realme-xt/2.webp`],

  // laptops
  macbook_black:   [`${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/1.webp`, `${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/2.webp`, `${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/3.webp`],
  macbook_silver:  [`${CDN}/laptops/huawei-matebook-x-pro/1.webp`, `${CDN}/laptops/huawei-matebook-x-pro/2.webp`, `${CDN}/laptops/huawei-matebook-x-pro/3.webp`],
  dell_silver:     [`${CDN}/laptops/new-dell-xps-13-9300-laptop/1.webp`, `${CDN}/laptops/new-dell-xps-13-9300-laptop/2.webp`, `${CDN}/laptops/new-dell-xps-13-9300-laptop/3.webp`],
  dell_white:      [`${CDN}/laptops/lenovo-yoga-920/1.webp`, `${CDN}/laptops/lenovo-yoga-920/2.webp`, `${CDN}/laptops/lenovo-yoga-920/3.webp`],

  // audio
  sony_black:      [`${CDN}/mobile-accessories/apple-airpods-max-silver/1.webp`, `${CDN}/mobile-accessories/apple-airpods/1.webp`, `${CDN}/mobile-accessories/apple-airpods/2.webp`],
  sony_silver:     [`${CDN}/mobile-accessories/apple-airpods/1.webp`, `${CDN}/mobile-accessories/apple-airpods/3.webp`, `${CDN}/mobile-accessories/apple-airpods/2.webp`],

  // tablets
  ipad_black:      [`${CDN}/tablets/ipad-mini-2021-starlight/1.webp`, `${CDN}/tablets/ipad-mini-2021-starlight/2.webp`, `${CDN}/tablets/ipad-mini-2021-starlight/3.webp`],
  ipad_silver:     [`${CDN}/tablets/samsung-galaxy-tab-white/1.webp`, `${CDN}/tablets/samsung-galaxy-tab-white/2.webp`, `${CDN}/tablets/samsung-galaxy-tab-white/3.webp`],
};

const products = [
  // smartphones
  {
    name: 'iPhone 17 Pro', slug: 'iphone-17-pro', brand: 'Apple', category: 'Smartphones',
    description: 'A19 Pro chip, 48MP Fusion camera, titanium design, Super Retina XDR display, Action button, all-day battery.',
    colors: [
      { color: 'Silver', colorHex: '#C0C0C0', imgKey: 'iphone_silver' },
      { color: 'Black Titanium', colorHex: '#2D2D2D', imgKey: 'iphone_black' },
    ],
    storages: [{ storage: '256GB', priceAdd: 0 }, { storage: '512GB', priceAdd: 20000 }],
    basePrice: 127400, baseMrp: 134900,
  },
  {
    name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-s24-ultra', brand: 'Samsung', category: 'Smartphones',
    description: 'Snapdragon 8 Gen 3, 200MP camera, S Pen, titanium frame, 6.8" QHD+ Dynamic AMOLED, Galaxy AI.',
    colors: [
      { color: 'Titanium Black', colorHex: '#1A1A1A', imgKey: 'samsung_black' },
      { color: 'Titanium Gray', colorHex: '#808080', imgKey: 'samsung_gray' },
    ],
    storages: [{ storage: '256GB', priceAdd: 0 }, { storage: '512GB', priceAdd: 15000 }],
    basePrice: 129999, baseMrp: 134999,
  },
  {
    name: 'OnePlus 13', slug: 'oneplus-13', brand: 'OnePlus', category: 'Smartphones',
    description: 'Snapdragon 8 Elite, 6000mAh battery, Hasselblad camera, 100W SUPERVOOC, 2K 120Hz LTPO display.',
    colors: [
      { color: 'Midnight Ocean', colorHex: '#1B3A4B', imgKey: 'oneplus_ocean' },
      { color: 'Arctic Dawn', colorHex: '#F5F0EB', imgKey: 'oneplus_dawn' },
    ],
    storages: [{ storage: '256GB', priceAdd: 0 }, { storage: '512GB', priceAdd: 10000 }],
    basePrice: 69999, baseMrp: 72999,
  },
  {
    name: 'Google Pixel 9 Pro', slug: 'google-pixel-9-pro', brand: 'Google', category: 'Smartphones',
    description: 'Tensor G4, 50MP triple camera, 7 years of updates, 6.3" Super Actua LTPO OLED display.',
    colors: [
      { color: 'Obsidian', colorHex: '#1D1D1D', imgKey: 'pixel_obsidian' },
      { color: 'Porcelain', colorHex: '#F2E8D9', imgKey: 'pixel_porcelain' },
    ],
    storages: [{ storage: '128GB', priceAdd: 0 }, { storage: '256GB', priceAdd: 9000 }],
    basePrice: 109999, baseMrp: 114999,
  },
  {
    name: 'Oppo Reno 12 Pro', slug: 'oppo-reno-12-pro', brand: 'Oppo', category: 'Smartphones',
    description: 'Dimensity 7300, 50MP Sony IMX890 OIS, 80W SUPERVOOC, AI portrait features, 6.7" AMOLED.',
    colors: [
      { color: 'Nebula Silver', colorHex: '#B8C4D0', imgKey: 'oppo_silver' },
      { color: 'Sunset Gold', colorHex: '#DAA520', imgKey: 'oppo_gold' },
    ],
    storages: [{ storage: '256GB', priceAdd: 0 }],
    basePrice: 36999, baseMrp: 39999,
  },
  {
    name: 'Realme GT 6', slug: 'realme-gt-6', brand: 'Realme', category: 'Smartphones',
    description: 'Snapdragon 8s Gen 3, 6000 nits display, 50MP Sony LYT-808 OIS, 120W SUPERVOOC charge.',
    colors: [
      { color: 'Razor Green', colorHex: '#2D5A27', imgKey: 'realme_green' },
      { color: 'Fluid Silver', colorHex: '#D1D5DB', imgKey: 'realme_silver' },
    ],
    storages: [{ storage: '256GB', priceAdd: 0 }, { storage: '512GB', priceAdd: 4000 }],
    basePrice: 33999, baseMrp: 36999,
  },

  // laptops
  {
    name: 'MacBook Pro 14" M3 Pro', slug: 'macbook-pro-14-m3-pro', brand: 'Apple', category: 'Laptops',
    description: 'M3 Pro chip, 18-core GPU, 18GB unified memory, Liquid Retina XDR display, up to 17 hours battery.',
    colors: [
      { color: 'Space Black', colorHex: '#1D1D1F', imgKey: 'macbook_black' },
      { color: 'Silver', colorHex: '#E3E4E5', imgKey: 'macbook_silver' },
    ],
    storages: [{ storage: '512GB', priceAdd: 0 }, { storage: '1TB', priceAdd: 50000 }],
    basePrice: 199900, baseMrp: 209900,
  },
  {
    name: 'Dell XPS 15', slug: 'dell-xps-15', brand: 'Dell', category: 'Laptops',
    description: 'Intel Core i9-13900H, NVIDIA RTX 4070, 15.6" 3.5K OLED InfinityEdge, 32GB DDR5.',
    colors: [
      { color: 'Platinum Silver', colorHex: '#C0C0C0', imgKey: 'dell_silver' },
      { color: 'Frost White', colorHex: '#F8F8F8', imgKey: 'dell_white' },
    ],
    storages: [{ storage: '512GB', priceAdd: 0 }, { storage: '1TB', priceAdd: 30000 }],
    basePrice: 159990, baseMrp: 174990,
  },

  // audio
  {
    name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', brand: 'Sony', category: 'Audio',
    description: 'Industry-leading ANC, Auto NC Optimizer, 30-hour battery, crystal clear calls, multipoint, 250g.',
    colors: [
      { color: 'Black', colorHex: '#1A1A1A', imgKey: 'sony_black' },
      { color: 'Platinum Silver', colorHex: '#E8E8E8', imgKey: 'sony_silver' },
    ],
    storages: [{ storage: 'Standard', priceAdd: 0 }],
    basePrice: 26990, baseMrp: 29990,
  },

  // tablets
  {
    name: 'iPad Pro M4 12.9"', slug: 'ipad-pro-m4', brand: 'Apple', category: 'Tablets',
    description: 'Thinnest Apple product ever, M4 chip, tandem OLED Ultra Retina XDR, Apple Pencil Pro, Thunderbolt.',
    colors: [
      { color: 'Space Black', colorHex: '#1D1D1F', imgKey: 'ipad_black' },
      { color: 'Silver', colorHex: '#E3E4E5', imgKey: 'ipad_silver' },
    ],
    storages: [{ storage: '256GB', priceAdd: 0 }, { storage: '512GB', priceAdd: 20000 }],
    basePrice: 119900, baseMrp: 124900,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');
  await prisma.eMIPlan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  console.log('🗑️  Cleared existing data');

  let totalVariants = 0, totalPlans = 0;

  for (const pData of products) {
    const product = await prisma.product.create({
      data: { name: pData.name, slug: pData.slug, brand: pData.brand, category: pData.category, description: pData.description },
    });
    console.log(`✅ ${product.name} [${product.category}]`);

    for (const colorDef of pData.colors) {
      const imageSet = IMG[colorDef.imgKey];
      for (const storageDef of pData.storages) {
        const price = pData.basePrice + storageDef.priceAdd;
        const mrp = pData.baseMrp + storageDef.priceAdd;
        const slugPart = `${pData.slug}-${colorDef.color}-${storageDef.storage}`
          .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `${pData.name} - ${colorDef.color}, ${storageDef.storage}`,
            storage: storageDef.storage, color: colorDef.color, colorHex: colorDef.colorHex,
            price, mrp,
            imageUrl: imageSet[0],
            images: imageSet,
            slug: slugPart, inStock: true,
          },
        });
        console.log(`   📦 ${variant.color} ${variant.storage} → ${imageSet.length} images (${pData.category})`);
        totalVariants++;

        const plans = generateEMIPlans(price);
        for (const plan of plans) {
          await prisma.eMIPlan.create({ data: { ...plan, variantId: variant.id } });
        }
        totalPlans += plans.length;
      }
    }
  }

  console.log(`\n🎉 Seed completed!`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Variants: ${totalVariants}`);
  console.log(`   EMI Plans: ${totalPlans}`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
