"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import api from "@/app/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
import axios from "axios";

export function ConnectionTest() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing connection...");

    try {
      // Test 1: Direct axios call to location endpoint (no auth needed)
      const locationTest = await axios.get(`${API_BASE_URL}/api/location/getGovernmentStructures`);
      setStatus(`✅ Location endpoint: OK (Status ${locationTest.status})`);

      // Test 2: Check if token exists
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        setStatus(prev => prev + `\n✅ Token found: ${token.substring(0, 20)}...`);
      } else {
        setStatus(prev => prev + `\n⚠️ No token found - you may need to login`);
      }

      // Test 3: Test authenticated endpoint
      if (token) {
        try {
          // Check token expiration (basic check - decode JWT payload)
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const exp = payload.exp * 1000; // Convert to milliseconds
              const now = Date.now();
              const isExpired = exp < now;
              const timeLeft = Math.floor((exp - now) / 1000 / 60); // minutes
              
              if (isExpired) {
                setStatus(prev => prev + `\n⚠️ Token is EXPIRED (expired ${Math.abs(timeLeft)} minutes ago)`);
                setStatus(prev => prev + `\n💡 Solution: Please login again to get a new token`);
              } else {
                setStatus(prev => prev + `\n✅ Token is valid (expires in ${timeLeft} minutes)`);
              }
            }
          } catch (e) {
            setStatus(prev => prev + `\n⚠️ Could not parse token (may be invalid format)`);
          }
          
          const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
          if (userId) {
            try {
              const dashboardTest = await api.get(`/api/dashboard/supplier/${userId}`);
              setStatus(prev => prev + `\n✅ Dashboard endpoint: OK (Status ${dashboardTest.status})`);
            } catch (err: any) {
              setStatus(prev => prev + `\n❌ Dashboard endpoint failed: ${err.message || 'Unknown error'}`);
              if (err.status === 401) {
                setStatus(prev => prev + `\n💡 Token may be invalid or expired. Try logging in again.`);
              }
            }
          } else {
            setStatus(prev => prev + `\n⚠️ User ID not found - trying to fetch...`);
            try {
              // Verify token is being sent
              const tokenHeader = `Bearer ${token.substring(0, 20)}...`;
              setStatus(prev => prev + `\n🔍 Sending request with token: ${tokenHeader}`);
              
              const allUsers = await api.get('/api/auth/getAllUsers');
              setStatus(prev => prev + `\n✅ getAllUsers endpoint: OK (${allUsers.data.length} users found)`);
            } catch (err: any) {
              setStatus(prev => prev + `\n❌ getAllUsers failed: ${err.message || 'Unknown error'}`);
              if (err.status === 401) {
                setStatus(prev => prev + `\n💡 This usually means:`);
                setStatus(prev => prev + `\n   1. Token is expired (tokens last 30 minutes)`);
                setStatus(prev => prev + `\n   2. Server was restarted with a new secret key`);
                setStatus(prev => prev + `\n   3. Token signature is invalid`);
                setStatus(prev => prev + `\n💡 Solution: Please login again to get a fresh token`);
                
                // Check if we can see the actual error response
                if (err.response?.data) {
                  const errorData = typeof err.response.data === 'string' 
                    ? err.response.data 
                    : JSON.stringify(err.response.data);
                  setStatus(prev => prev + `\n📋 Server response: ${errorData.substring(0, 100)}`);
                }
              } else if (err.isNetworkError) {
                setStatus(prev => prev + `\n💡 Network error - check if backend is running`);
              }
            }
          }
        } catch (err: any) {
          setStatus(prev => prev + `\n❌ Authenticated endpoint failed: ${err.message || 'Unknown error'}`);
        }
      }

      setStatus(prev => prev + `\n\n✅ Connection test complete!`);
    } catch (error: any) {
      if (error.response) {
        setStatus(`❌ Server responded with error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        setStatus(`❌ No response from server. Possible causes:\n1. Spring Boot is not running\n2. Wrong port (expected: ${API_BASE_URL})\n3. CORS not configured\n\nTest in browser: ${API_BASE_URL}/api/location/getGovernmentStructures`);
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-semibold text-yellow-800 mb-2">Connection Diagnostic</h3>
      <Button
        onClick={testConnection}
        disabled={loading}
        className="mb-2 bg-yellow-600 hover:bg-yellow-700 text-white"
        size="sm"
      >
        {loading ? "Testing..." : "Test Backend Connection"}
      </Button>
      {status && (
        <pre className="text-xs bg-white p-3 rounded border border-yellow-200 overflow-auto max-h-48 whitespace-pre-wrap">
          {status}
        </pre>
      )}
    </div>
  );
}

