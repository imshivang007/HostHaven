const sampleUsers = [
    {
        username: "RahulSharma",
        email: "rahul.sharma@example.com",
        password: "password123",
        bio: "Travel enthusiast and adventure seeker. Love exploring new places!",
        isVerified: true
    },
    {
        username: "PriyaPatel",
        email: "priya.patel@example.com",
        password: "password123",
        bio: "Software engineer who loves weekend getaways and mountain retreats.",
        isVerified: true
    },
    {
        username: "AmitKumar",
        email: "amit.kumar@example.com",
        password: "password123",
        bio: "Business traveler | Hotel reviews | Foodie",
        isVerified: true
    },
    {
        username: "SnehaReddy",
        email: "sneha.reddy@example.com",
        password: "password123",
        bio: "Beach lover and sunset chaser. Always looking for peaceful retreats.",
        isVerified: true
    },
    {
        username: "VikramSingh",
        email: "vikram.singh@example.com",
        password: "password123",
        bio: "Photography enthusiast exploring the beauty of India.",
        isVerified: true
    },
    {
        username: "AnjaliMehta",
        email: "anjali.mehta@example.com",
        password: "password123",
        bio: "Yoga instructor & wellness advocate. Love nature-centric accommodations.",
        isVerified: true
    },
    {
        username: "DeepakJoshi",
        email: "deepak.joshi@example.com",
        password: "password123",
        bio: "Mountain trekker | Hill station explorer | chai lover",
        isVerified: true
    },
    {
        username: "KavitaShah",
        email: "kavita.shah@example.com",
        password: "password123",
        bio: "Family traveler | Disney mom | Making memories",
        isVerified: true
    },
    {
        username: "RohitMalhotra",
        email: "rohit.malhotra@example.com",
        password: "password123",
        bio: "Tech professional | Weekend warrior | History buff",
        isVerified: true
    },
    {
        username: "FatimaAnsari",
        email: "fatima.ansari@example.com",
        password: "password123",
        bio: "Cultural explorer | Heritage sites | Local cuisine",
        isVerified: true
    },
    {
        username: "HostHaven",
        email: "hosthaven@example.com",
        password: "HostHaven@123",
        bio: "HostHaven Platform Admin | Creating memorable stays across India",
        isVerified: true
    }
];

