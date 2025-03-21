import db from '../config/database.js';

export const createEmission = (req, res) => {
  const { userId, type, amount } = req.body;
  
  console.log('📝 New emission record request:', { userId, type, amount });

  if (!userId || !type || amount === undefined) {
    console.log('❌ Failed to create emission: Missing required fields');
    return res.status(400).json({ error: 'userId, type, and amount are required' });
  }

  const query = 'INSERT INTO emissions (user_id, type, amount) VALUES (?, ?, ?)';
  
  db.run(query, [userId, type, amount], function(err) {
    if (err) {
      console.error('❌ Error creating emission:', err.message);
      return res.status(500).json({ error: 'Error creating emission record' });
    }
    
    console.log('✅ Emission record created:', { id: this.lastID, userId, type, amount });
    res.status(201).json({
      message: 'Emission record created successfully',
      emissionId: this.lastID
    });
  });
};

export const getUserEmissions = (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;
  
  console.log('🔍 Fetching emissions for user:', { userId, startDate, endDate });

  let query = 'SELECT * FROM emissions WHERE user_id = ?';
  const params = [userId];

  if (startDate && endDate) {
    query += ' AND date BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  query += ' ORDER BY date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('❌ Error fetching emissions:', err.message);
      return res.status(500).json({ error: 'Error fetching emissions' });
    }

    console.log(`✅ Found ${rows.length} emission records`);
    res.json(rows);
  });
};

export const updateEmission = (req, res) => {
  const { id } = req.params;
  const { type, amount } = req.body;
  
  console.log('📝 Update emission request:', { id, type, amount });

  if (!type && amount === undefined) {
    console.log('❌ Failed to update: No fields to update');
    return res.status(400).json({ error: 'At least one field (type or amount) is required' });
  }

  let query = 'UPDATE emissions SET ';
  const params = [];
  const updates = [];

  if (type) {
    updates.push('type = ?');
    params.push(type);
  }
  if (amount !== undefined) {
    updates.push('amount = ?');
    params.push(amount);
  }

  query += updates.join(', ') + ' WHERE id = ?';
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      console.error('❌ Error updating emission:', err.message);
      return res.status(500).json({ error: 'Error updating emission record' });
    }
    
    if (this.changes === 0) {
      console.log('❌ No emission found with id:', id);
      return res.status(404).json({ error: 'Emission record not found' });
    }

    console.log('✅ Emission record updated:', { id });
    res.json({ message: 'Emission record updated successfully' });
  });
};

export const deleteEmission = (req, res) => {
  const { id } = req.params;
  
  console.log('🗑️ Delete emission request:', { id });

  db.run('DELETE FROM emissions WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('❌ Error deleting emission:', err.message);
      return res.status(500).json({ error: 'Error deleting emission record' });
    }

    if (this.changes === 0) {
      console.log('❌ No emission found with id:', id);
      return res.status(404).json({ error: 'Emission record not found' });
    }

    console.log('✅ Emission record deleted:', { id });
    res.json({ message: 'Emission record deleted successfully' });
  });
};
