const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// =======================================================
// Health Check
app.get('/health', (req, res) => {
  res.json({ message: "This is the health check" });
});

// =======================================================
// // ADD TRANSACTION
app.post('/transaction', async (req, res) => {
  try {
    const { amount, description, desc } = req.body;
    const text = description || desc;   // use whichever is provided
    const result = await transactionService.addTransaction(amount, text);
    res.json({ message: 'Added transaction successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});
// =======================================================
// GET ALL TRANSACTIONS
app.get('/transaction', async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    // remap desc → description for frontend
    const mapped = transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      description: t.desc
    }));
    res.json({ result: mapped });
  } catch (err) {
    res.status(500).json({ message: "Could not get all transactions", error: err.message });
  }
});

// =======================================================
// GET SINGLE TRANSACTION BY ID (use query param ?id=)
app.get('/transaction/id', async (req, res) => {
  try {
    const id = req.query.id;
    const results = await transactionService.findTransactionById(id);
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    // remap desc → description
    const mapped = {
      id: results[0].id,
      amount: results[0].amount,
      description: results[0].desc
    };
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving transaction", error: err.message });
  }
});

// =======================================================
// DELETE ALL TRANSACTIONS
app.delete('/transaction', async (req, res) => {
  try {
    await transactionService.deleteAllTransactions();
    res.json({ message: "All transactions deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deleting all transactions may have failed", error: err.message });
  }
});

// =======================================================
// DELETE ONE TRANSACTION BY ID (use body {id: ...})
app.delete('/transaction/id', async (req, res) => {
  try {
    const id = req.body.id;
    await transactionService.deleteTransactionById(id);
    res.json({ message: `Transaction with id ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting transaction", error: err.message });
  }
});

// =======================================================
// Start Server
app.listen(port, () => {
  console.log(`AB3 backend app listening at http://localhost:${port}`);
});