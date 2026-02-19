const API_BASE = "http://127.0.0.1:8000";

let inventory = [];
let editId = null;

// Load everything on page start
document.addEventListener("DOMContentLoaded", () => {
  fetchInventory().catch((e) => alert("Failed to load inventory: " + e.message));
});

// Common request helper (shows FastAPI error properly)
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    // FastAPI usually returns JSON with "detail" for 422/404 etc.
    let err;
    try {
      err = await res.json();
    } catch {
      err = await res.text();
    }
    throw new Error(typeof err === "string" ? err : JSON.stringify(err));
  }

  // handle non-json responses safely
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}

// Fetch all items
async function fetchInventory() {
  inventory = await request("/items/");
  render();
}

// Add or Update Item
async function addItem() {
  const item_name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("category").value;
  const quantity_in_stock = parseInt(document.getElementById("quantity").value, 10);
  const reorder_level = parseInt(document.getElementById("reorderLevel").value, 10);
  const supplier = document.getElementById("supplier").value.trim();

  // supplier is REQUIRED in your backend schema (supplier: str) :contentReference[oaicite:3]{index=3}
  if (!item_name || !category || isNaN(quantity_in_stock) || isNaN(reorder_level) || !supplier) {
    alert("Please fill all fields properly (including Supplier).");
    return;
  }

  const payload = {
    item_name,
    category,
    quantity_in_stock,
    reorder_level,
    supplier,
  };

  try {
    if (editId === null) {
      // Create
      await request("/items/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } else {
      // Update
      await request(`/items/${editId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      editId = null;
    }

    clearForm();
    await fetchInventory();
  } catch (e) {
    alert("Backend error: " + e.message);
  }
}

// Delete item
async function deleteItem(id) {
  try {
    await request(`/items/${id}`, { method: "DELETE" });
    await fetchInventory();
  } catch (e) {
    alert("Delete failed: " + e.message);
  }
}

// Edit item
function editItem(id) {
  const item = inventory.find((i) => i.id === id);
  if (!item) return;

  document.getElementById("itemName").value = item.item_name;
  document.getElementById("category").value = item.category;
  document.getElementById("quantity").value = item.quantity_in_stock;
  document.getElementById("reorderLevel").value = item.reorder_level;
  document.getElementById("supplier").value = item.supplier;

  editId = id;
}

// Render UI
function render() {
  const table = document.getElementById("inventoryTable");
  const alerts = document.getElementById("alertsList");

  table.innerHTML = "";
  alerts.innerHTML = "";

  let lowStockCount = 0;

  inventory.forEach((item) => {
    table.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.item_name}</td>
        <td>${item.category}</td>
        <td>${item.quantity_in_stock}</td>
        <td>${item.reorder_level}</td>
        <td>${item.supplier}</td>
        <td>${item.last_updated ? new Date(item.last_updated).toLocaleString() : "-"}</td>
        <td>
          <button onclick="editItem(${item.id})">Edit</button>
          <button onclick="deleteItem(${item.id})">Delete</button>
        </td>
      </tr>
    `;

    if (item.quantity_in_stock < item.reorder_level) {
      lowStockCount++;
      alerts.innerHTML += `<li>⚠ ${item.item_name} is below reorder level!</li>`;
    }
  });

  // Dashboard cards
  document.getElementById("totalItems").innerText = inventory.length;
  document.getElementById("lowStock").innerText = lowStockCount;
}

// Clear form
function clearForm() {
  document.getElementById("itemName").value = "";
  document.getElementById("category").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("reorderLevel").value = "";
  document.getElementById("supplier").value = "";
}
function downloadCSV() {
    window.open("http://127.0.0.1:8000/items/download-csv", "_blank");
}
