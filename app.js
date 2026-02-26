if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const wishlistRouter = require("./routes/wishlist");
const bookingRouter = require("./routes/booking");
const messageRouter = require("./routes/message");
const paymentRouter = require("./routes/payment");
const razorpayController = require("./controllers/razorpay");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// RAZORPAY WEBHOOK - Must be BEFORE express.urlencoded() to receive raw body
app.post("/webhook/razorpay", express.raw({ type: "application/json" }), razorpayController.handleWebhook);

// Security imports
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

// Security: Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});

// Security: Content Security Policy config for helmet
const scriptSrcUrls = [
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://checkout.razorpay.com",
    "https://*.razorpay.com"
];
const styleSrcUrls = [
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com"
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "*.tiles.mapbox.com",
    "events.mapbox.com",
    "https://api.razorpay.com",
    "https://*.razorpay.com",
    "https://api.razorpay.com"
];
const fontSrcUrls = ["cdnjs.cloudflare.com", "fonts.gstatic.com", "fonts.googleapis.com", "'self'", "'unsafe-eval'"];
const frameSrcUrls = ["https://checkout.razorpay.com", "https://*.razorpay.com"];

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// Security: Helmet with custom CSP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            connectSrc: ["'self'", ...connectSrcUrls],
            fontSrc: ["'self'", ...fontSrcUrls],
            imgSrc: ["'self'", "data:", "https:", "https://res.cloudinary.com"],
            frameSrc: ["'self'", ...frameSrcUrls]
        }
    }
}));

// Security: Rate limiting
app.use("/api", limiter);

// Performance: Compression
app.use(compression({
    brotli: { enabled: true, zlib: { level: 6 } },
    gzip: { enabled: true, zlib: { level: 6 } }
}));

// Security: MongoDB sanitize (prevents NoSQL injection)
app.use(mongoSanitize());

//const MONGO_URL="mongodb://localhost:27017/HostHaven";
const dbUrl = process.env.ATLASDB_URL;

// Session secret - must be at least 32 characters with uppercase, lowercase, numbers, and special chars
// for connect-mongo crypto.secret requirement
// Generate a secure secret if not provided or if it doesn't meet complexity requirements
function getSecureSecret() {
    const envSecret = process.env.SECRET;
    const defaultSecret = "ThisIsADefaultSecretKey123!@#ForDevPurposeOnly123";
    
    // If no SECRET env var, use default
    if (!envSecret) {
        return defaultSecret;
    }
    
    // Check if the env secret meets complexity requirements
    const hasUpperCase = /[A-Z]/.test(envSecret);
    const hasLowerCase = /[a-z]/.test(envSecret);
    const hasNumbers = /\d/.test(envSecret);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(envSecret);
    const isLongEnough = envSecret.length >= 32;
    
    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough) {
        return envSecret;
    }
    
    console.warn("WARNING: The supplied SECRET does not meet complexity requirements. Using default secret.");
    console.warn("Required: At least 32 characters with uppercase, lowercase, numbers, and special characters.");
    return defaultSecret;
}

const sessionSecret = getSecureSecret();

async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then((res) => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.log("MongoDB not connected!");
    });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: sessionSecret,
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevents XSS attacks
        // secure: true, // Uncomment in production with HTTPS
        sameSite: 'strict' // CSRF protection
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // Store flash messages in res.locals - they are consumed once when accessed
    // so we need to make them available as arrays
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => { res.redirect("/listings"); });

// SEO: Robots.txt
app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /

# Sitemap
Sitemap: ${req.protocol}://${req.get("host")}/sitemap.xml
`);
});

// SEO: Sitemap.xml
app.get("/sitemap.xml", async (req, res) => {
    try {
        const Listing = require("./models/listing");
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        
        // Get all listings
        const listings = await Listing.find({}, "updatedAt");
        
        // Create sitemap XML
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/listings</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/login</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/signup</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
`;
        
        // Add all listing URLs
        for (const listing of listings) {
            sitemap += `    <url>
        <loc>${baseUrl}/listings/${listing._id}</loc>
        <lastmod>${listing.updatedAt ? listing.updatedAt.toISOString() : new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
`;
        }
        
        sitemap += "</urlset>";
        
        res.type("application/xml");
        res.send(sitemap);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
});

// New feature routes
app.use("/", wishlistRouter);
app.use("/", bookingRouter);
app.use("/", messageRouter);
app.use("/", paymentRouter);

// Existing routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Error" } = err;
    // Check if headers have already been sent to avoid double response
    if (res.headersSent) {
        return res.end();
    }
    res.status(status).render("error.ejs", { err });
})

app.listen(port, () => {
    console.log(`Port is listening on: ${port}`);
})
