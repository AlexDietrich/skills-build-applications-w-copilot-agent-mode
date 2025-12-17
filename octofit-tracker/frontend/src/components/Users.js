import React, { useCallback, useEffect, useState } from 'react';
import DataTableCard from './DataTableCard';

const getEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
  return `${baseUrl}/api/users/`;
};

const normalizePayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const userSummary = (user) => {
  const details = [
    user.email && `Email: ${user.email}`,
    user.team?.name && `Team: ${user.team.name}`,
    (user.role || user.title) && `Role: ${user.role ?? user.title}`,
    (user.joined || user.created_at) && `Joined: ${user.joined ?? user.created_at}`,
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

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    const endpoint = getEndpoint();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setUsers(normalizePayload(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <DataTableCard
      title="Users"
      entityLabel="Users"
      data={users}
      loading={loading}
      error={error}
      emptyMessage="No users found."
      onRefresh={fetchUsers}
      getPrimary={(user, index) => user.name || user.username || `User ${index + 1}`}
      getSummary={userSummary}
    />
  );
}

export default Users;
