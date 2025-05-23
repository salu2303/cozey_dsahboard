import rawOrders from "@/data/orders.json";
import rawBoxDefinitions from "@/data/box_definitions.json";
import rawProducts from "@/data/products.json";

const boxDefinitions: Record<string, string[]> = rawBoxDefinitions;
const products: Record<string, { name: string; inventory: number; shelf: string }> = rawProducts;

interface Order {
  order_id: number;
  order_total: number;
  order_date: string;
  shipping_address: string;
  customer_name: string;
  customer_email: string;
  line_items: {
    line_item_id: number;
    product_id: string;
    product_name: string;
    price: number;
  }[];
}

const orders: Order[] = rawOrders as Order[];

// Main function
export function generatePickingList(date: string) {
    console.log("Generating picking list for date:", date);
  const list: Record<string, { quantity: number; shelf: string }> = {};
  orders
    .filter((order) => order.order_date === date)
    .forEach((order) => {
      order.line_items.forEach((item) => {
        const componentProductIds = boxDefinitions[item.product_id]; 
        if (componentProductIds) {
          componentProductIds.forEach((productId) => {
            const product = products[productId];
            if (product) {
              if (!list[product.name]) {
                list[product.name] = {
                  quantity: 0,
                  shelf: product.shelf
                };
              }
              list[product.name].quantity += 1;
            }
          });
        }
      });
    });

//   return list;
    return Object.entries(list)
    .sort(([, a], [, b]) => a.shelf.localeCompare(b.shelf)) // sort by shelf
    .reduce((acc, [name, data]) => {
        acc[name] = data;
        return acc;
    }, {} as Record<string, { quantity: number; shelf: string }>);

}
