
# Appointment Booking and Payment System

This project is a back-end API for managing appointments with integrated online payment functionality and notification system using **Twilio** for SMS and **Nodemiler** for email alerts.

---

## Table of Contents

- [Appointment Booking and Payment System](#appointment-booking-and-payment-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Notification Workflow](#notification-workflow)
  - [Technologies Used](#technologies-used)
  - [Contribution](#contribution)
  - [License](#license)

## Features

- **User Authentication**: Secure user login and signup.
- **Appointment Management**: Users can book, view, and manage appointments.
- **Online Payments**:
  - Integration with **Stripe** for payment handling.
  - Supports discounts and metadata for payment intents.
- **Notifications**:
  - Email notifications using **Nodemailer**.
  - SMS notifications using **Twilio**.
- **Error Handling**: Comprehensive error management for smooth user experience.
- **Role-Based Access**: Admin and user and provider permissions for managing resources.
- **Database Integration**: MongoDB with Mongoose for data storage.

---

## Installation

1. Clone the repository:

```bash
   git clone https://github.com/MennaAllahZakaria/Appointment-Booking-System-API.git
   ```

1. Navigate to the project directory:

```bash
cd Appointment-Booking-System-API
```

1. Install dependencies:

```bash
npm install
```

---

## Configuration

1. Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000
DB_URI=your_mongo_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE_TIME=your_jwt_expiry_time
STRIPE_SECRET_KEY=your_stripe_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_WHATSAPP_PHONE_NUMBER=your_twilio_whatsapp-phone-number
ENCRYPTION_KEY=your_encryption_key
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

---

## Usage

1. Start the development server:

```bash
npm run dev
```

1. API is now running at `http://localhost:5000`.

---

## API Endpoints

- #### Thi is postman collection for endpoints and its documentation `https://documenter.getpostman.com/view/29296726/2sAYBd88sD`

    ---

## Notification Workflow

- #### Email Notifications
  
  - Sent via **Nodemailer** for critical actions such as booking confirmation and payment reminders.

- #### SMS Notifications

  - Sent via **Twilio** for real-time alerts, e.g., appointment reminders and payment confirmation.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Payment Gateway**: Stripe
- **Notification Services**: Twilio, Nodemailer
- **Authentication**: JWT
- **Environment Management**: dotenv

---

## Contribution

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---

## License

This project is licensed under the MIT License.

---
