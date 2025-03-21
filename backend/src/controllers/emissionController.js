import db from '../config/database.js';

export const createEmission = (req, res) => {
  const {
    userId,
    mineName,
    mineLocation,
    period,
    coalProduction,
    electricityUsage,
    fuelConsumption,
    methaneEmissions,
    totalEmissions
  } = req.body;
  
  console.log('📝 New emission record request:', { userId, mineName });

  if (!userId || !mineName || !mineLocation || !period) {
    console.log('❌ Failed to create emission: Missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    INSERT INTO emissions (
      user_id, mine_name, mine_location, period,
      coal_production, electricity_usage, fuel_consumption,
      methane_emissions, total_emissions
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    userId,
    mineName,
    mineLocation,
    period,
    coalProduction,
    electricityUsage,
    fuelConsumption,
    methaneEmissions,
    totalEmissions
  ], function(err) {
    if (err) {
      console.error('❌ Error creating emission:', err.message);
      return res.status(500).json({ error: 'Error creating emission record' });
    }
    
    console.log('✅ Emission record created:', { id: this.lastID, mineName });
    res.status(201).json({
      message: 'Emission record created successfully',
      emissionId: this.lastID
    });
  });
};

export const getUserEmissions = (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate, sortBy, sortOrder } = req.query;
  
  console.log('🔍 Fetching emissions for user:', { userId, startDate, endDate, sortBy, sortOrder });

  // Validate sortBy field to prevent SQL injection
  const validSortFields = [
    'mine_name',
    'mine_location',
    'period',
    'coal_production',
    'total_emissions',
    'date'
  ];
  const orderBy = validSortFields.includes(sortBy) ? sortBy : 'date';
  const order = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  let query = `
    SELECT 
      id, user_id, mine_name, mine_location, period,
      coal_production, electricity_usage, fuel_consumption,
      methane_emissions, total_emissions, date
    FROM emissions 
    WHERE user_id = ?
  `;
  const params = [userId];

  if (startDate && endDate) {
    query += ' AND DATE(date) BETWEEN DATE(?) AND DATE(?)';
    params.push(startDate, endDate);
  }

  query += ` ORDER BY ${orderBy} ${order}`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('❌ Error fetching emissions:', err.message);
      return res.status(500).json({ error: 'Error fetching emissions' });
    }

    // Transform snake_case to camelCase for frontend
    const formattedRows = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      mineName: row.mine_name,
      mineLocation: row.mine_location,
      period: row.period,
      coalProduction: row.coal_production,
      electricityUsage: row.electricity_usage,
      fuelConsumption: row.fuel_consumption,
      methaneEmissions: row.methane_emissions,
      totalEmissions: row.total_emissions,
      date: row.date
    }));

    console.log(`✅ Found ${rows.length} emission records`);
    res.json(formattedRows);
  });
};

export const updateEmission = (req, res) => {
  const { id } = req.params;
  const {
    mineName,
    mineLocation,
    period,
    coalProduction,
    electricityUsage,
    fuelConsumption,
    methaneEmissions,
    totalEmissions
  } = req.body;
  
  console.log('📝 Update emission request:', { id, mineName });

  const updates = [];
  const params = [];

  if (mineName) {
    updates.push('mine_name = ?');
    params.push(mineName);
  }
  if (mineLocation) {
    updates.push('mine_location = ?');
    params.push(mineLocation);
  }
  if (period) {
    updates.push('period = ?');
    params.push(period);
  }
  if (coalProduction !== undefined) {
    updates.push('coal_production = ?');
    params.push(coalProduction);
  }
  if (electricityUsage !== undefined) {
    updates.push('electricity_usage = ?');
    params.push(electricityUsage);
  }
  if (fuelConsumption !== undefined) {
    updates.push('fuel_consumption = ?');
    params.push(fuelConsumption);
  }
  if (methaneEmissions !== undefined) {
    updates.push('methane_emissions = ?');
    params.push(methaneEmissions);
  }
  if (totalEmissions !== undefined) {
    updates.push('total_emissions = ?');
    params.push(totalEmissions);
  }

  if (updates.length === 0) {
    console.log('❌ Failed to update: No fields to update');
    return res.status(400).json({ error: 'At least one field is required for update' });
  }

  const query = `UPDATE emissions SET ${updates.join(', ')} WHERE id = ?`;
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
