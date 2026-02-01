'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
  updatedAt: string;
  emailFrequency: string;
  unsubscribeReason: string | null;
  unsubscribedAt: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SubscribersClientProps {
  initialAuth?: boolean;
}

export default function SubscribersClient({ initialAuth = false }: SubscribersClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all_frequencies');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedSubscriber, setExpandedSubscriber] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (frequencyFilter !== 'all_frequencies') params.set('frequency', frequencyFilter);
      if (searchQuery) params.set('search', searchQuery);

      const response = await fetch(`/api/newsletter/subscribers?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSubscribers(data.subscribers);
        setPagination(data.pagination);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch subscribers' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to fetch subscribers' });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, frequencyFilter, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscribers();
    }
  }, [isAuthenticated, fetchSubscribers]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        const data = await response.json();
        setAuthError(data.error || 'Invalid password');
      }
    } catch {
      setAuthError('Login failed. Please try again.');
    }
  };

  const toggleSubscriberStatus = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/newsletter/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, active: !currentActive } : s))
        );
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update subscriber' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update subscriber' });
    }
  };

  const deleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/newsletter/subscribers?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        if (pagination) {
          setPagination({ ...pagination, total: pagination.total - 1 });
        }
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete subscriber' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete subscriber' });
    }
  };

  const exportSubscribers = async () => {
    try {
      const params = new URLSearchParams({ limit: '10000' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (frequencyFilter !== 'all_frequencies') params.set('frequency', frequencyFilter);

      const response = await fetch(`/api/newsletter/subscribers?${params}`);
      const data = await response.json();

      if (response.ok) {
        const csv = [
          'Email,Subscribed At,Active,Frequency,Unsubscribe Reason,Unsubscribed At,Updated At',
          ...data.subscribers.map((s: Subscriber) =>
            `${s.email},${s.subscribedAt},${s.active},${s.emailFrequency},${s.unsubscribeReason || ''},${s.unsubscribedAt || ''},${s.updatedAt}`
          ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to export subscribers' });
    }
  };

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-surface-primary p-8 rounded-lg shadow-md max-w-md w-full border border-border-primary">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Admin Login</h1>
          <form onSubmit={handleAuth}>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border-primary rounded-md bg-background-secondary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
              placeholder="Enter admin password"
              autoFocus
            />
            {authError && <p className="mt-2 text-sm text-status-error">{authError}</p>}
            <button
              type="submit"
              className="mt-4 w-full bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main interface
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Subscribers</h1>
            <p className="text-text-secondary mt-1">
              Manage newsletter subscribers
              {pagination && (
                <span className="ml-2 text-text-tertiary">
                  ({pagination.total} total)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={exportSubscribers}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </header>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === 'success'
                ? 'bg-status-success/10 text-status-success'
                : 'bg-status-error/10 text-status-error'
            }`}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="float-right font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchSubscribers(1)}
                className="w-full px-4 py-2 border border-border-primary rounded-md bg-background-secondary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border-primary rounded-md bg-background-secondary text-text-primary focus:ring-2 focus:ring-accent-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="px-4 py-2 border border-border-primary rounded-md bg-background-secondary text-text-primary focus:ring-2 focus:ring-accent-primary"
            >
              <option value="all_frequencies">All Frequencies</option>
              <option value="all">Daily + Weekly</option>
              <option value="weekly">Weekly Only</option>
              <option value="none">Unsubscribed</option>
            </select>
            <button
              onClick={() => fetchSubscribers(1)}
              className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-surface-primary rounded-lg shadow-sm border border-border-primary overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-text-tertiary">Loading subscribers...</div>
          ) : subscribers.length === 0 ? (
            <div className="p-8 text-center text-text-tertiary">No subscribers found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-border-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-secondary">
                {subscribers.map((subscriber) => (
                  <React.Fragment key={subscriber.id}>
                    <tr className="hover:bg-background-secondary/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        <div className="flex items-center gap-2">
                          {subscriber.email}
                          {subscriber.unsubscribeReason && (
                            <button
                              onClick={() => setExpandedSubscriber(
                                expandedSubscriber === subscriber.id ? null : subscriber.id
                              )}
                              className="text-text-tertiary hover:text-text-secondary"
                              title="View unsubscribe reason"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            subscriber.active
                              ? 'bg-status-success/20 text-status-success'
                              : 'bg-status-error/20 text-status-error'
                          }`}
                        >
                          {subscriber.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            subscriber.emailFrequency === 'all'
                              ? 'bg-accent-primary/20 text-accent-primary'
                              : subscriber.emailFrequency === 'weekly'
                              ? 'bg-status-warning/20 text-status-warning'
                              : 'bg-text-tertiary/20 text-text-tertiary'
                          }`}
                        >
                          {subscriber.emailFrequency === 'all'
                            ? 'All'
                            : subscriber.emailFrequency === 'weekly'
                            ? 'Weekly'
                            : 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => toggleSubscriberStatus(subscriber.id, subscriber.active)}
                          className={`px-3 py-1 rounded text-xs font-medium mr-2 ${
                            subscriber.active
                              ? 'bg-status-warning/20 text-status-warning hover:bg-status-warning/30'
                              : 'bg-status-success/20 text-status-success hover:bg-status-success/30'
                          }`}
                        >
                          {subscriber.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(subscriber.id, subscriber.email)}
                          className="px-3 py-1 rounded text-xs font-medium bg-status-error/20 text-status-error hover:bg-status-error/30"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedSubscriber === subscriber.id && subscriber.unsubscribeReason && (
                      <tr className="bg-background-secondary/30">
                        <td colSpan={5} className="px-6 py-3 text-sm">
                          <div className="flex gap-6">
                            <div>
                              <span className="text-text-tertiary">Unsubscribe reason:</span>{' '}
                              <span className="text-text-secondary">{subscriber.unsubscribeReason}</span>
                            </div>
                            {subscriber.unsubscribedAt && (
                              <div>
                                <span className="text-text-tertiary">Unsubscribed at:</span>{' '}
                                <span className="text-text-secondary">
                                  {new Date(subscriber.unsubscribedAt).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-background-secondary border-t border-border-primary flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} subscribers
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchSubscribers(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded border border-border-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-tertiary"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-text-secondary">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchSubscribers(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 rounded border border-border-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-tertiary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
