import React, { useCallback, useEffect, useState } from 'react';
import DataTableCard from './DataTableCard';

const getEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const codespaceEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : null;
  return codespaceEndpoint || 'http://localhost:8000/api/workouts/';
};

const normalizePayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const workoutSummary = (workout) => {
  const details = [
    (workout.category || workout.type) && `Category: ${workout.category ?? workout.type}`,
    workout.duration && `Duration: ${workout.duration}`,
    workout.difficulty && `Difficulty: ${workout.difficulty}`,
    workout.equipment && `Equipment: ${workout.equipment}`,
  ].filter(Boolean);

  if (!details.length) return null;

  return (
    <div className="d-flex flex-wrap gap-2">
      {details.map((detail, idx) => (
        <span key={idx} className="badge text-bg-light border border-secondary">
          {detail}
        </span>
      ))}
    </div>
  );
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    const endpoint = getEndpoint();
    console.log('Workouts endpoint:', endpoint);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log('Workouts data:', data);
      setWorkouts(normalizePayload(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return (
    <DataTableCard
      title="Workouts"
      entityLabel="Workouts"
      data={workouts}
      loading={loading}
      error={error}
      emptyMessage="No workouts available."
      onRefresh={fetchWorkouts}
      getPrimary={(workout, index) => workout.title || workout.name || `Workout ${index + 1}`}
      getSummary={workoutSummary}
    />
  );
}

export default Workouts;
