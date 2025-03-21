import db from '../config/database.js';

export const createSink = (req, res) => {
  const {
    userId,
    projectName,
    location,
    forestArea,
    treeSpecies,
    treeDensity,
    forestAge,
    soilType,
    maintenanceLevel,
    annualSequestration,
    tenYearSequestration,
    thirtyYearSequestration,
    carbonDensity
  } = req.body;
  
  console.log('📝 New sink project request:', { userId, projectName });

  if (!userId || !projectName || !location) {
    console.log('❌ Failed to create sink: Missing required fields');
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const query = `
    INSERT INTO sinks (
      user_id, project_name, location, forest_area,
      tree_species, tree_density, forest_age, soil_type,
      maintenance_level, annual_sequestration,
      ten_year_sequestration, thirty_year_sequestration,
      carbon_density
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    userId,
    projectName,
    location,
    forestArea,
    treeSpecies,
    treeDensity,
    forestAge,
    soilType,
    maintenanceLevel,
    annualSequestration,
    tenYearSequestration,
    thirtyYearSequestration,
    carbonDensity
  ], function(err) {
    if (err) {
      console.error('❌ Error creating sink:', err.message);
      return res.status(500).json({ error: 'Error creating sink project' });
    }
    
    console.log('✅ Sink project created:', { id: this.lastID, projectName });
    res.status(201).json({
      message: 'Sink project created successfully',
      sinkId: this.lastID
    });
  });
};

export const getUserSinks = (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;
  
  console.log('🔍 Fetching sinks for user:', { userId, startDate, endDate });

  let query = `
    SELECT 
      id, user_id, project_name, location, forest_area,
      tree_species, tree_density, forest_age, soil_type,
      maintenance_level, annual_sequestration,
      ten_year_sequestration, thirty_year_sequestration,
      carbon_density, date
    FROM sinks 
    WHERE user_id = ?
  `;
  const params = [userId];

  if (startDate && endDate) {
    query += ' AND date BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  query += ' ORDER BY date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('❌ Error fetching sinks:', err.message);
      return res.status(500).json({ error: 'Error fetching sink projects' });
    }

    // Transform snake_case to camelCase for frontend
    const formattedRows = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      projectName: row.project_name,
      location: row.location,
      forestArea: row.forest_area,
      treeSpecies: row.tree_species,
      treeDensity: row.tree_density,
      forestAge: row.forest_age,
      soilType: row.soil_type,
      maintenanceLevel: row.maintenance_level,
      annualSequestration: row.annual_sequestration,
      tenYearSequestration: row.ten_year_sequestration,
      thirtyYearSequestration: row.thirty_year_sequestration,
      carbonDensity: row.carbon_density,
      date: row.date
    }));

    console.log(`✅ Found ${rows.length} sink projects`);
    res.json(formattedRows);
  });
};

export const updateSink = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  console.log('📝 Update sink request:', { id, updates });

  // Convert camelCase to snake_case for database
  const dbUpdates = [];
  const params = [];
  
  if (updates.projectName) {
    dbUpdates.push('project_name = ?');
    params.push(updates.projectName);
  }
  if (updates.location) {
    dbUpdates.push('location = ?');
    params.push(updates.location);
  }
  if (updates.forestArea !== undefined) {
    dbUpdates.push('forest_area = ?');
    params.push(updates.forestArea);
  }
  if (updates.treeSpecies) {
    dbUpdates.push('tree_species = ?');
    params.push(updates.treeSpecies);
  }
  if (updates.treeDensity !== undefined) {
    dbUpdates.push('tree_density = ?');
    params.push(updates.treeDensity);
  }
  if (updates.forestAge !== undefined) {
    dbUpdates.push('forest_age = ?');
    params.push(updates.forestAge);
  }
  if (updates.soilType) {
    dbUpdates.push('soil_type = ?');
    params.push(updates.soilType);
  }
  if (updates.maintenanceLevel) {
    dbUpdates.push('maintenance_level = ?');
    params.push(updates.maintenanceLevel);
  }
  if (updates.annualSequestration !== undefined) {
    dbUpdates.push('annual_sequestration = ?');
    params.push(updates.annualSequestration);
  }
  if (updates.tenYearSequestration !== undefined) {
    dbUpdates.push('ten_year_sequestration = ?');
    params.push(updates.tenYearSequestration);
  }
  if (updates.thirtyYearSequestration !== undefined) {
    dbUpdates.push('thirty_year_sequestration = ?');
    params.push(updates.thirtyYearSequestration);
  }
  if (updates.carbonDensity !== undefined) {
    dbUpdates.push('carbon_density = ?');
    params.push(updates.carbonDensity);
  }

  if (dbUpdates.length === 0) {
    console.log('❌ Failed to update: No fields to update');
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const query = `UPDATE sinks SET ${dbUpdates.join(', ')} WHERE id = ?`;
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      console.error('❌ Error updating sink:', err.message);
      return res.status(500).json({ error: 'Error updating sink project' });
    }
    
    if (this.changes === 0) {
      console.log('❌ No sink found with id:', id);
      return res.status(404).json({ error: 'Sink project not found' });
    }

    console.log('✅ Sink project updated:', { id });
    res.json({ message: 'Sink project updated successfully' });
  });
};

export const deleteSink = (req, res) => {
  const { id } = req.params;
  
  console.log('🗑️ Delete sink request:', { id });

  db.run('DELETE FROM sinks WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('❌ Error deleting sink:', err.message);
      return res.status(500).json({ error: 'Error deleting sink project' });
    }

    if (this.changes === 0) {
      console.log('❌ No sink found with id:', id);
      return res.status(404).json({ error: 'Sink project not found' });
    }

    console.log('✅ Sink project deleted:', { id });
    res.json({ message: 'Sink project deleted successfully' });
  });
};
