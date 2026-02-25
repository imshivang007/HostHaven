# HostHaven

**Welcome to HostHaven**, your premier platform for booking unique accommodations around the world. Whether you're looking for a cozy apartment, a luxurious villa, or a unique experience, HostHaven connects hosts and travelers in a seamless and secure environment.

**Live URL:** https://hosthaven.onrender.com

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js (v20.12.2) |
| **Framework** | Express.js |
| **Database** | MongoDB / Mongoose |
| **Templating** | EJS / EJS-Mate |
| **Authentication** | Passport.js (Local Strategy) |
| **Image Storage** | Cloudinary |
| **Security** | Helmet, express-rate-limit, express-mongo-sanitize |
| **Session** | express-session, connect-mongo |
| **Utilities** | Method-override, Multer, Joi, Dotenv, Compression |

---

## ✨ Features

### 🏠 Listings
- Browse diverse property listings worldwide
- Create, edit, and delete listings (owners only)
- Multiple image uploads with Cloudinary integration
- Property categories: Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic, Domes, House Boats
- Advanced amenities: WiFi, Kitchen, Parking, Pool, AC, Heating, Washer, Dryer, TV, Gym, Hot Tub, Pets Allowed, Beachfront, Mountain View, City View, and more
- Search functionality with text indexing
- Map integration for location viewing

### ⭐ Reviews
- Leave reviews after stays
- Star ratings (1-5)
- Automatic average rating calculation
- Cascading deletion of reviews when listings are removed

### 📅 Bookings
- Check-in / Check-out date selection
- Guest count specification
- Automatic price calculation
- Booking status tracking: Pending → Confirmed → Completed
- Payment status tracking: Pending → Paid → Refunded
- Special requests field
- Booking history management

### ❤️ Wishlists
- Save favorite listings
- Personal wishlist management
- Quick add/remove functionality

### 💬 Messaging
- Inbox for received messages
- Sent messages archive
- Direct communication between users and hosts

---

## 🔒 Security

- **Content Security Policy (CSP)** - Configured via Helmet
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **NoSQL Injection Prevention** - MongoDB sanitization
- **Session Security** - HttpOnly cookies, strict same-site policy
- **Password Hashing** - Automatic via passport-local-mongoose
- **Input Validation** - Joi schema validation

---

## 📞 Contact

- **Email:** imshivang007@gmail.com
- **Phone:** +91 8795671049

---

### Thank you for choosing HostHaven! We are excited to connect hosts and travelers around the world. 🌍🏡
