import { useEffect, useState } from 'react';
import { Card, Button, Alert, Space, Typography, Divider } from 'antd';
import apiService from '../services/apiService';

const { Text, Title } = Typography;

/**
 * Diagnostic component to test API connectivity
 * Add this to your dashboard or any page to diagnose API issues
 */
export default function ApiDiagnostic() {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, status, message, details = null) => {
    setResults(prev => [...prev, { test, status, message, details, timestamp: new Date().toISOString() }]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setTesting(true);

    // Test 1: Check environment variables
    addResult(
      'Environment Variables',
      apiService.apiUrl ? 'success' : 'error',
      apiService.apiUrl ? `API URL: ${apiService.apiUrl}` : 'API URL not configured',
      { apiUrl: apiService.apiUrl }
    );

    // Test 2: Simple GET request
    try {
      const response = await fetch(`${apiService.apiUrl}/api/health`);
      const data = await response.json();
      addResult(
        'Direct Fetch Test',
        response.ok ? 'success' : 'error',
        response.ok ? 'API server is reachable' : `HTTP ${response.status}`,
        { status: response.status, data }
      );
    } catch (error) {
      addResult(
        'Direct Fetch Test',
        'error',
        'Failed to reach API server',
        { error: error.message, code: error.code }
      );
    }

    // Test 3: Axios GET request through apiService
    try {
      const response = await apiService.get('/api/health');
      addResult(
        'ApiService GET Test',
        'success',
        'ApiService is working correctly',
        { data: response.data }
      );
    } catch (error) {
      addResult(
        'ApiService GET Test',
        'error',
        error.userMessage || error.message || 'Unknown error',
        {
          code: error.code,
          status: error.response?.status,
          message: error.message,
          responseData: error.response?.data
        }
      );
    }

    // Test 4: Check localStorage token
    try {
      const token = localStorage.getItem('token');
      addResult(
        'Token Check',
        token ? 'success' : 'warning',
        token ? 'Token exists in localStorage' : 'No token found',
        { hasToken: !!token, tokenLength: token?.length }
      );
    } catch (error) {
      addResult(
        'Token Check',
        'error',
        'Failed to access localStorage',
        { error: error.message }
      );
    }

    // Test 5: Test authenticated endpoint (if token exists)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await apiService.get('/business/types');
        addResult(
          'Authenticated Request Test',
          'success',
          'Authenticated requests working',
          { dataLength: response.data?.length }
        );
      } catch (error) {
        addResult(
          'Authenticated Request Test',
          'error',
          error.userMessage || error.message || 'Authentication failed',
          {
            code: error.code,
            status: error.response?.status,
            message: error.message
          }
        );
      }
    }

    setTesting(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <Card title="API Diagnostic Tool" style={{ margin: 20 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Button type="primary" onClick={runDiagnostics} loading={testing}>
          Run Diagnostics Again
        </Button>

        <Divider />

        {results.map((result, index) => (
          <Alert
            key={index}
            type={result.status}
            message={<Text strong>{result.test}</Text>}
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>{result.message}</Text>
                {result.details && (
                  <pre style={{
                    background: '#f5f5f5',
                    padding: 10,
                    borderRadius: 4,
                    fontSize: 12,
                    overflow: 'auto',
                    maxHeight: 200
                  }}>
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </Space>
            }
            showIcon
          />
        ))}

        {results.length === 0 && !testing && (
          <Alert
            type="info"
            message="Click 'Run Diagnostics' to test API connectivity"
            showIcon
          />
        )}
      </Space>
    </Card>
  );
}
