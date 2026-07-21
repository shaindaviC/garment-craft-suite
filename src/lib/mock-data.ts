// Realistic mock data for the Garment Manufacturing ERP.
// Everything a component needs lives here so v1 works with no backend.

export type Role = "Admin" | "Production Staff" | "Sales Staff";

export const currentUser = {
  name: "Priya Sharma",
  email: "priya@atelierco.com",
  role: "Admin" as Role,
  initials: "PS",
};

export type Fabric = {
  id: string;
  name: string;
  type: string;
  color: string;
  width: number; // inches
  available: number; // metres
  pricePerMetre: number; // INR
  supplier: string;
  minStock: number;
};

export const fabrics: Fabric[] = [
  { id: "FAB-1001", name: "Premium Cotton Poplin", type: "Cotton", color: "Ivory White", width: 58, available: 420, pricePerMetre: 285, supplier: "Suryodaya Textiles", minStock: 150 },
  { id: "FAB-1002", name: "Rayon Challis", type: "Rayon", color: "Coral Pink", width: 44, available: 62, pricePerMetre: 210, supplier: "Rajwada Mills", minStock: 120 },
  { id: "FAB-1003", name: "Georgette", type: "Synthetic", color: "Emerald Green", width: 60, available: 340, pricePerMetre: 340, supplier: "Rajwada Mills", minStock: 100 },
  { id: "FAB-1004", name: "Handloom Linen", type: "Linen", color: "Natural Beige", width: 54, available: 88, pricePerMetre: 520, supplier: "Malhar Handlooms", minStock: 90 },
  { id: "FAB-1005", name: "Silk Chanderi", type: "Silk", color: "Royal Blue", width: 44, available: 175, pricePerMetre: 780, supplier: "Banaras Silk House", minStock: 60 },
  { id: "FAB-1006", name: "Denim 12oz", type: "Denim", color: "Indigo", width: 58, available: 610, pricePerMetre: 395, supplier: "Suryodaya Textiles", minStock: 200 },
  { id: "FAB-1007", name: "Modal Jersey", type: "Knit", color: "Charcoal", width: 68, available: 28, pricePerMetre: 260, supplier: "Coimbatore Knits", minStock: 80 },
  { id: "FAB-1008", name: "Kalamkari Print Cotton", type: "Cotton", color: "Multicolour", width: 44, available: 220, pricePerMetre: 310, supplier: "Malhar Handlooms", minStock: 100 },
  { id: "FAB-1009", name: "Crepe", type: "Synthetic", color: "Blush", width: 58, available: 45, pricePerMetre: 240, supplier: "Rajwada Mills", minStock: 90 },
  { id: "FAB-1010", name: "Cotton Satin", type: "Cotton", color: "Midnight Black", width: 58, available: 265, pricePerMetre: 320, supplier: "Suryodaya Textiles", minStock: 120 },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  designNo: string;
  size: string[];
  sellingPrice: number;
  fabricPerUnit: number; // metres
  image: string;
  active: boolean;
};

export const products: Product[] = [
  { id: "PRD-501", name: "Anaya Anarkali Kurta", category: "Women Ethnic", designNo: "AN-24-014", size: ["S","M","L","XL"], sellingPrice: 2499, fabricPerUnit: 3.2, image: "🥻", active: true },
  { id: "PRD-502", name: "Classic Chino Trouser", category: "Men Bottoms", designNo: "CH-24-007", size: ["30","32","34","36","38"], sellingPrice: 1799, fabricPerUnit: 1.6, image: "👖", active: true },
  { id: "PRD-503", name: "Silk Chanderi Saree", category: "Women Ethnic", designNo: "SR-24-021", size: ["Free"], sellingPrice: 5499, fabricPerUnit: 5.5, image: "🥻", active: true },
  { id: "PRD-504", name: "Denim Slim Jeans", category: "Men Bottoms", designNo: "DN-24-002", size: ["30","32","34","36"], sellingPrice: 2299, fabricPerUnit: 1.8, image: "👖", active: true },
  { id: "PRD-505", name: "Linen Shirt", category: "Men Tops", designNo: "LS-24-009", size: ["S","M","L","XL"], sellingPrice: 1999, fabricPerUnit: 2.1, image: "👔", active: true },
  { id: "PRD-506", name: "Kalamkari Wrap Dress", category: "Women Western", designNo: "KL-24-011", size: ["XS","S","M","L"], sellingPrice: 2899, fabricPerUnit: 2.8, image: "👗", active: false },
  { id: "PRD-507", name: "Cotton Palazzo Set", category: "Women Ethnic", designNo: "PL-24-018", size: ["S","M","L"], sellingPrice: 1899, fabricPerUnit: 3.5, image: "🥻", active: true },
  { id: "PRD-508", name: "Modal Loungewear Set", category: "Loungewear", designNo: "LG-24-005", size: ["S","M","L","XL"], sellingPrice: 1599, fabricPerUnit: 2.4, image: "🩱", active: true },
];

export type PaymentStatus = "Paid" | "Partial" | "Unpaid";
export type ProductionStatus = "Cutting" | "Stitching" | "Quality" | "Ironing" | "Packing" | "Completed";

export const productionStages: ProductionStatus[] = ["Cutting","Stitching","Quality","Ironing","Packing","Completed"];

