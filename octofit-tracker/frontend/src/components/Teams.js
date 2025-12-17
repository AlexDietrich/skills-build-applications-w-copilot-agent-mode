import React, { useCallback, useEffect, useState } from 'react';
import DataTableCard from './DataTableCard';

const getEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const codespaceEndpoint = codespaceName ? `https://${codespaceName}-8000.app.github.dev/api/teams/` : null;
  return codespaceEndpoint || 'http://localhost:8000/api/teams/';
};

const normalizePayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const teamSummary = (team) => {
  const memberCount = team.members?.length || team.member_count;
  const details = [
    memberCount !== undefined && `Members: ${memberCount}`,
    team.captain && (team.captain.name || team.captain.username) && `Captain: ${team.captain.name ?? team.captain.username}`,
    team.city && `City: ${team.city}`,
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

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    const endpoint = getEndpoint();
    console.log('Teams endpoint:', endpoint);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log('Teams data:', data);
      setTeams(normalizePayload(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <DataTableCard
      title="Teams"
      entityLabel="Teams"
      data={teams}
      loading={loading}
      error={error}
      emptyMessage="No teams available."
      onRefresh={fetchTeams}
      getPrimary={(team, index) => team.name || `Team ${index + 1}`}
      getSummary={teamSummary}
    />
  );
}

export default Teams;
