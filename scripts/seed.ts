import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // 1. Create categories
    const categories = [
      {
        name: "Eau de Parfum",
        slug: "eau-de-parfum",
        description: "Premium concentration fragrances",
        image_url: "/images/perfume-purple.png",
      },
      {
        name: "Eau de Toilette",
        slug: "eau-de-toilette",
        description: "Light and fresh fragrances",
        image_url: "/images/perfume-blue.png",
      },
      {
        name: "Fragrances",
        slug: "fragrances",
        description: "Exclusive luxury collection",
        image_url: "/images/perfume-gold.png",
      },
    ];

    for (const cat of categories) {
      await supabase.from("categories").insert(cat).select();
    }
    console.log("✅ Categories created");

    // 2. Get category IDs
    const { data: catData } = await supabase
      .from("categories")
      .select("id, slug");
    const catMap = Object.fromEntries(
      catData?.map((c: any) => [c.slug, c.id]) || []
    );

    // 3. Create products
    const products = [
      {
        name: "Luxe Purple Edition",
        slug: "luxe-purple-edition",
        description: "A sophisticated blend of violet and amber",
        long_description:
          "Experience luxury with our signature purple edition. This exquisite fragrance combines the delicate notes of violet, amber, and musk for a sophisticated scent that lasts all day.",
        price_naira: 50000n * 100n, // 50,000 naira in kobo
        category_id: catMap["eau-de-parfum"],
        image_urls: ["/images/perfume-purple.png"],
        stock_quantity: 100,
        is_featured: true,
        is_bestseller: true,
        rating: 4.8,
        rating_count: 245,
      },
      {
        name: "Ocean Breeze Blue",
        slug: "ocean-breeze-blue",
        description: "Fresh and crisp aquatic fragrance",
        long_description:
          "Dive into the fresh and invigorating scent of our Ocean Breeze collection. With top notes of sea salt and citrus, this fragrance captures the essence of a perfect coastal day.",
        price_naira: 45000n * 100n,
        category_id: catMap["eau-de-toilette"],
        image_urls: ["/images/perfume-blue.png"],
        stock_quantity: 150,
        is_featured: true,
        is_bestseller: false,
        rating: 4.6,
        rating_count: 189,
      },
      {
        name: "Golden Elegance",
        slug: "golden-elegance",
        description: "Warm and sensual golden fragrance",
        long_description:
          "Embrace warmth and elegance with our Golden Elegance fragrance. This luxurious blend features top notes of bergamot, middle notes of rose, and a base of sandalwood and vanilla.",
        price_naira: 55000n * 100n,
        category_id: catMap["fragrances"],
        image_urls: ["/images/perfume-gold.png"],
        stock_quantity: 75,
        is_featured: false,
        is_bestseller: true,
        rating: 4.9,
        rating_count: 312,
      },
      {
        name: "Midnight Noir",
        slug: "midnight-noir",
        description: "Dark and mysterious essence",
        long_description:
          "Unleash your mysterious side with Midnight Noir. This deep and intriguing fragrance features notes of leather, oud, and dark berries for a truly captivating experience.",
        price_naira: 60000n * 100n,
        category_id: catMap["eau-de-parfum"],
        image_urls: ["/images/perfume-black.png"],
        stock_quantity: 60,
        is_featured: true,
        is_bestseller: false,
        rating: 4.7,
        rating_count: 201,
      },
    ];

    for (const prod of products) {
      await supabase.from("products").insert(prod).select();
    }
    console.log("✅ Products created");

    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