export type Order = {
  id: string;
  customer: string;
  phone: string;
  product: string;
  size: string;
  qty: number;
  orderDate: string;
  deliveryDate: string;
  payment: PaymentStatus;
  production: ProductionStatus;
  total: number;
};

export const orders: Order[] = [
  { id: "ORD-2401", customer: "Meera Iyer", phone: "+91 98450 12345", product: "Anaya Anarkali Kurta", size: "M", qty: 25, orderDate: "2026-07-02", deliveryDate: "2026-07-22", payment: "Partial", production: "Stitching", total: 62475 },
  { id: "ORD-2402", customer: "Rohan Verma", phone: "+91 99720 44821", product: "Classic Chino Trouser", size: "32", qty: 60, orderDate: "2026-07-04", deliveryDate: "2026-07-24", payment: "Paid", production: "Ironing", total: 107940 },
  { id: "ORD-2403", customer: "Aditi Kapoor", phone: "+91 98111 09823", product: "Silk Chanderi Saree", size: "Free", qty: 12, orderDate: "2026-07-06", deliveryDate: "2026-07-28", payment: "Unpaid", production: "Cutting", total: 65988 },
  { id: "ORD-2404", customer: "Vikram Nair", phone: "+91 90030 11244", product: "Denim Slim Jeans", size: "34", qty: 80, orderDate: "2026-07-08", deliveryDate: "2026-07-30", payment: "Paid", production: "Quality", total: 183920 },
  { id: "ORD-2405", customer: "Sneha Reddy", phone: "+91 94480 78123", product: "Linen Shirt", size: "L", qty: 40, orderDate: "2026-07-10", deliveryDate: "2026-08-01", payment: "Partial", production: "Stitching", total: 79960 },
  { id: "ORD-2406", customer: "Arjun Mehta", phone: "+91 98330 55210", product: "Cotton Palazzo Set", size: "M", qty: 30, orderDate: "2026-07-12", deliveryDate: "2026-08-02", payment: "Paid", production: "Packing", total: 56970 },
  { id: "ORD-2407", customer: "Ishita Bose", phone: "+91 90070 34112", product: "Modal Loungewear Set", size: "S", qty: 55, orderDate: "2026-07-14", deliveryDate: "2026-08-05", payment: "Partial", production: "Cutting", total: 87945 },
  { id: "ORD-2408", customer: "Karan Malhotra", phone: "+91 99110 22334", product: "Anaya Anarkali Kurta", size: "L", qty: 18, orderDate: "2026-07-15", deliveryDate: "2026-08-07", payment: "Paid", production: "Completed", total: 44982 },
  { id: "ORD-2409", customer: "Divya Ramesh", phone: "+91 98450 90011", product: "Silk Chanderi Saree", size: "Free", qty: 8, orderDate: "2026-07-16", deliveryDate: "2026-08-08", payment: "Unpaid", production: "Cutting", total: 43992 },
  { id: "ORD-2410", customer: "Sameer Khan", phone: "+91 98200 44118", product: "Denim Slim Jeans", size: "32", qty: 100, orderDate: "2026-07-17", deliveryDate: "2026-08-10", payment: "Partial", production: "Stitching", total: 229900 },
];

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  fabricSupplied: string;
  totalPurchases: number;
  pendingPayment: number;
};

export const suppliers: Supplier[] = [
  { id: "SUP-01", name: "Suryodaya Textiles", contact: "Mahesh Patel", phone: "+91 98240 11122", fabricSupplied: "Cotton, Denim", totalPurchases: 1245000, pendingPayment: 82000 },
  { id: "SUP-02", name: "Rajwada Mills", contact: "Neha Agarwal", phone: "+91 98730 45566", fabricSupplied: "Rayon, Georgette, Crepe", totalPurchases: 890500, pendingPayment: 0 },
  { id: "SUP-03", name: "Malhar Handlooms", contact: "Ravi Deshmukh", phone: "+91 99450 88291", fabricSupplied: "Linen, Kalamkari", totalPurchases: 512300, pendingPayment: 45500 },
  { id: "SUP-04", name: "Banaras Silk House", contact: "Anjali Mishra", phone: "+91 94150 22773", fabricSupplied: "Silk, Chanderi", totalPurchases: 678900, pendingPayment: 120000 },
  { id: "SUP-05", name: "Coimbatore Knits", contact: "Selvam R.", phone: "+91 90030 44521", fabricSupplied: "Modal, Jersey", totalPurchases: 322000, pendingPayment: 18000 },
];

export const monthlySales = [
  { month: "Feb", revenue: 620000, orders: 42 },
  { month: "Mar", revenue: 748000, orders: 51 },
  { month: "Apr", revenue: 812000, orders: 58 },
  { month: "May", revenue: 905000, orders: 64 },
  { month: "Jun", revenue: 1042000, orders: 72 },
  { month: "Jul", revenue: 1184000, orders: 81 },
];

export const bestSellers = [
  { name: "Denim Slim Jeans", units: 320 },
  { name: "Anaya Anarkali Kurta", units: 265 },
  { name: "Classic Chino Trouser", units: 240 },
  { name: "Linen Shirt", units: 190 },
  { name: "Cotton Palazzo Set", units: 155 },
];

export const fabricConsumption = [
  { type: "Cotton", metres: 1240 },
  { type: "Denim", metres: 980 },
  { type: "Silk", metres: 420 },
  { type: "Linen", metres: 360 },
  { type: "Rayon", metres: 510 },
  { type: "Knit", metres: 280 },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
