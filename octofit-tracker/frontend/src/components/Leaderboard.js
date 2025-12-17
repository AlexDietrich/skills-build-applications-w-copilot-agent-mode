import React, { useCallback, useEffect, useState } from 'react';
import DataTableCard from './DataTableCard';

const getEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const codespaceEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : null;
  return codespaceEndpoint || 'http://localhost:8000/api/leaderboard/';
};

const normalizePayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const leaderboardSummary = (entry) => {
  const details = [
    (entry.rank || entry.position) && `Rank: ${entry.rank ?? entry.position}`,
    (entry.points || entry.score) && `Score: ${entry.points ?? entry.score}`,
    entry.team?.name && `Team: ${entry.team.name}`,
    entry.user?.name && `User: ${entry.user.name}`,
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

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    const endpoint = getEndpoint();
    console.log('Leaderboard endpoint:', endpoint);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log('Leaderboard data:', data);
      setEntries(normalizePayload(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <DataTableCard
      title="Leaderboard"
      entityLabel="Leaderboard entries"
      data={entries}
      loading={loading}
      error={error}
      emptyMessage="No leaderboard entries."
      onRefresh={fetchLeaderboard}
      getPrimary={(entry, index) => entry.team?.name || entry.team || entry.name || `Entry ${index + 1}`}
      getSummary={leaderboardSummary}
    />
  );
}

export default Leaderboard;
