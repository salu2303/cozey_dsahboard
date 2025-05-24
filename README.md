
---

##  Features

- Aggregates product quantities needed from previous day's orders
- Maps gift boxes to individual items using `box_definitions.json`
- Displays item name, quantity, and shelf number
- Lets pickers mark items as "Picked"
- Updates inventory in real-time
- Alerts if inventory goes below a critical threshold (e.g. <5)

---

##  Problem-Solving Approach

### Breakdown:
1. **Mapped business objects to structured data**:
   - Orders → Boxes → Products
2. **Centralized transformation logic** using `generatePickingList(date)`
3. **Abstracted domain logic into `/lib`** for easy reuse/testability
4. **Used public JSON** for data but designed code to easily upgrade to a real database
5. **Designed scalable API strategy** with reusable handlers and minimal routes

---

##  Scalability

| Area         | Design Decision |
|--------------|------------------|
| Routing      | One route per domain (`picker`, `inventory`) rather than one per action |
| Logic        | Separated into handler functions in `/lib/api/handlers` |
| UI           | Componentized by domain (e.g., `/app/picking-list`) |
| Data         | Easily replaceable mock JSON with real DB (e.g., Supabase) |
| Growth-ready | New features like picker roles, task assignment, and analytics can plug in without rewrites |

---

##  Known Limitations

-  No real authentication or roles implemented
-  File-based JSON is not concurrent-safe (for demo use only)
-  Only works for "yesterday" — no calendar UI yet
-  No persistence after page reload unless backend stores state

---

##  Future Improvements

- Use Supabase or PostgreSQL for persistent storage
- Assign tasks to individual pickers
- Add login, roles (e.g., Picker vs Manager)
- Add reporting/export (CSV or PDF)
- Add drag-and-drop assignment UI or mobile layout for pickers

---


