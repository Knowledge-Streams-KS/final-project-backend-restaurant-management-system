# Restaurant Management System

The Restaurant Management System is a comprehensive application designed to streamline and manage various aspects of running a restaurant.

## Table of Content

- [Introduction](#introduction)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Run Locally](#run-locally)
- [Dev Environment](#dev-environment)
- [Technologies Used](#technologies-used)
- [API Authentication](#api-authentication)
- [API Reference](#api-reference)
  - [User Authentication and Management](#user-authentication-and-management)
  - [Recipe Management](#recipe-management)
  - [Ingredient Code Management](#ingredient-code-management)
  - [Order Management](#order-management)
  - [Order Table Management](#order-table-management)
  - [Reservation Management](#reservation-management)
  - [Stock Management](#stock-management)
  - [Inventory Management](#inventory-management)
  - [Time Slots Management](#time-slots-management)
- [Status Codes](#status-codes)
- [Contrubuting](#contributing)

## Introduction

This system provides tools for handling reservations, orders, inventory, employee management, and more. It is built with a focus on efficiency, real-time updates, and role-based access control to ensure that the right people have access to the right information and functionalities.

## Features

- **User Authentication and Authorization:** Secure sign-up and sign-in processes with role-based access control for different functionalities.
- **Real-time Updates:** Use of socket connections for live updates on orders, reservations, and other critical operations.
- **Reservation Management:** Efficient handling of table reservations with OTP verification and pagination.
- **Order Management:** Comprehensive order processing, from creation to billing, with real-time updates and detailed views.
- **Inventory and Recipe Management:** Tools to manage inventory, ingredients, and recipes, ensuring that stock levels are maintained and recipes are up to date.
- **Employee Management:** Admin functionalities for managing employees, including adding salaries, updating profiles, and controlling access.
- **Customizable Layouts and Components:** Flexible and role-specific layouts and components to enhance the user experience.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_NAME`

`DB_PASSWORD`

`DB_USERNAME`

`DB_HOST`

`JWT_SECRET_Key`

`EMAIL_PASS`

`EMAIL_SERVICE`

`EMAIL_USER`

`BASE_URL`

`HOMEPAGE`

## Run Locally

Clone the project

```bash
  git clone https://github.com/Knowledge-Streams-KS/final-project-backend-restaurant-management-system/
```

Go to the project directory

```bash
  cd restaurant-management-system
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Dev Environment 

To deploy this project in Development Environment

```bash
  npm run dev
```

## Technologies Used

**Server:** Node, Express

**Development:** nodemon

**Database:** PostgreSQL

**ORM:** Sequelize

**Token:** JWT

**Real-time Communication:** Socket.io

**Validation:** Joi

**Encryption:** bcrypt

**Email Handling:** Nodemailer

**Scheduling:** cron

**Template Engine:** Express Handlebars

**Date and Time:** moment-timezone

**OTP Generation:** otp-generator

## API Authentication

All API requests require the use of a generated token. You can obtain your token by signing in and navigating to the appropriate endpoint.

To authenticate an API request, provide your token in the `Authorization` header.

**Example:**

```http
GET /api/campaigns
Authorization: Bearer YOUR_TOKEN_HERE
```

## API Reference

### User Authentication and Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `POST`   | `/auth/signup`                   | Sign up a new user                                       |
| `POST`   | `/auth/signin`                   | Sign in an existing user                                 |
| `GET`    | `/users`                         | Retrieve all users (Admin only)                          |
| `GET`    | `/user`                          | Retrieve single user                                     |
| `DELETE` | `/user/:id`                      | Delete a user                                            |
| `GET`    | `/user/verify/:id/:token`        | Verify user email                                        |
| `POST`   | `/auth/verifytoken`              | Verify sign-up token                                     |
| `PATCH`  | `/auth/user/allow/:id`           | Allow user access (Admin only)                           |
| `PATCH`  | `/auth/user/cancel/:id`          | Revoke user access (Admin only)                          |
| `PUT`    | `/user/salary/:id`               | Add salary to user (Admin only)                          |
| `PUT`    | `/user/:id`                      | Update user information                                  |

### Recipe Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/recipes`                       | Retrieve all recipes (Admin, Chef, Waiter)               |
| `GET`    | `/recipe/:id`                    | Retrieve a single recipe (Admin, Chef)                   |
| `POST`   | `/recipe`                        | Create a new recipe (Admin, Chef)                        |
| `PUT`    | `/recipe/:id`                    | Update a recipe (Admin, Chef)                            |
| `DELETE` | `/recipe/:id`                    | Delete a recipe (Admin, Chef)                            |

### Ingredient Code Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/ingredients/code`              | Retrieve all ingredient codes (Admin, Chef)              |
| `POST`   | `/ingredients/code`              | Create a new ingredient code (Admin, Chef)               |
| `DELETE` | `/ingredients/code/:id`          | Delete an ingredient code (Admin, Chef)                  |

### Order Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/orders`                        | Retrieve all orders (Admin, Waiter, Chef)                |
| `GET`    | `/order/:id`                     | Retrieve a single order (Admin, Waiter, Chef)            |
| `POST`   | `/order`                         | Create a new order (Admin, Waiter)                       |
| `PUT`    | `/order/:id`                     | Update an order (Admin, Waiter)                          |
| `PUT`    | `/order/prepared/:id`            | Mark an order as prepared (Admin, Chef)                  |
| `PATCH`  | `/order/served/:id`              | Mark an order as served (Admin, Waiter)                  |
| `PUT`    | `/order/bill/:id`                | Add bill to an order (Admin, Waiter)                     |
| `DELETE` | `/order/:id`                     | Delete an order (Admin)                                  |

### Order Table Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/ordertables`                   | Retrieve all order tables (Admin, Waiter)                |
| `GET`    | `/ordertable/:id`                | Retrieve a single order table (Admin, Waiter)            |
| `POST`   | `/ordertable`                    | Create a new order table (Admin, Waiter)                 |
| `PUT`    | `/ordertable/:id`                | Update an order table (Admin, Waiter)                    |
| `DELETE` | `/ordertable/:id`                | Delete an order table (Admin)                            |

### Reservation Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/reservations`                  | Retrieve all reservations (Admin, Waiter)                |
| `GET`    | `/reservation/:id`               | Retrieve a single reservation (Admin, Waiter)            |
| `POST`   | `/reservation`                   | Create a new reservation                                 |
| `DELETE` | `/reservation/:id`               | Delete a reservation (Admin)                             |
| `POST`   | `/reservation/verify`            | Verify reservation OTP                                   |
| `POST`   | `/reservation/otp`               | Resend reservation OTP                                   |

### Stock Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/allstock`                      | Retrieve all stock (Admin only)                          |

### Inventory Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/inventory`                     | Retrieve all inventory (Admin only)                      |
| `GET`    | `/inventory/:id`                 | Retrieve a single inventory item (Admin only)            |
| `POST`   | `/inventory`                     | Create a new inventory item (Admin only)                 |
| `PUT`    | `/inventory/:id`                 | Update an inventory item (Admin only)                    |
| `DELETE` | `/inventory/:id`                 | Delete an inventory item (Admin only)                    |

### Time Slots Management

| Method   | URL                              | Description                                              |
| -------- | -------------------------------- | -------------------------------------------------------- |
| `GET`    | `/timeslots`                     | Retrieve all time slots                                  |
| `POST`   | `/timeslots`                     | Create a new time slot                                   |

## Status Codes

Following status codes will return :

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 401 | `UNAUTHORIZED` |
| 404 | `NOT FOUND` |
| 409 | `CONFLICT` |
| 500 | `INTERNAL SERVER ERROR` |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
