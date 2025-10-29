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
  try {
    const komik = await db.Komik.create(req.body);
    res.status(201).json(komik);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/komik', async (req, res) => {
    try {
        const komiks = await db.Komik.findAll();
        res.send(komiks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve komiks' });
    }
});

app.put('/komik/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).json({ error: 'Komik not found' });
        }
        await komik.update(data);
        res.send({message: 'Komik updated successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update komik' });
    }
});

app.delete('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).json({ error: 'Komik not found' });
        }
        await komik.destroy();
        res.send({ message: 'Komik deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete komik' });
    }
});