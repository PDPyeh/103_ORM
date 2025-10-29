const express = require('express');
const app = express();
const port = 3001;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

db.sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch((err) => {
  console.error('Error synchronizing database:', err);
});

app.post('/komik', async (req, res) => {
    const data = req.body;
    try {
        const komik = await db.Komik.create(data);
        res.status(komik);
    } catch (error) {}
        res.send({message: error.message});
});

app.get('/komik', async (req, res) => {
    try {
        const komiks = await db.Komik.findAll();
        res.status(200).json(komiks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve komiks' });
    }
});