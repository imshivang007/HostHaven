const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

async function main(){
    await mongoose.connect("mongodb://localhost:27017/HostHaven");
}
main()
.then((res)=>{
    console.log("MongoDB connected!");
})
.catch((err)=>{
    console.log("MongoDB not connected!");
})

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'66aa8c79937138ec8d3398b1' }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

}

initDB();

