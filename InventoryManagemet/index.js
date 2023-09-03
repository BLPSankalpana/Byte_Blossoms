const express = require('express');
const { addDoc } = require('firebase/firestore'); // Import addDoc from Firestore
const inventory = require('./config');
const app = express();
app.use(express.json());

app.post("/create", async (req, res) => {
    const data = req.body;

    try {
        // Use the addDoc method to add data to the Firestore collection
        const docRef = await addDoc(inventory, data); // Use addDoc from Firestore here
        console.log("Document written with ID: ", docRef.id);
        res.send({ msg: 'Inventory added successfully' });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).send({ error: 'An error occurred while adding inventory' });
    }
});

app.listen(4000, () => console.log('Listening on port 4000'));