const sampleListings = [
    {
        title: "Luxury Villa in Goa with Private Pool",
        description: "Stunning beachside villa with breathtaking ocean views. Enjoy your private pool, modern amenities, and direct beach access. Perfect for families and groups looking for a relaxing getaway.",
        image: {
            url: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 8500,
        location: "Benaulim",
        country: "India",
        category: "Amazing_Pool",
        guests: 8,
        bedrooms: 4,
        beds: 4,
        baths: 3,
        amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Air Conditioning", "Beachfront", "TV", "Hair Dryer", "Coffee Maker", "Refrigerator"],
        availability: { available: true, minNights: 2, maxNights: 30 }
    },
    {
        title: "Cozy Homestay in Manali",
        description: "Escape to this charming homestay nestled in the Himalayas. Wake up to snow-capped peaks and fresh mountain air. Perfect for couples and families seeking peace.",
        image: {
            url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 3500,
        location: "Manali",
        country: "India",
        category: "Mountains",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Fireplace", "Mountain View", "Hair Dryer"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Heritage Haveli in Jaipur",
        description: "Experience royal living in this beautifully restored 19th-century haveli. Traditional architecture with modern comforts in the heart of the Pink City.",
        image: {
            url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 6000,
        location: "Jaipur",
        country: "India",
        category: "Iconic_Cities",
        guests: 6,
        bedrooms: 3,
        beds: 3,
        baths: 3,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "Garden", "TV", "Iron", "Security Cameras"],
        availability: { available: true, minNights: 1, maxNights: 30 }
    },
    {
        title: "Beachside Cottage in Kerala",
        description: "Traditional Kerala-style cottage with modern amenities. Wake up to the sound of waves and enjoy authentic Kerala cuisine. Houseboat rides available on request.",
        image: {
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 4500,
        location: "Kumarakom",
        country: "India",
        category: "Trending",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Beachfront", "TV", "Coffee Maker", "Microwave", "Hair Dryer"],
        availability: { available: true, minNights: 2, maxNights: 21 }
    },
    {
        title: "Modern Apartment in Mumbai",
        description: "Sleek and modern apartment in the heart of Mumbai. Walking distance to local attractions, restaurants, and public transport. Perfect for business travelers.",
        image: {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 5000,
        location: "Mumbai",
        country: "India",
        category: "Iconic_Cities",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "TV", "Washer", "Elevator", "Workspace"],
        availability: { available: true, minNights: 1, maxNights: 30 }
    },
    {
        title: "Treehouse Retreat in Coorg",
        description: "Unique treehouse experience surrounded by coffee plantations. Breathe in the fresh air and enjoy nature at its best. Perfect for adventure seekers.",
        image: {
            url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 5500,
        location: "Coorg",
        country: "India",
        category: "Trending",
        guests: 2,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        amenities: ["WiFi", "Kitchen", "Parking", "Mountain View", "Garden", "Coffee Maker"],
        availability: { available: true, minNights: 1, maxNights: 7 }
    },
    {
        title: "Houseboat in Srinagar",
        description: "Experience the magic of Kashmir on a traditional houseboat. Enjoy stunning views of Dal Lake and surrounding mountains. Includes breakfast.",
        image: {
            url: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 7000,
        location: "Srinagar",
        country: "India",
        category: "House_Boats",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Heating", "Mountain View", "Lakefront", "TV", "Hair Dryer"],
        availability: { available: true, minNights: 2, maxNights: 14 }
    },
    {
        title: "Desert Camp in Jaisalmer",
        description: "Luxury tented accommodation in the Thar Desert. Experience camel safaris, folk performances, and starlit dinners. True Rajasthani hospitality!",
        image: {
            url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 4000,
        location: "Jaisalmer",
        country: "India",
        category: "Camping",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Parking", "Garden", "BBQ", "Fireplace"],
        availability: { available: true, minNights: 1, maxNights: 7 }
    },
    {
        title: "Farm Stay in Nashik",
        description: "Organic farm stay in the wine capital of India. Fresh produce, vineyard tours, and peaceful countryside. Perfect for weekend escape!",
        image: {
            url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 3500,
        location: "Nashik",
        country: "India",
        category: "Farms",
        guests: 6,
        bedrooms: 3,
        beds: 3,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Garden", "BBQ", "Coffee Maker", "Microwave"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Lakeside Resort in Nainital",
        description: "Scenic resort overlooking Naini Lake. Enjoy boating, nature walks, and stunning Himalayan views. Perfect family destination!",
        image: {
            url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 4500,
        location: "Nainital",
        country: "India",
        category: "Mountains",
        guests: 6,
        bedrooms: 3,
        beds: 3,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Mountain View", "Lakefront", "TV", "Coffee Maker"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "City View Penthouse in Bangalore",
        description: "Luxury penthouse with stunning city skyline views. Modern amenities, rooftop access, and prime location. Perfect for tech professionals!",
        image: {
            url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 8000,
        location: "Bangalore",
        country: "India",
        category: "Iconic_Cities",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "TV", "Washer", "Gym", "Elevator", "Workspace", "City View"],
        availability: { available: true, minNights: 1, maxNights: 30 }
    },
    {
        title: "Eco-Dome in Rishikesh",
        description: "Unique geodesic dome experience in the yoga capital. Sustainable living, river views, and spiritual atmosphere. Perfect for wellness seekers!",
        image: {
            url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 4500,
        location: "Rishikesh",
        country: "India",
        category: "Domes",
        guests: 2,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        amenities: ["WiFi", "Kitchen", "Parking", "Mountain View", "Garden", "Coffee Maker"],
        availability: { available: true, minNights: 2, maxNights: 14 }
    },
    {
        title: "Beach Resort in Andaman",
        description: "Tropical paradise in the Andaman Islands. Crystal clear waters, coral reefs, and white sandy beaches. Ultimate island escape!",
        image: {
            url: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 9000,
        location: "Havelock Island",
        country: "India",
        category: "Trending",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Pool", "Air Conditioning", "Beachfront", "TV", "Hair Dryer", "Coffee Maker"],
        availability: { available: true, minNights: 3, maxNights: 21 }
    },
    {
        title: "Royal Palace Stay in Udaipur",
        description: "Live like royalty in this heritage palace hotel. Stunning lake views, traditional architecture, and world-class hospitality.",
        image: {
            url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 12000,
        location: "Udaipur",
        country: "India",
        category: "Castles",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Pool", "Air Conditioning", "Lakefront", "TV", "Gym", "Hot Tub", "Hair Dryer"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Tea Garden Bungalow in Darjeeling",
        description: "Charming colonial bungalow amidst tea gardens. Wake up to misty mountains and fresh tea. Perfect for railway station visits!",
        image: {
            url: "https://images.unsplash.com/photo-1637737118663-f1a53ee1d5a7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1637737118663-f1a53ee1d5a7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", filename: "image1" }
        ],
        price: 4000,
        location: "Darjeeling",
        country: "India",
        category: "Mountains",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Mountain View", "Garden", "Coffee Maker"],
        availability: { available: true, minNights: 2, maxNights: 14 }
    },
    {
        title: "Snow View Chalet in Gulmarg",
        description: "Ski-in/ski-out chalet in India's premier ski destination. Fireplace, heating, and breathtaking snow views. Winter paradise!",
        image: {
            url: "https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 7500,
        location: "Gulmarg",
        country: "India",
        category: "Arctic",
        guests: 6,
        bedrooms: 3,
        beds: 3,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Fireplace", "Mountain View", "TV", "Hair Dryer"],
        availability: { available: true, minNights: 2, maxNights: 14 }
    },
    {
        title: "Backwater Villa in Alleppey",
        description: "Luxury villa with backwater views and private courtyard. Traditional Kerala architecture with modern comforts. Includes houseboat option!",
        image: {
            url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 5500,
        location: "Alleppey",
        country: "India",
        category: "House_Boats",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "Garden", "TV", "Coffee Maker"],
        availability: { available: true, minNights: 2, maxNights: 14 }
    },
    {
        title: "Historic Hotel in Varanasi",
        description: "Heritage hotel near the ghats of Ganges. Experience the spiritual capital with comfort and convenience. Ganges views available!",
        image: {
            url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 3500,
        location: "Varanasi",
        country: "India",
        category: "Iconic_Cities",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Air Conditioning", "TV", "Hair Dryer", "Elevator"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Jungle Resort in Jim Corbett",
        description: "Wildlife resort near Jim Corbett National Park. Jeep safaris, nature walks, and wildlife sightings. Perfect for nature lovers!",
        image: {
            url: "https://images.unsplash.com/photo-1617809315219-337586948238?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1617809315219-337586948238?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", filename: "image1" }
        ],
        price: 5000,
        location: "Jim Corbett",
        country: "India",
        category: "Trending",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Garden", "TV", "Coffee Maker", "Microwave"],
        availability: { available: true, minNights: 1, maxNights: 7 }
    },
    {
        title: "Apartments in Chennai",
        description: "Modern serviced apartment in the heart of Chennai. Close to beaches, shopping malls, and IT parks. Perfect for business travelers!",
        image: {
            url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 4500,
        location: "Chennai",
        country: "India",
        category: "Iconic_Cities",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "TV", "Washer", "Elevator", "Workspace"],
        availability: { available: true, minNights: 1, maxNights: 30 }
    },
    {
        title: "Ooty Hill Station Cottage",
        description: "Charming colonial cottage in the Queen of Hill Stations. Lush green gardens, botanical gardens, and scenic train rides!",
        image: {
            url: "https://images.unsplash.com/photo-1583700295619-04893ffa2741?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1583700295619-04893ffa2741?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", filename: "image1" }
        ],
        price: 3500,
        location: "Ooty",
        country: "India",
        category: "Mountains",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Garden", "Mountain View", "TV", "Coffee Maker"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Mysore Heritage Stay",
        description: "Traditional mansion in the cultural capital of Karnataka. Close to palace, zoo, and Chamundi Hill. Perfect for families!",
        image: {
            url: "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?q=80&w=1294&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?q=80&w=1294&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", filename: "image1" }
        ],
        price: 4000,
        location: "Mysore",
        country: "India",
        category: "Iconic_Cities",
        guests: 6,
        bedrooms: 3,
        beds: 3,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "Garden", "TV", "Hair Dryer"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Shimla Mountain Retreat",
        description: "Peaceful retreat with panoramic mountain views. Walking distance to Mall Road. Colonial charm with modern amenities.",
        image: {
            url: "https://images.unsplash.com/photo-1610178009236-02461f18b272?q=80&w=1262&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1610178009236-02461f18b272?q=80&w=1262&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", filename: "image1" }
        ],
        price: 4500,
        location: "Shimla",
        country: "India",
        category: "Mountains",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Mountain View", "TV", "Coffee Maker"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Hampi Ruins Homestay",
        description: "Unique homestay near UNESCO World Heritage site. Explore ancient ruins, boulder climbing, and sunset viewpoints. History lover's dream!",
        image: {
            url: "https://images.unsplash.com/photo-1616606484004-5ef3cc46e39d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1616606484004-5ef3cc46e39d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", filename: "image1" }
        ],
        price: 2500,
        location: "Hampi",
        country: "India",
        category: "Trending",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 1,
        amenities: ["WiFi", "Kitchen", "Parking", "Garden", "TV"],
        availability: { available: true, minNights: 1, maxNights: 7 }
    },
    {
        title: "Pondicherry Beach House",
        description: "French colonial townhouse in the quiet neighborhood. Walk to Promenade Beach. Perfect blend of Indian and French culture!",
        image: {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 4000,
        location: "Pondicherry",
        country: "India",
        category: "Trending",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "TV", "Coffee Maker", "Hair Dryer"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Hyderabad Luxury Flat",
        description: "Premium apartment in the IT corridor. Near GMR Forum Mall and major corporate offices. Perfect for IT professionals!",
        image: {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 5500,
        location: "Hyderabad",
        country: "India",
        category: "Iconic_Cities",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "TV", "Washer", "Gym", "Elevator", "Workspace"],
        availability: { available: true, minNights: 1, maxNights: 30 }
    },
    {
        title: "Munnar Tea Plantation Stay",
        description: "Serene stay in the middle of tea gardens. Fresh mountain air, guided tea tours, and stunning valley views. Pure bliss!",
        image: {
            url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/45002629.jpg?k=e56eab87264865b6e1077ffa21c083c0ca3e6b3cf070269f75950615ff5382ab&o=",
            filename: "listingimage"
        },
        images: [
            { url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/45002629.jpg?k=e56eab87264865b6e1077ffa21c083c0ca3e6b3cf070269f75950615ff5382ab&o=", filename: "image1" }
        ],
        price: 4000,
        location: "Munnar",
        country: "India",
        category: "Farms",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Mountain View", "Garden", "Coffee Maker"],
        availability: { available: true, minNights: 1, maxNights: 14 }
    },
    {
        title: "Leh Ladakh Adventure Camp",
        description: "High-altitude glamping in the Himalayas. Stunning landscapes, monasteries, and adventure activities. Once in a lifetime experience!",
        image: {
            url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        },
        images: [
            { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "image1" }
        ],
        price: 6000,
        location: "Leh",
        country: "India",
        category: "Arctic",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 2,
        amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Mountain View", "Garden"],
        availability: { available: true, minNights: 2, maxNights: 14 }
    }
];

const sampleReviews = [
    // Reviews for Goa Villa
    { rating: 5, comment: "Absolutely stunning property! The private pool was amazing and the location was perfect. Will definitely come back!" },
    { rating: 4, comment: "Great place for a family vacation. Clean, spacious, and well-maintained. The beach access was a bonus." },
    
    // Reviews for Manali Homestay
    { rating: 5, comment: "Best mountain getaway! The views were breathtaking and the hospitality was outstanding. Highly recommended!" },
    { rating: 5, comment: "Cozy and warm homestay. The fireplace was perfect for cold evenings. The host was very accommodating." },
    
    // Reviews for Jaipur Haveli
    { rating: 5, comment: "Experience like royalty! The heritage architecture is stunning and the location is perfect for exploring the city." },
    { rating: 4, comment: "Beautiful haveli with authentic Rajasthani decor. The rooftop views of the city were amazing." },
    
    // Reviews for Kerala Cottage
    { rating: 5, comment: "Perfect backwater experience! The traditional Kerala style and the houseboat ride were highlights of our trip." },
    { rating: 4, comment: "Peaceful location with amazing food. The host arranged a wonderful sunset cruise for us." },
    
    // Reviews for Mumbai Apartment
    { rating: 4, comment: "Great location and modern amenities. Perfect for business travelers. Will use again." },
    { rating: 3, comment: "Decent place with good connectivity. Could use some more kitchenware." },
    
    // Reviews for Coorg Treehouse
    { rating: 5, comment: "Unique experience! Waking up in the treehouse surrounded by nature was magical. Coffee plantations were beautiful." },
    { rating: 4, comment: "Amazing location for nature lovers. The treehouse is well-built and comfortable." },
    
    // Reviews for Srinagar Houseboat
    { rating: 5, comment: "Dream come true! The houseboat was beautiful and the shikara ride at sunset was unforgettable." },
    { rating: 5, comment: "Authentic Kashmiri experience. The hospitality was exceptional and the views were stunning." },
    
    // Reviews for Jaisalmer Desert Camp
    { rating: 4, comment: "Incredible desert experience! The camel safari and folk performances were amazing. Starry night was magical." },
    { rating: 4, comment: "Well-organized camp with great food. The desert sunset was a sight to behold." },
    
    // Reviews for Nashik Farm Stay
    { rating: 5, comment: "Perfect weekend getaway! Fresh organic food and vineyard tours were the highlights." },
    { rating: 4, comment: "Peaceful farm experience. The kids loved playing in the fields. Good value for money." },
    
    // Reviews for Nainital Resort
    { rating: 4, comment: "Beautiful lake views and great service. The boat ride was very enjoyable." },
    { rating: 4, comment: "Classic hill station experience. The location is perfect for exploring Nainital." },
    
    // Reviews for Bangalore Penthouse
    { rating: 5, comment: "Luxury at its best! The city views from the rooftop were spectacular. Fully equipped with all amenities." },
    { rating: 4, comment: "Great for tech professionals. The workspace setup was perfect for remote work." },
    
    // Reviews for Rishikesh Eco-Dome
    { rating: 5, comment: "Unique spiritual experience! The dome was comfortable and the river views were peaceful." },
    { rating: 4, comment: "Perfect for yoga and meditation. The sustainable living aspect was very refreshing." },
    
    // Reviews for Andaman Resort
    { rating: 5, comment: "Paradise on earth! Crystal clear waters and white sand beaches. The best beach vacation ever!" },
    { rating: 5, comment: "Ultimate island escape. Scuba diving and snorkeling were amazing. Resort was top-notch." },
    
    // Reviews for Udaipur Palace
    { rating: 5, comment: "Living a royal life! The lake views were breathtaking and the service was world-class." },
    { rating: 5, comment: "Fairytale experience! The heritage architecture and boat ride on Lake Pichola were unforgettable." },
    
    // Reviews for Darjeeling Tea Garden
    { rating: 5, comment: "Colonial charm at its best! Waking up to tea garden views and the toy train ride was magical." },
    { rating: 4, comment: "Peaceful retreat with authentic colonial feel. The tea tours were very informative." },
    
    // Reviews for Gulmarg Chalet
    { rating: 5, comment: "Winter wonderland! The ski-in/ski-out access was so convenient. Snow views were amazing!" },
    { rating: 4, comment: "Great for skiing enthusiasts. The fireplace kept us warm after a day on the slopes." }
];

module.exports = { 
    users: sampleUsers,
    data: sampleListings,
    reviews: sampleReviews
};
