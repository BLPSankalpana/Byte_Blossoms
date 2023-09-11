const express = require('express');
const { getFirestore, doc, addDoc, getDoc, updateDoc, deleteDoc, query, where, collection,getDocs} = require('firebase/firestore');
const inventory = require('./config');
const app = express();
app.use(express.json());

app.post("/create", async (req, res) => {
    const data = req.body;

    try {
        // Used the addDoc method to add data to the Firestore collection
        const docRef = await addDoc(inventory, data); 
        console.log("Document written with ID: ", docRef.id);
        res.send({ msg: 'Inventory added successfully' });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).send({ error: 'An error occurred while adding inventory' });
    }
});

app.get("/read", async (req, res) => {
    const productName = req.query.product;
    const inputQuantity = parseInt(req.query.quantity);
    let reqQuentityOnly = (req.query.quentityOnly.trim() === 'true');
    try {

        const querySnapshot = await getDocs(query(inventory, where("ProductName", "==", productName)));
        
        if (querySnapshot.empty) {
            res.send({ result: false, message: 'Product not found' });
            return;
        }
        const productDoc = querySnapshot.docs[0];
        const productData = productDoc.data();
        const remainingQuantity = productData.Quantity;

        if(reqQuentityOnly){
            res.send({ remainingQuantity: remainingQuantity });
            return;
        }

        if (remainingQuantity < inputQuantity) {
            // The remaining quantity is less than the input quantity
            res.send({ result: false, message: 'Insufficient quantity' });
        } else {
            // The remaining quantity is greater than or equal to the input quantity
            res.send({ result: true, message: 'Product available with sufficient quantity' });
        }
    } catch (error) {
        console.error("Error retrieving product: ", error);
        res.status(500).send({ error: 'An error occurred while retrieving the product' });
    }
});

app.put("/update/:productName/:quantity", async (req, res) => {
    const productName = req.params.productName;
    const newQuantity = parseInt(req.params.quantity);
    try {
        // Query Firestore to find a document with the specified product name
        const querySnapshot = await getDocs(query(inventory, where("ProductName", "==", productName)));

        if (querySnapshot.empty) {
            res.status(404).send({ error: 'Product not found' });
            return;
        }
        const productDoc = querySnapshot.docs[0];
        const existingQuantity = productDoc.data().Quantity;
        const updatedQuantity =  newQuantity;
        // Update the inventory with the new quantity
        await updateDoc(productDoc.ref, { Quantity: updatedQuantity });

        res.send({ success: true, message: 'Inventory updated successfully' });
    } catch (error) {
        console.error("Error updating document: ", error);
        res.status(500).send({ error: 'An error occurred while updating the inventory' });
    }
});

app.delete("/delete/:documentId", async (req, res) => {
    const documentId = req.params.documentId;

    try {
        await deleteDoc(doc(inventory, documentId));
        res.send({ msg: 'Inventory deleted successfully' });
    } catch (error) {
        console.error("Error deleting document: ", error);
        res.status(500).send({ error: 'An error occurred while deleting the inventory' });
    }
});

app.listen(4000, () => console.log('Listening on port 4000'));
