import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  await prisma.category.createMany({
    data: [
      { id: 1, name: "Knob", description: "Door and cabinet knobs" },
      { id: 2, name: "Door Handle", description: "Various types of door handles" },
    ],
    skipDuplicates: true,
  });

  // Subcategories
  await prisma.subcategory.createMany({
    data: [
      { id: 1, name: "Cabinet Handle", categoryId: 2, description: "Handles for cabinets" },
      { id: 2, name: "Door Handle", categoryId: 2, description: "Handles for doors" },
    ],
    skipDuplicates: true,
  });

  // Materials
  await prisma.material.createMany({
    data: [
      { id: 1, name: "Stainless Steel", description: "Premium stainless steel" },
      { id: 2, name: "Brass", description: "High-quality brass" },
    ],
    skipDuplicates: true,
  });

  // Finish Categories
  await prisma.finishCategory.createMany({
    data: [
      { id: 1, name: "Stainless Steel Finish", description: "Finishes for stainless steel products" },
      { id: 2, name: "Brass Finish", description: "Finishes for brass products" },
      { id: 3, name: "PVD Finish", description: "Physical Vapor Deposition finishes" },
    ],
    skipDuplicates: true,
  });

  // Finishes
  await prisma.finish.createMany({
    data: [
      { id: 1, name: "Matt", categoryId: 1, image: "/images/finishes/matt.jpg" },
      { id: 2, name: "Glossy Chrome", categoryId: 1, image: "/images/finishes/glossy-chrome.jpg" },
      { id: 3, name: "Satin", categoryId: 1, image: "/images/finishes/satin-stainless-steel.jpg" },
      { id: 4, name: "Black Satin", categoryId: 1, image: "/images/finishes/satin-black.jpg" },
      { id: 5, name: "Brass Antique", categoryId: 2, image: "/images/finishes/brass.jpg" },
      { id: 6, name: "Rose Gold", categoryId: 3, image: "/images/finishes/pvd-rose-gold.jpg" },
      { id: 7, name: "Matte Black", categoryId: 3, image: "/images/finishes/pvd-satin-black.jpg" },
      { id: 8, name: "PVD Rose Gold", categoryId: 3, image: "/images/finishes/pvd-polished-copper.jpg" },
      { id: 9, name: "PVD Gold", categoryId: 3, image: "/images/finishes/pvd-satin-gold.jpg" },
      { id: 10, name: "PVD Bronze", categoryId: 3, image: "/images/finishes/pvd-satin-bronze.jpg" },
      { id: 11, name: "PVD Nickel", categoryId: 3, image: "/images/finishes/pvd-satin-nickel.jpg" },
    ],
    skipDuplicates: true,
  });

  // Products
  await prisma.product.createMany({
    data: [
      {
        id: 1,
        name: "Classic Brass Knob",
        category: "Knob",
        material: "Brass",
        description: "Timeless brass knob with exceptional craftsmanship and warm golden finish.",
        image: "/images/products/knobs/brassknob1.jpg",
        finishes: ["Brass", "PVD Satin Gold", "PVD Polished Copper"],
      },
      {
        id: 2,
        name: "Stainless Steel Knob",
        category: "Knob",
        material: "Stainless Steel",
        description: "Modern metal knob with premium finishes for contemporary interiors.",
        image: "/images/products/knobs/metal-knob-1.jpg",
        finishes: ["Polished Stainless Steel", "Satin Stainless Steel", "Satin Nickel"],
      },
      {
        id: 3,
        name: "Architectural Cabinet Handle",
        category: "Door Handle",
        subcategory: "Cabinet Handle",
        material: "Stainless Steel",
        description: "Precision-engineered cabinet handle with ergonomic design and multiple finish options.",
        image: "/images/products/door-handles/door-handle-1.jpg",
        finishes: ["PVD Satin Black", "PVD Satin Bronze", "Satin Black"],
      },
      {
        id: 4,
        name: "Contemporary Cabinet Handle",
        category: "Door Handle",
        subcategory: "Cabinet Handle",
        material: "Brass",
        description: "Sleek brass cabinet handle combining functionality with minimalist aesthetics.",
        image: "/images/products/door-handles/door-handle-2.jpg",
        finishes: ["Brass", "PVD Satin Gold", "PVD Polished Copper"],
      },
      {
        id: 5,
        name: "Premium Door Handle",
        category: "Door Handle",
        subcategory: "Door Handle",
        material: "Stainless Steel",
        description: "Robust door handle perfect for entrance doors and commercial applications.",
        image: "/images/products/pull-handles/pull-handle-1.jpg",
        finishes: ["PVD Satin Stainless Steel", "PVD Satin Black", "Satin Stainless Steel"],
      },
      {
        id: 6,
        name: "Designer Door Handle",
        category: "Door Handle",
        subcategory: "Door Handle",
        material: "Brass",
        description: "Statement door handle with architectural presence and luxurious finishes.",
        image: "/images/products/pull-handles/pull-handle-2.jpg",
        finishes: ["Brass", "PVD Satin Gold", "PVD Satin Bronze", "PVD Polished Copper"],
      },
    ],
    skipDuplicates: true,
  });

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        id: 1,
        name: "David Richardson",
        role: "Lead Architect",
        company: "Richardson & Partners",
        location: "London, UK",
        image: "/images/testimonials/client-1.jpg",
        content: "Hindonix hardware has become our go-to specification for luxury residential projects. The PVD finishes are exceptional and the quality is consistently outstanding.",
        rating: 5,
      },
      {
        id: 2,
        name: "Sarah Mitchell",
        role: "Interior Designer",
        company: "Mitchell Design Studio",
        location: "Dubai, UAE",
        image: "/images/testimonials/client-2.jpg",
        content: "The attention to detail in Hindonix products is remarkable. Their brass knobs and door handles add that perfect finishing touch to our high-end projects.",
        rating: 5,
      },
      {
        id: 3,
        name: "James Thompson",
        role: "Project Manager",
        company: "Thompson Construction",
        location: "Manchester, UK",
        image: "/images/testimonials/client-3.jpg",
        content: "Reliable delivery and consistent quality. Hindonix has never let us down on our commercial projects. Their range of finishes meets all our specification needs.",
        rating: 5,
      },
      {
        id: 4,
        name: "Fatima Al-Mansoori",
        role: "Procurement Director",
        company: "Al-Mansoori Developments",
        location: "Abu Dhabi, UAE",
        image: "/images/testimonials/client-4.jpg",
        content: "Outstanding B2B partnership. Hindonix understands the demands of large-scale projects and delivers premium hardware that exceeds expectations every time.",
        rating: 5,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
