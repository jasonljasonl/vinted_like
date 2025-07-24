# 🛍️ Vinted Like

Vinted Like is a full-stack e-commerce platform designed to simulate a real-world online store experience. It allows users to create and manage product listings, handle shopping carts, and place orders, complete with user authentication, media uploads, and cart checkout functionality.

---

## ✨ Features

* **🧾 User Authentication**: Secure sign-up, login, and user profile management using JWT.
* **📦 Product Management**: Create, edit, and delete products with integrated image support.
* **🛒 Shopping Cart**: Add products, remove items, and track order totals.
* **📸 Image Uploads**: Upload product and profile images with real-time previews.
* **🧑‍💼 Admin Permissions**: Only product creators can update or delete their listings.
* **📬 Order System**: Create orders based on the current shopping cart and track ordered items.

---

## 🛠 Technical Stack

Vinted Like is powered by a modern Python and TypeScript stack, built for clarity and scalability.

### Back-end (FastAPI)

* **FastAPI**: High-performance web framework for Python.
* **Pytest**: Framework for writing clear and concise tests.
* **SQLAlchemy**: Database ORM used with PostgreSQL.
* **Pydantic**: Data validation and schema management.
* **OAuth2 (JWT)**: Secure authentication and authorization.
* **Docker**: Containerized backend for reproducibility and easy deployment.

### Front-end (React + Tailwind)

* **React (TypeScript)**: UI built with reusable components for maintainability.
* **Tailwind CSS**: Utility-first CSS framework for modern and responsive design.
* **Iconify**: Extensive icon support using Material Symbols and other icon sets.

### Architecture & Features

* **Modular FastAPI routes**: Backend routes are split into logical files (auth, products, users, etc.).
* **Image Uploads**: Profile and product images are served via static files.
* **Custom Middleware**: CORS configuration and session management.
* **Dynamic Forms**: User information updates with drag-and-drop file upload UX.

---

## 📦 Future Plans

* ✅ Add product categories and filters
* ❤️ Add wishlist
* ⏳ Integrate payment simulation
* 💬 Add chatting system
* ⭐️ Add users rating

---

## 🧪 Development Notes

* **Local Dev Only**: The current branch is focused on local development.

---

## 🧠 Inspiration

This project is part of a broader initiative to build a social-commerce platform, blending features of e-commerce and social networks. It also serves as a personal portfolio project to demonstrate skills in:

* Python (FastAPI, SQLAlchemy)
* React & TypeScript
* Full-stack application architecture
* Docker containerization

---

⚠️ **This project is still under development and being actively improved.**