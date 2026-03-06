# 🏠 HostHaven - Vacation Rental Platform

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.12.2-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-4.19.2-blue?style=for-the-badge&logo=express" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-8.5.1-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/EJS-Templates-orange?style=for-the-badge" alt="EJS">
  <img src="https://img.shields.io/badge/Razorpay-Payment-purple?style=for-the-badge" alt="Razorpay">
</p>

HostHaven is a full-stack vacation rental platform built with Node.js, Express, MongoDB, and EJS. It enables users to list, discover, and book unique accommodations around the world.

**Live Demo:** https://hosthaven.onrender.com

---

## ✨ Features

### 👤 User Management
- **Authentication**: Secure user registration and login using Passport.js
- **Email Verification**: Account verification via email tokens
- **Password Reset**: Forgot and reset password functionality
- **Profile Management**: User profiles with avatars and bio

### 🏡 Listing Management
- **Create Listings**: Host can list their properties with multiple images
- **Image Upload**: Cloudinary integration for image storage
- **Categories**: Filter by Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic, Domes, House Boats
- **Amenities**: WiFi, Kitchen, Parking, Pool, AC, Heating, and more
- **Map Integration**: Interactive maps showing listing locations (MapBox/OpenStreetMap)
- **Search & Filter**: Search by location, filter by category

### 📅 Booking System
- **Date Selection**: Check-in and check-out date picker
- **Guest Management**: Specify number of guests
- **Payment Integration**: Razorpay payment gateway
- **Booking Status**: Track pending, confirmed, cancelled, and completed bookings
- **Booking History**: View all past and upcoming bookings

### ⭐ Reviews & Ratings
- **Rating System**: 5-star rating with average calculation
- **Review Comments**: Detailed reviews for listings
- **Cascading Deletion**: Automatic cleanup of reviews when listing is deleted

### 💝 Wishlist
- **Save Favorites**: Add listings to personal wishlist
- **Quick Access**: View all saved listings in one place

### 💬 Messaging
- **Inbox**: View received messages
- **Sent Messages**: View sent messages
- **Real-time Updates**: Unread message badge in navbar

### 🛡️ Security Features
- **Helmet**: HTTP security headers
- **Rate Limiting**: Prevent brute-force attacks
- **Mongo Sanitize**: Prevent NoSQL injection
- **Session Management**: Secure cookies with httpOnly and sameSite
- **CSRF Protection**: Cross-site request forgery prevention

### ⚡ Performance & SEO
- **Compression**: Brotli and Gzip compression
- **Sitemap**: Dynamic XML sitemap generation
- **Robots.txt**: Search engine crawling configuration

---

## 🖼️ Listing Categories

| Category | Icon | Description |
|----------|------|-------------|
| Trending | 🔥 | Popular listings |
| Rooms | 🛏️ | Private rooms |
| Iconic Cities | 🏙️ | City center locations |
| Mountains | ⛰️ | Mountain retreats |
| Castles | 🏰 | Historic castles |
| Amazing Pools | 🏊 | Properties with pools |
| Camping | ⛺ | Camping sites |
| Farms | 🐄 | Farm stays |
| Arctic | ❄️ | Arctic experiences |
| Domes | 🛖 | Unique dome stays |
| House Boats | 🚢 | Waterfront living |

---

## 📄 License

ISC License - © 2022 Shivang

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues or questions, please check the FAQ page or help section in the application.

---

<p align="center">Made with ❤️ by Shivang</p>
