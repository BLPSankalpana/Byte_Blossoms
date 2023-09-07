// const { exec } = require('child_process');
import axios from 'axios';
import readline from 'readline';

async function getUserName(userId) {
  try {
    const response = await axios.get(`http://localhost:3001/user/users/${userId}`);
    // Handle the successful response here
    const userName = response.data.username; // Assuming the user's name is in the 'username' property of the response
    
    return userName;
  } catch (error) {
    // Handle any errors that occur during the request
    
    return null;
  }
}

async function getInventoryRes(name,qty) {
  try {

    let response = await axios.get(`http://localhost:4000/read?product=${name}&quantity=${qty}&quentityOnly=false`);

    return response.data
  } catch (error) {
    
    
   console.log(error);
  }
}


//  function startMicroservice(microserviceName, cwd) {
//   console.log("Starting microservice " + microserviceName);
//    exec('npm run dev', { cwd }, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`${microserviceName} microservice failed to start:`, error);
//     }
//     console.log(`${microserviceName} microservice stdout:`, stdout);
//     console.error(`${microserviceName} microservice stderr:`, stderr);
//   });
// }

// // Start User Management microservice
// startMicroservice('User Management', './UserManagement');

// // Start Inventory microservice
// startMicroservice('Inventory', './InventoryManagement');

// // Start Order Placement microservice
// startMicroservice('Order Placement', './OrderPlacement');

// // Handle microservice exit events
// userManagementProcess.on('exit', (code) => {
//   console.log(`User Management microservice exited with code ${code}`);
// });

// inventoryProcess.on('exit', (code) => {
//   console.log(`Inventory microservice exited with code ${code}`);
// });

// orderPlacementProcess.on('exit', (code) => {
//   console.log(`Order Placement microservice exited with code ${code}`);
// });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  try {
    console.log('Welcome to BYTE BLOSSOMS Services');
    
    // Simulate user authentication (replace with actual authentication logic)
    let userId = await promptForUserId();
    let userName=await getUserName(userId)
     while(!userName){
      console.log('No such User');
      userId = await promptForUserId();
      userName=await getUserName(userId)
     }
      console.log(`Welcome ${userName}`);
     
    
     
     
   
    // Simulate order placement

    let orderDetails = await promptForOrderDetails();
    let [product, quantity] = orderDetails.split(':');
   let inventoryRes = await getInventoryRes(product, quantity);
     
    while(inventoryRes.result!=true){

    console.log(inventoryRes.message);
    console.log("Plese Try Again");
     orderDetails = await promptForOrderDetails();
     [product, quantity] = orderDetails.split(':');
    inventoryRes = await getInventoryRes(product, quantity);

    }

  const res= await promptForgenerateInvoice()
  if(res=='y'){

    await placeOrder(orderDetails,userId);

  }else if(res=='n'){
console.log("Order Cancelled")
  }

    
  
    // const invoice = generateInvoice(orderDetails);
    // console.log('Order Invoice:');
    // console.log(invoice);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
    process.exit();
  }
}

function promptForUserId() {
  return new Promise((resolve) => {
    rl.question('Enter your User ID: ', (userId) => {
      resolve(userId);
    });
  });
}

function promptForgenerateInvoice() {
  return new Promise((resolve) => {
    rl.question('Do you want to Generate Order !!!:(y/n)', (res) => {
      resolve(res);
    });
  });
}

function promptForOrderDetails() {
  return new Promise((resolve) => {
    rl.question('Enter order details (e.g., "Product:Quantity"): ', (orderDetails) => {
      resolve(orderDetails);
    });
  });
}

async function placeOrder(OrderDetails,userId) {
   let existingQuantity;
   let [product, orderedQuantity] = OrderDetails.split(':');
  try {
    

    // Validate input

    if (!product || !orderedQuantity || isNaN(orderedQuantity)) {
      console.error('Invalid input format.');
      return;
    }

    // Step 1: Check product availability
    let response1 = await axios.get(`http://localhost:4000/read?product=${product}&quantity=${orderedQuantity}&quentityOnly=true`);
     existingQuantity = response1.data.remainingQuantity;

    if (existingQuantity === undefined) {
      console.error('Product not found.');
      return;
    }
    

    // Step 2: Calculate new quantity
    let newQuantity = existingQuantity - orderedQuantity;

    // Step 3: Update inventory
    await axios.put(`http://localhost:4000/update/${product}/${newQuantity}`);
    console.log('Inventory updated successfully.');

    // Step 4: Place the order
    const orderDetails = {
      product: product,
      quantity: orderedQuantity,
      userId:userId
    };

    await axios.post('http://localhost:3002/orders/orders', orderDetails);
    console.log('Order placed successfully.');
  } catch (error) {
    console.error('Error:', error);

    // Rollback inventory if an error occurred
    if (existingQuantity !== undefined) {
      try {
        await axios.put(`http://localhost:4000/update/${product}/${existingQuantity}`);
        console.log('Inventory rollback successful.');
      } catch (rollbackError) {
        console.error('Error rolling back inventory:', rollbackError);
      }
    }

  }
}



main();

