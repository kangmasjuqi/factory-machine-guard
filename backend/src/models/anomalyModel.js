const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.getAll = async () => {
  const { rows } = await pool.query('SELECT * FROM anomalies where suspected_reason is NULL ORDER BY timestamp DESC');
  return rows;
};

exports.getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM anomalies WHERE id = $1', [id]);
  return rows[0];
};

exports.create = async ({ timestamp, machine, anomaly_type, sensor, sound_clip }) => {
  const { rows } = await pool.query(
    `INSERT INTO anomalies (timestamp, machine, anomaly_type, sensor, sound_clip)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [timestamp, machine, anomaly_type, sensor, sound_clip]
  );
  return rows[0];
};

exports.update = async (id, { suspected_reason, action_required, comments }) => {
  const { rows } = await pool.query(
    `UPDATE anomalies SET
      suspected_reason = $1,
      action_required = $2,
      comments = $3,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 RETURNING *`,
    [suspected_reason, action_required, comments, id]
  );
  return rows[0];
};

exports.remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM anomalies WHERE id = $1', [id]);
  return rowCount > 0;
};
