import React, { useCallback, useEffect, useState } from 'react';
import DataTableCard from './DataTableCard';

const getEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
  return `${baseUrl}/api/activities/`;
};

const normalizePayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const activitySummary = (activity) => {
  const details = [
    activity.type && `Type: ${activity.type}`,
    activity.duration && `Duration: ${activity.duration}`,
    (activity.calories_burned || activity.calories) && `Calories: ${activity.calories_burned ?? activity.calories}`,
    (activity.date || activity.created_at) && `Date: ${activity.date ?? activity.created_at}`,
    activity.user && (activity.user.name || activity.user.username) && `User: ${activity.user.name ?? activity.user.username}`,
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

function Activities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    const endpoint = getEndpoint();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setItems(normalizePayload(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <DataTableCard
      title="Activities"
      entityLabel="Activities"
      data={items}
      loading={loading}
      error={error}
      emptyMessage="No activities available."
      onRefresh={fetchActivities}
      getPrimary={(activity) => activity.title || activity.name || activity.description || 'Activity'}
      getSummary={activitySummary}
    />
  );
}

export default Activities;
