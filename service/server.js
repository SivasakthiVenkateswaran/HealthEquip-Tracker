const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Hospital = require("./models/Hospital");
const User = require("./models/user");
const multer = require('multer')

const app = express();
const PORT = 5000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

mongoose
  .connect("mongodb://localhost:27017/hospitalManagement", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));


  




  app.post("/hospitals", upload.single("equipmentImage"), async (req, res) => {
    const { hospitalName, equipmentName, equipmentModel, equipmentYear } =
      req.body;

    try {
      const image = req.file;

      const equipment = {
        name: equipmentName,
        model: equipmentModel,
        year: equipmentYear,
        image: image
          ? {
              filename: image.originalname,
              contentType: image.mimetype,
              image: image.buffer,
            }
          : null,
      };

      let hospital = await Hospital.findOne({ name: hospitalName });

      if (hospital) {
       
        hospital.equipment.push(equipment);
      } else {
        
        hospital = new Hospital({
          name: hospitalName,
          equipment: [equipment],
        });
      }

      await hospital.save();
      res
        .status(201)
        .json({ message: "Hospital updated successfully", hospital });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update hospital" });
    }
  });





   app.post("/addequipment", upload.single("equipmentImage"), async (req, res) => {
     const { hospitalId, equipmentName, equipmentModel, equipmentYear } =
       req.body;

     try {
       const image = req.file;

       const equipment = {
         name: equipmentName,
         model: equipmentModel,
         year: equipmentYear,
         image: image
           ? {
               filename: image.originalname,
               contentType: image.mimetype,
               image: image.buffer,
             }
           : null,
       };

       let hospital = await Hospital.findOne({ _id: hospitalId });

       if (hospital) {
         hospital.equipment.push(equipment);
       } else {
         hospital = new Hospital({
           equipment: [equipment],
         });
       }

       await hospital.save();
       res
         .status(201)
         .json({ message: "Hospital updated successfully", hospital });
     } catch (err) {
       console.error(err);
       res.status(500).json({ error: "Failed to update hospital" });
     }
   });





// Add users route
app.post("/add-users", async (req, res) => {
  const {
    hospitalName,
    adminEmail,
    adminPassword,
    managerEmail,
    managerPassword,
    physicistEmail,
    physicistPassword,
  } = req.body;

  try {
    const hospital = await Hospital.findOne({ name: hospitalName });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const users = [
      {
        hospitalId: hospital._id,
        role: "ADMIN",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
      },
      {
        hospitalId: hospital._id,
        role: "MANAGER",
        email: managerEmail,
        password: await bcrypt.hash(managerPassword, 10),
      },
      {
        hospitalId: hospital._id,
        role: "PHYSICIST",
        email: physicistEmail,
        password: await bcrypt.hash(physicistPassword, 10),
      },
    ];

    await User.insertMany(users);
    res.status(201).json({ message: "Users added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add users" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const hospital = await Hospital.findById(user.hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.status(200).json({ user, hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});




/* =================display=================== */


app.get("/hospitals/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    res.status(200).json(hospital);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch hospital data" });
  }
});






/* -------------------edit-------------------------- */

// Assuming you have an endpoint to update the hospital equipment
app.put("/hospitals/:hospitalId/equipment", async (req, res) => {
  const { hospitalId } = req.params;
  const { equipment } = req.body;

  console.log(hospitalId,equipment);

  try {
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { equipment },
      { new: true }
    );
    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ error: "Failed to update equipment" });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
