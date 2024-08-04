if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express =require("express");
const app =express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const listingRouter=require("./routes/listing");
const reviewRouter=require("./routes/review");
const userRouter=require("./routes/user");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");




app.set("views","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


// const MONGO_URL="mongodb://localhost:27017/HostHaven";
const dbUrl=process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then((res)=>{
    console.log("MongoDB connected!");
})
.catch((err)=>{
    console.log("MongoDB not connected!");
})

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={ 
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async (req,res)=>{
//     const fakeUser = new User({
//         email:"imshi@gmail.com",
//         username:"imshi"
//     });
//     let registeredUser=await User.register(fakeUser,"1234");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

app.use( (err,req,res,next)=>{
    let {status=500,message="Error"}=err;
    res.status(status).render("error.ejs",{err});
})

app.listen(port ,()=>{
    console.log(`Port is listening on: ${port}`);
})
