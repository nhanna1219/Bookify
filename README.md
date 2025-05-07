# Bookify - Online Bookstore

Bookify is a comprehensive online bookstore platform designed to facilitate the buying and selling of both new and used books. Built with **Spring Boot**, **React**, and **MongoDB**, it offers users a seamless shopping experience, from browsing the catalog to purchasing via **MoMo/VN Pay**. The platform also supports user registration, login, order tracking, reviews, and administrative management.

![image](https://github.com/user-attachments/assets/bce49b2d-40e0-4279-a9a7-392b765d8a00)

## Features

### User Features
- **Authentication:** Register, login, and email verification.
- **Book Browsing:** Search and filter books by category, title, author, and more.
- **Favorites and Cart:** Add books to favorites and shopping cart.
- **Order Management:** Track order status and history.
- **Payment Integration:** Secure payments via MoMo and VN Pay.
- **Reviews and Ratings:** Post and view reviews for books.

### Admin Features
- **User Management:** Manage user accounts and roles.
- **Book Management:** Add, update, and delete book listings, either manually or via CSV.
- **Order Processing:** View and manage orders efficiently.
- **Review Moderation:** Approve or reject reviews.
- **Business Insights:** Dashboard for tracking sales and user activity.

## Technology Stack
- **Backend:** Spring Boot, MongoDB
- **Frontend:** React, Tailwind CSS
- **Payment Integration:** MoMo, VN Pay
- **Data Handling:** REST APIs, JWT for authentication
- **Deployment:** Docker, GitHub

## Installation
1. Clone the repository:
```bash
git clone https://github.com/nhanna1219/Bookify.git
```
2. Navigate to the project directory:
```bash
cd bookify
```
3. Install backend dependencies:
```bash
cd backend
mvn install
```
4. Install frontend dependencies:
```bash
cd frontend
npm install
```
5. Start the backend server:
```bash
mvn spring-boot:run
```
6. Start the frontend server:
```bash
npm run dev
```
7. Access the application at:
```bash
http://localhost:5173
```
