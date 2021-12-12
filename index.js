const listenPort = 3333;
let express = require("express");
let path = require("path");
const { ppid } = require("process");
let app = express();
app.set("view engine", "ejs");
app.use(express.static('images'));

let knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        server: "PostgreSQL 14",
        user: "postgres",
        password: "is303",
        database: "postgres",
        port: 5432
    },
    useNullAsDefault: true
});

app.use(express.urlencoded({extended: true})); 
app.listen(listenPort, () => console.log("Express app has started and server is listening!"));

app.get("/", (req, res) => res.render("index"));

//display list of all vehicles
app.get("/displayVehicle", (req,res) => {
    knex('Vehicle').orderBy('vehicle_id')
    .then(vehicleInfo => {
        res.render("displayVehicle", {vehicleData: vehicleInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});


// Add a vehicle
app.get("/addvehicle", function(req, res) {
    res.render("addVehicle");
}); 
app.post("/addVehicle", (req, res) => {
    knex("Vehicle").insert(req.body)
    .then( addResults => {
        res.redirect("/displayVehicle");
    })
}); 

// Delete a vehicle
app.get('/deleteVehicle/:vehicle_id', (req, res) => {
    knex('Vehicle').where('vehicle_id', req.params.vehicle_id).del()
    .then(results => {
        res.redirect("/displayVehicle");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

// Edit a vehicle, GET
app.get('/editVehicle/:vehicle_id', (req,res) => {
    knex('Vehicle').where('vehicle_id', req.params.vehicle_id)
    .then(vehicleInfo => {
        res.render('editVehicle', {vehicleData: vehicleInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

// Edit a vehicle, POST
app.post('/editVehicle', (req,res) =>{
    knex('Vehicle').where('vehicle_id', req.body.lookupID).update({
        'vDescription': req.body.vDescription,
        'vType': req.body.vType,
        'vYear': req.body.vYear,
        'vMileage': req.body.vMileage,
        'vStillUsing': req.body.vStillUsing,
    })
    .then( results => {
        res.redirect("displayVehicle");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

/* me messing around vv
app.get("/", (req, res) => {
    knex.select().from("Vehicle").then(Vehicle => {
        res.render("displayVehicle", {myVehicle : Vehicle});
    });
});      



/*
app.get("/landingejs", function(req,res) {
    res.render("index");
});

app.get("/displayData", (req, res) => {
    res.render("displayData", {
        name: "Intro to Programming",
        courseNo: "IS303",
        days: "MW"
    });
});

app.get('/studentLookup',(req, res) => {
    knex('Student').where('studentID',req.params.studentID)
        .then(studentInfo => {
            res.render("viewStudent",{student: studentInfo});
        }).catch(err => {
            console.log(err);
            res.status(500).json({err});
        });
});

app.get("/liststudents", (req, res) => {
    knex('Student').orderBy('firstName')
        .then(studentInfo => {
            res.render("listStudents",{studentData: studentInfo});
        }).catch(err => {
            console.log(err);
            res.status(500).json({err});
        });
})
*/