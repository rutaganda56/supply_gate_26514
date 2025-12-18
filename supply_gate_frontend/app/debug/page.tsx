"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { verificationApi, VerificationResponseDto } from "@/app/lib/api";
import { useSession } from "@/app/lib/auth-utils";
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Trash2, Bug, Eye } from "lucide-react";

export default function DebugPage() {
  const { userId, hasRole, loading: authLoading, userType } = useSession('INDUSTRY_WORKER');
  const [verifications, setVerifications] = useState<VerificationResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    action: string;
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    // Load error logs from localStorage
    try {
      const logs = JSON.parse(localStorage.getItem('api_error_log') || '[]');
      setErrorLogs(logs);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load error logs:', e);
    }

    // Load debug mode state
    setDebugMode(localStorage.getItem('debug_mode') === 'true');
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await verificationApi.getAll(0, 100); // Get first 100 for debug page
      const pending = data.content.filter(v => v.status === 'PENDING');
      setVerifications(pending);
    } catch (err: any) {
      setError(err.message || 'Failed to load verifications');
      // eslint-disable-next-line no-console
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testApprove = async (verificationId: string) => {
    if (!userId) {
      setTestResult({
        action: 'APPROVE',
        success: false,
        message: 'User ID not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await verificationApi.review(verificationId, {
        status: 'APPROVED',
        reviewedBy: userId,
      });
      
      setTestResult({
        action: 'APPROVE',
        success: true,
        message: 'Approval successful!',
        timestamp: new Date().toISOString()
      });
      
      // Reload verifications
      await loadVerifications();
    } catch (err: any) {
      const errorMsg = err.message || 'Approval failed';
      setTestResult({
        action: 'APPROVE',
        success: false,
        message: errorMsg,
        timestamp: new Date().toISOString()
      });
      setError(errorMsg);
      // eslint-disable-next-line no-console
      console.error('Approve error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testReject = async (verificationId: string) => {
    if (!userId) {
      setTestResult({
        action: 'REJECT',
        success: false,
        message: 'User ID not found',
        timestamp: new Date().toISOString()
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await verificationApi.review(verificationId, {
        status: 'REJECTED',
        rejectionReason: 'Test rejection from debug page',
        reviewedBy: userId,
      });
      
      setTestResult({
        action: 'REJECT',
        success: true,
        message: 'Rejection successful!',
        timestamp: new Date().toISOString()
      });
      
      // Reload verifications
      await loadVerifications();
    } catch (err: any) {
      const errorMsg = err.message || 'Rejection failed';
      setTestResult({
        action: 'REJECT',
        success: false,
        message: errorMsg,
        timestamp: new Date().toISOString()
      });
      setError(errorMsg);
      // eslint-disable-next-line no-console
      console.error('Reject error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDebugMode = () => {
    const newMode = !debugMode;
    setDebugMode(newMode);
    localStorage.setItem('debug_mode', newMode.toString());
    // eslint-disable-next-line no-console
    console.log(`Debug mode ${newMode ? 'ENABLED' : 'DISABLED'}`);
  };

  const clearErrorLogs = () => {
    localStorage.removeItem('api_error_log');
    setErrorLogs([]);
  };

  const refreshErrorLogs = () => {
    try {
      const logs = JSON.parse(localStorage.getItem('api_error_log') || '[]');
      setErrorLogs(logs);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to refresh error logs:', e);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1a3a3a]" />
          <p>Loading debug page...</p>
        </div>
      </div>
    );
  }

  if (!hasRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              This debug page is only accessible to INDUSTRY_WORKER users.
              <br />
              Current role: {userType || 'UNKNOWN'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Debug & Test Page</h1>
        <p className="text-gray-600">Test industry user approval/rejection functionality</p>
      </div>

      {/* Debug Mode Toggle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug Mode
          </CardTitle>
          <CardDescription>
            When enabled, tokens are preserved even on errors (prevents automatic logout)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleDebugMode}
              variant={debugMode ? "default" : "outline"}
              className={debugMode ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {debugMode ? "Debug Mode: ON" : "Debug Mode: OFF"}
            </Button>
            <span className="text-sm text-gray-600">
              {debugMode ? "✓ Tokens will be preserved on errors" : "Tokens will be cleared on errors"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>User ID:</strong> {userId || 'Not available'}
            </div>
            <div>
              <strong>User Type:</strong> {userType || 'Not available'}
            </div>
            <div>
              <strong>Has Role:</strong> {hasRole ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Debug Mode:</strong> {debugMode ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error Logs (Persistent)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={refreshErrorLogs}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" variant="outline" onClick={clearErrorLogs}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            These errors persist even after logout. Check here if you get logged out unexpectedly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No errors logged</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {errorLogs.slice().reverse().map((log, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-red-800">[{log.type}]</span>
                    <span className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-red-700 mb-1">{log.message}</div>
                  {log.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-red-600 text-xs">Show details</summary>
                      <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResult && (
        <Card className={`mb-6 ${testResult.success ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              Last Test Result: {testResult.action}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-semibold">{testResult.message}</p>
              <p className="text-xs mt-2">Time: {new Date(testResult.timestamp).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Test Approval/Rejection</CardTitle>
          <CardDescription>
            Load pending verifications and test approve/reject functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={loadVerifications} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Load Pending Verifications
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {loading && verifications.length === 0 && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1a3a3a]" />
              <p>Loading verifications...</p>
            </div>
          )}

          {verifications.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-4">No pending verifications found. Click "Load Pending Verifications" to fetch them.</p>
          )}

          {verifications.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Pending Verifications ({verifications.length})</h3>
              {verifications.map((v) => (
                <Card key={v.verificationId} className="border">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{v.supplierName}</p>
                        <p className="text-sm text-gray-600">{v.email}</p>
                        <p className="text-xs text-gray-500">ID: {v.verificationId}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => testApprove(v.verificationId!)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Test Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testReject(v.verificationId!)}
                          disabled={loading}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Test Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}





