// 'use client';
// import { useEffect, useState } from "react";

// interface PickingItem {
//   quantity: number;
//   shelf: string;
// }

// interface ProductInventory {
//   name: string;
//   inventory: number;
//   shelf: string;
// }

// export default function PickingListPage() {
//   const [list, setList] = useState<Record<string, PickingItem>>({});
//   const [pickedItems, setPickedItems] = useState<Set<string>>(new Set());
//   const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});

//   useEffect(() => {
//     // Fetch picking list for the previous day
//     fetch("/api/picking-list")
//       .then((res) => res.json())
//       .then((data) => setList(data));

//     // Load initial product inventory from public folder
//     fetch("/data/products.json")
//       .then((res) => res.json())
//       .then((data) => {
//         const map: Record<string, number> = {};
//         for (const id in data) {
//           const product = data[id];
//           map[product.name] = product.inventory;
//         }
//         setInventoryMap(map);
//       });
//   }, []);

//   const togglePicked = (productName: string) => {
//     setPickedItems(prev => {
//       const newSet = new Set(prev);
//       newSet.has(productName) ? newSet.delete(productName) : newSet.add(productName);
//       return newSet;
//     });
//   };

//   const handlePick = async (product: string, quantity: number) => {
//     if (pickedItems.has(product)) return;

//     togglePicked(product);

//     try {
//       const res = await fetch("/api/update-inventory", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productName: product, quantity }),
//       });

//       const result = await res.json();
//       if (result.success) {
//         const newInventory = result.updated.inventory;

//         setInventoryMap(prev => ({
//           ...prev,
//           [product]: newInventory,
//         }));

//         // Alert if stock falls below threshold
//         if (newInventory < 5) {
//           alert(`Inventory for "${product}" is low: only ${newInventory} left.`);
//         }
//       }
//     } catch (err) {
//       console.error("Inventory update failed:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
//         <h1 className="text-3xl font-semibold mb-6 text-gray-800">
//           Picking List (Previous Day)
//         </h1>

//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
//                 <th className="px-4 py-3 border-b">Product</th>
//                 <th className="px-4 py-3 border-b">Quantity</th>
//                 <th className="px-4 py-3 border-b">Shelf</th>
//                 <th className="px-4 py-3 border-b">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(list).map(([product, info]) => {
//                 const isPicked = pickedItems.has(product);
//                 const inventory = inventoryMap[product] ?? 0;
//                 const inventoryClass = inventory < 5 ? "text-red-600 font-bold" : "";

//                 return (
//                   <tr
//                     key={product}
//                     className={`text-gray-800 ${
//                       isPicked ? "bg-green-50 line-through text-gray-500" : "hover:bg-gray-50"
//                     }`}
//                   >
//                     <td className="px-4 py-2 border-b">{product}</td>
//                     <td className="px-4 py-2 border-b font-semibold">{info.quantity}</td>
//                     <td className="px-4 py-2 border-b">{info.shelf}</td>
//                     <td className="px-4 py-2 border-b">
//                       <button
//                         onClick={() => handlePick(product, info.quantity)}
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${
//                           isPicked
//                             ? "bg-green-200 text-green-900"
//                             : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                         }`}
//                       >
//                         {isPicked ? "Picked" : "Not Picked"}
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {Object.keys(list).length === 0 && (
//           <p className="text-gray-500 mt-4">No items to pick for the selected date.</p>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import { useEffect, useState } from "react";

interface PickingItem {
  quantity: number;
  shelf: string;
}

interface ProductInventory {
  name: string;
  inventory: number;
  shelf: string;
}

export default function PickingListPage() {
  const [list, setList] = useState<Record<string, PickingItem>>({});
  const [pickedItems, setPickedItems] = useState<Set<string>>(new Set());
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchPickingList = async (customStart?: string, customEnd?: string) => {
    const actualStart = customStart || startDate;
    const actualEnd = customEnd || endDate;

    if (new Date(actualStart) > new Date(actualEnd)) {
      alert("Start date cannot be after end date.");
      return;
    }

    const res = await fetch("/api/picking-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: actualStart,
        endDate: actualEnd,
      })
    });
    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, number> = {};
        for (const id in data) {
          const product = data[id];
          map[product.name] = product.inventory;
        }
        setInventoryMap(map);
      });
  }, []);

  const togglePicked = (productName: string) => {
    setPickedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(productName) ? newSet.delete(productName) : newSet.add(productName);
      return newSet;
    });
  };

  const handlePick = async (product: string, quantity: number) => {
    if (pickedItems.has(product)) return;

    togglePicked(product);

    try {
      const res = await fetch("/api/update-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: product, quantity }),
      });

      const result = await res.json();
      if (result.success) {
        const newInventory = result.updated.inventory;

        setInventoryMap(prev => ({
          ...prev,
          [product]: newInventory,
        }));

        if (newInventory < 5) {
          alert(`Inventory for "${product}" is low: only ${newInventory} left.`);
        }
      }
    } catch (err) {
      console.error("Inventory update failed:", err);
    }
  };

  const applyQuickRange = (daysAgo: number) => {
    const today = new Date();
    const end = new Date();
    const start = new Date();

    if (daysAgo === 1) {
      // previous day only
      start.setDate(today.getDate() - 1);
      end.setDate(today.getDate() - 1);
    } else {
      // range from N days ago until yesterday
      start.setDate(today.getDate() - daysAgo);
      end.setDate(today.getDate() - 1);
    }

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    setStartDate(startStr);
    setEndDate(endStr);
    fetchPickingList(startStr, endStr);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Picking List by Date Range
        </h1>

        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              id="from"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              id="to"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchPickingList()}
              className="bg-blue-600 text-white px-4 py-2 rounded h-fit"
            >
              Generate
            </button>
            <select
              onChange={(e) => applyQuickRange(Number(e.target.value))}
              defaultValue=""
              className="border p-2 rounded h-fit text-gray-700"
            >
              <option value="" disabled>Select range</option>
              <option value="1">Previous Day</option>
              <option value="3">Past 3 Days</option>
              <option value="7">Past 7 Days</option>
            </select>
          </div>
        </div>

        {startDate && endDate && (
          <p className="text-sm text-gray-600 italic mb-4">
            Showing picking list from <strong>{startDate}</strong> to <strong>{endDate}</strong>.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                <th className="px-4 py-3 border-b">Product</th>
                <th className="px-4 py-3 border-b">Quantity</th>
                <th className="px-4 py-3 border-b">Shelf</th>
                <th className="px-4 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(list).map(([product, info]) => {
                const isPicked = pickedItems.has(product);
                const inventory = inventoryMap[product] ?? 0;
                const inventoryClass = inventory < 5 ? "text-red-600 font-bold" : "";

                return (
                  <tr
                    key={product}
                    className={`text-gray-800 ${
                      isPicked ? "bg-green-50 line-through text-gray-500" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 border-b">{product}</td>
                    <td className={`px-4 py-2 border-b font-semibold ${inventoryClass}`}>{info.quantity}</td>
                    <td className="px-4 py-2 border-b">{info.shelf}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handlePick(product, info.quantity)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isPicked
                            ? "bg-green-200 text-green-900"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {isPicked ? "✅ Picked" : "Mark as Picked"}

                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {Object.keys(list).length === 0 && (
          <p className="text-gray-500 mt-4">No items to pick for the selected date.</p>
        )}
      </div>
    </div>
  );
}

