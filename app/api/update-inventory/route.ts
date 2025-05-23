import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/products.json");

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productName, quantity } = body;

  // Read products.json
  const raw = fs.readFileSync(filePath, "utf-8");
  const products = JSON.parse(raw) as Record<string, {
    name: string;
    inventory: number;
    shelf: string;
  }>;

  // Find product ID by name
  const productId = Object.keys(products).find(
    (key) => products[key].name === productName
  );

  if (!productId) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Decrease inventory
  products[productId].inventory = Math.max(0, products[productId].inventory - quantity);

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

  return NextResponse.json({ success: true, updated: products[productId] });
}
