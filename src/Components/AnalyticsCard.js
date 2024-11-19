import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Cookies from 'js-cookie';

export default function AnalyticsCard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const userId = Cookies.get('user_id'); // Assuming 'user_id' is the cookie key
      if (!userId) {
        console.error('User ID not found in cookies');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/analytics/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Analytics</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Analytics</h3>
        <p>No data available</p>
      </div>
    );
  }

  // Chart Data
  const chartData = {
    labels: ['Transactions', 'Total Spent', 'Total Received'],
    datasets: [
      {
        label: 'Analytics Overview',
        data: [
          analytics.transaction_count,
          analytics.total_spent,
          analytics.total_received,
        ],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
        borderColor: ['#388E3C', '#F57C00', '#1976D2'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Analytics</h3>
      <div className="mb-4">
        <p><strong>Transactions:</strong> {analytics.transaction_count}</p>
        <p><strong>Total Spent:</strong> {analytics.total_spent.toFixed(2)}</p>
        <p><strong>Total Received:</strong> {analytics.total_received.toFixed(2)}</p>
      </div>
      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
