import express from "express"
import cors from "cors"
const PORT = 3003
// import dashboardRoute from "./routes/Dashboard.js"
// import medicationRoute from "./routes/Medication.js"
// import barangayRoute from "./routes/Barangay.js"
// import antiRabiesSpeciesRoute from "./routes/AntiRabiesSepcies.js"
// import dewormSpeciesRoute from "./routes/DewormSpecies.js"
// import antiRabiesVaccinationRoute from "./routes/AntiRabiesVaccination.js"
// import dogPoundRoute from "./routes/DogPound.js"
// import adoptClaimRoute from "./routes/AdoptClaim.js"
// import disposedDogRoute from "./routes/DisposedDog.js"
import transactionRoute from "./routes/Transaction.js"
import tractItemQuantityRoute from "./routes/TrackItemQuantity.js"
import itemRoute from "./routes/Item.js"
import itemStockRoute from "./routes/ItemStock.js"
import borrowerRoute from "./routes/Borrower.js"
import loginRoute from "./routes/Login.js"
import userRoute from "./routes/Users.js"
// import backupRoute from "./routes/Backup.js"
const app = express() 

// middleware for server
app.use(express.json())
app.use(cors())

// app.use("/dashboard",  dashboardRoute);
// app.use("/medication",  medicationRoute);
// app.use("/barangay",  barangayRoute);
// app.use("/anti_rabies_species",  antiRabiesSpeciesRoute);
// app.use("/deworm_species",  dewormSpeciesRoute);
// app.use("/anti_rabies_vaccination",  antiRabiesVaccinationRoute);
// app.use("/dog_pound",  dogPoundRoute);
// app.use("/adopt_claim",  adoptClaimRoute);
// app.use("/disposed_dog",  disposedDogRoute);
app.use("/track_item_quantity",  tractItemQuantityRoute);
app.use("/transaction",  transactionRoute);
app.use("/item",  itemRoute);
app.use("/item_stock",  itemStockRoute);
app.use("/borrower",  borrowerRoute);
app.use("/login",  loginRoute);
app.use("/users",  userRoute);
// app.use("/backup",  backupRoute);

app.get('/', (req, res) => {
    res.send("Weclome to the Server")
})
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT)
})