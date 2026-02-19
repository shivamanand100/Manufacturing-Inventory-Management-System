async function fetchInventory(){
    const res = await fetch("http://localhost:8000/items");
    const data = await res.json();
    inventory = data;
    render();
}


function addItem() {
    const name = document.getElementById("itemName").value;
    const type = document.getElementById("itemType").value;
    const qty = parseInt(document.getElementById("quantity").value);
    const threshold = parseInt(document.getElementById("threshold").value);
    const price = parseFloat(document.getElementById("price").value);

    if (!name || isNaN(qty) || isNaN(threshold) || isNaN(price)) {
        alert("Please fill all fields correctly");
        return;
    }

    const item = {
        id: Date.now(),
        name,
        type,
        qty,
        threshold,
        price
    };

    inventory.push(item);
    render();
}

function deleteItem(id) {
    inventory = inventory.filter(item => item.id !== id);
    render();
}

function updateQuantity(id) {
    const newQty = prompt("Enter new quantity:");
    inventory.forEach(item => {
        if (item.id === id) {
            item.qty = parseInt(newQty);
        }
    });
    render();
}

function render() {
    const table = document.getElementById("inventoryTable");
    const alerts = document.getElementById("alertsList");

    table.innerHTML = "";
    alerts.innerHTML = "";

    let totalValue = 0;
    let lowStockCount = 0;

    inventory.forEach(item => {
        totalValue += item.qty * item.price;

        table.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.qty}</td>
                <td>${item.threshold}</td>
                <td>${item.price}</td>
                <td>
                    <button onclick="updateQuantity(${item.id})">Update</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                </td>
            </tr>
        `;

        if (item.qty < item.threshold) {
            lowStockCount++;
            alerts.innerHTML += `<li>${item.name} stock below threshold!</li>`;
        }
    });

    document.getElementById("totalItems").innerText = inventory.length;
    document.getElementById("totalValue").innerText = "₹" + totalValue;
    document.getElementById("lowStock").innerText = lowStockCount;
}
fetch("http://127.0.0.1:8000/items/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        item_name: "Laptop",
        category: "Electronics",
        quantity_in_stock: 10,
        reorder_level: 5,
        supplier: "Dell"
    })
})
.then(response => response.json())
.then(data => console.log(data));
