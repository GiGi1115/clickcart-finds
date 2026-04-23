/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type Platform = "Shopee" | "Shein" | "TikTok" | "Lazada" | "Amazon";

export interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  priceString?: string;
  discountPriceString?: string;
  label: "Deal hot" | "Bán chạy" | "Giảm sâu";
  affiliateLink: string;
  category: string;
  platform: Platform;
  reviews: Review[];
}

export const PLATFORMS: Platform[] = ["Shopee", "Shein", "TikTok", "Lazada", "Amazon"];

export const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty"
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Noise-Cancelling Bluetooth Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 1200000,
    discountedPrice: 450000,
    label: "Giảm sâu",
    affiliateLink: "https://shopee.vn/affiliate-link-placeholder-1",
    category: "Electronics",
    platform: "Shopee",
    reviews: [
      { id: "r1", userName: "John Doe", rating: 5, comment: "Amazing sound quality, strong bass, and great noise cancellation.", date: "2024-03-20" },
      { id: "r2", userName: "Jane Smith", rating: 4, comment: "A bit large for me, but the quality is excellent.", date: "2024-03-15" }
    ]
  },
  {
    id: "2",
    name: "Unisex Cotton 4-Way Stretch T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 250000,
    discountedPrice: 99000,
    label: "Bán chạy",
    affiliateLink: "https://shopee.vn/affiliate-link-placeholder-2",
    category: "Fashion",
    platform: "Shopee",
    reviews: [
      { id: "r3", userName: "Mike C.", rating: 5, comment: "Cool fabric, nice fit, totally worth it.", date: "2024-03-22" }
    ]
  },
  {
    id: "s1",
    name: "Elegant Cut-out Party Dress - Shein Exclusive",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 850000,
    discountedPrice: 450000,
    label: "Deal hot",
    affiliateLink: "https://shein.com/affiliate-link-placeholder-s1",
    category: "Fashion",
    platform: "Shein",
    reviews: [
      { id: "rs1", userName: "Linh G.", rating: 5, comment: "Absolutely stunning, fits perfectly.", date: "2024-04-01" }
    ]
  },
  {
    id: "t1",
    name: "Sunset Projection LED Lamp - TikTok Viral",
    image: "https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 200000,
    discountedPrice: 89000,
    label: "Giảm sâu",
    affiliateLink: "https://tiktok.com/affiliate-link-placeholder-t1",
    category: "Electronics",
    platform: "TikTok",
    reviews: [
      { id: "rt1", userName: "Kien Review", rating: 5, comment: "Bright and atmospheric, exactly as advertised.", date: "2024-04-05" }
    ]
  },
  {
    id: "3",
    name: "Air Fryer 5L Capacity - Healthy Cooking",
    image: "https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 2500000,
    discountedPrice: 1250000,
    label: "Deal hot",
    affiliateLink: "https://shopee.vn/affiliate-link-placeholder-3",
    category: "Home",
    platform: "Shopee",
    reviews: [
      { id: "r4", userName: "David P.", rating: 5, comment: "Crispy chicken, fast delivery.", date: "2024-03-10" }
    ]
  },
  {
    id: "s2",
    name: "Premium Satin Silk Pajama Set",
    image: "https://images.unsplash.com/photo-1631541909061-71e349d1f103?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 450000,
    discountedPrice: 220000,
    label: "Bán chạy",
    affiliateLink: "https://shein.com/affiliate-link-placeholder-s2",
    category: "Fashion",
    platform: "Shein",
    reviews: [
      { id: "rs2", userName: "Annie T.", rating: 4, comment: "Comfortable material, color is slightly darker than the photo.", date: "2024-03-25" }
    ]
  },
  {
    id: "t2",
    name: "Wireless Lavalier Mic for Content Creators",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 950000,
    discountedPrice: 580000,
    label: "Deal hot",
    affiliateLink: "https://tiktok.com/affiliate-link-placeholder-t2",
    category: "Electronics",
    platform: "TikTok",
    reviews: [
      { id: "rt2", userName: "Hanna G.", rating: 5, comment: "Great noise reduction, good battery life, very useful for clips.", date: "2024-04-10" }
    ]
  },
  {
    id: "4",
    name: "Gentle Face Wash for Sensitive Skin",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 350000,
    discountedPrice: 185000,
    label: "Giảm sâu",
    affiliateLink: "https://shopee.vn/affiliate-link-placeholder-4",
    category: "Beauty",
    platform: "Shopee",
    reviews: [
      { id: "r5", userName: "Elena Y.", rating: 4, comment: "Very pleasant to use, doesn't dry out the skin.", date: "2024-03-18" }
    ]
  },
  {
    id: "s3",
    name: "Elegant Office A-line Skirt",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 320000,
    discountedPrice: 150000,
    label: "Bán chạy",
    affiliateLink: "https://shein.com/affiliate-link-placeholder-s3",
    category: "Fashion",
    platform: "Shein",
    reviews: [{ id: "rs3", userName: "Lan K.", rating: 5, comment: "Great fit, high-quality fabric.", date: "2024-03-28" }]
  },
  {
    id: "t3",
    name: "Portable Mini Handheld Blender",
    image: "https://images.unsplash.com/photo-1570197576021-ad15e97a7fb6?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 350000,
    discountedPrice: 199000,
    label: "Bán chạy",
    affiliateLink: "https://tiktok.com/affiliate-link-placeholder-t3",
    category: "Home",
    platform: "TikTok",
    reviews: [{ id: "rt3", userName: "Phuc D.", rating: 4, comment: "Blends smoothly, battery lasts a long time.", date: "2024-04-02" }]
  },
  {
    id: "s4",
    name: "Vintage Style Cat-eye Sunglasses",
    image: "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?q=80&w=1000&auto=format&fit=crop",
    originalPrice: 180000,
    discountedPrice: 75000,
    label: "Giảm sâu",
    affiliateLink: "https://shein.com/affiliate-link-placeholder-s4",
    category: "Beauty",
    platform: "Shein",
    reviews: []
  }
];
