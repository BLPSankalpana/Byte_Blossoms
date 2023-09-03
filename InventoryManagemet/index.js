const express = require('express');
const { addDoc, getDoc, updateDoc, deleteDoc, doc } = require('firebase/firestore'); // Import addDoc from Firestore
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

app.get("/read/:documentId", async (req, res) => {
    const documentId = req.params.documentId;

    try {
        // Use the getDoc method to retrieve a document from the Firestore collection
        const docSnap = await getDoc(doc(inventory, documentId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            res.send({ data });
        } else {
            res.status(404).send({ error: 'Document not found' });
        }
    } catch (error) {
        console.error("Error retrieving document: ", error);
        res.status(500).send({ error: 'An error occurred while retrieving the document' });
    }
});

app.put("/update/:documentId", async (req, res) => {
    const documentId = req.params.documentId;
    const newData = req.body;

    try {
        // Use the updateDoc method to update a document in the Firestore collection
        await updateDoc(doc(inventory, documentId), newData);
        res.send({ msg: 'Inventory updated successfully' });
    } catch (error) {
        console.error("Error updating document: ", error);
        res.status(500).send({ error: 'An error occurred while updating the inventory' });
    }
});

app.delete("/delete/:documentId", async (req, res) => {
    const documentId = req.params.documentId;

    try {
        // Use the deleteDoc method to delete a document from the Firestore collection
        await deleteDoc(doc(inventory, documentId));
        res.send({ msg: 'Inventory deleted successfully' });
    } catch (error) {
        console.error("Error deleting document: ", error);
        res.status(500).send({ error: 'An error occurred while deleting the inventory' });
    }
});

app.listen(4000, () => console.log('Listening on port 4000'));
