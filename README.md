                                    Manufacturing Inventory Management System
A full-stack web application designed for small manufacturing firms to manage raw materials and finished goods inventory efficiently.
This system provides inventory tracking, stock monitoring, low-stock alerts, and CRUD operations through a RESTful backend service and a simple frontend dashboard.

                                          Project Overview

The Manufacturing Inventory Management System helps organizations:

  Keep track of inventory items
  
  Monitor stock levels
  
  Get alerts for low stock
  
  Perform CRUD operations
  
  Maintain persistent inventory data using a database
  
  The system is built using a microservice-style backend architecture and a lightweight frontend interface.

                                          Tech Stack
Backend

FastAPI

SQLAlchemy

SQLite

Pydantic

Uvicorn

                                            Frontend

HTML

CSS

JavaScript (Fetch API)

                                        Features
🔹 Inventory Management

Add new inventory items

Update item details

Delete items

View all inventory items

🔹 Dashboard Summary

Total number of items

Total inventory value

Low stock item count

🔹 Low Stock Alerts

Automatically detects items where:

quantity_in_stock < reorder_level


Displays real-time low-stock alerts



                           Persistent Database

Uses SQLite database

Data remains saved even after server restart

                             RESTful API

Structured backend with proper API endpoints

Swagger documentation available at:

http://127.0.0.1:8000/docs


                                  📁 Project Structure

```bash
Manufacturing-Inventory-Management-System/
├── inventory_service/
│   ├── main.py
│   ├── model.py
│   ├── schema.py
│   └── database.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── inventory.db
└── README.md
```
                            ⚙️ How to Run the Project
```
1️⃣ Clone the Repository
git clone https://github.com/shivamanand100/Manufacturing-Inventory-Management-System.git
cd Manufacturing-Inventory-Management-System
```
```
2️⃣ Setup Backend

Create virtual environment (optional but recommended):

python -m venv venv
venv\Scripts\activate   # Windows


Install dependencies:

pip install fastapi uvicorn sqlalchemy


Run the backend:

uvicorn inventory_service.main:app --reload


Backend will run at:

http://127.0.0.1:8000


Swagger API docs:

http://127.0.0.1:8000/docs
```
```
3️⃣ Run Frontend

Open the frontend/index.html file using:

VS Code Live Server (recommended)
OR

Any local server

The frontend will connect to:

http://127.0.0.1:8000
```
                        🔌 API Endpoints
Method	Endpoint	Description
GET	/	Service status
GET	/items/	Get all items
POST	/items/	Create item
GET	/items/{id}	Get single item
PUT	/items/{id}	Update item
DELETE	/items/{id}	Delete item
GET	/items/low-stock	Get low stock items
GET	/summary	Get dashboard summary

                                    🧠 Architecture Explanation

The system follows a layered backend architecture:

Database Layer → SQLAlchemy models

Schema Layer → Pydantic validation

API Layer → FastAPI endpoints

Frontend Layer → JavaScript Fetch API connecting to backend

CORS middleware is enabled to allow frontend-backend communication.

```
👨‍💻 Author

Developed by:
Shivam Anand
GitHub: https://github.com/shivamanand100
```
