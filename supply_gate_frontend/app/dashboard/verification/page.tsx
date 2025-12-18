"use client"

import type React from "react"

import { Sidebar } from "@/app/components/sidebar"
import { Calendar, Upload, AlertCircle, XCircle, CheckCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { VerificationDialog } from "@/app/components/verification-dialog"
import { verificationApi } from "@/app/lib/api"

type VerificationStatus = {
  status: "pending" | "approved" | "rejected" | "not_submitted";
  rejectionReason?: string;
  submittedDate?: string;
}

export default function VerificationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    status: "not_submitted"
  })
  const [loading, setLoading] = useState(true);

  // Load verification status from API
  const loadVerificationStatus = async () => {
    setLoading(true);
    try {
      const verification = await verificationApi.getMyVerification();
      
      if (verification) {
        // Map backend status to frontend status
        let status: "pending" | "approved" | "rejected" | "not_submitted" = "not_submitted";
        if (verification.status === "PENDING") {
          status = "pending";
        } else if (verification.status === "APPROVED") {
          status = "approved";
        } else if (verification.status === "REJECTED") {
          status = "rejected";
        }
        
        const newStatus: VerificationStatus = {
          status,
          rejectionReason: verification.rejectionReason || undefined,
          submittedDate: verification.submittedDate ? new Date(verification.submittedDate).toLocaleDateString() : undefined,
        };
        
        setVerificationStatus(newStatus);
      } else {
        // No verification found
        setVerificationStatus({ status: "not_submitted" });
      }
    } catch (err: any) {
      // If 404, no verification exists yet
      if (err.response?.status === 404) {
        setVerificationStatus({ status: "not_submitted" });
      } else {
        console.error("Failed to load verification status:", err);
        // Keep existing status on error
      }
    } finally {
      setLoading(false);
    }
  };

  // Load verification status on mount and set up polling for real-time updates
  useEffect(() => {
    loadVerificationStatus();
    
    // Poll every 10 seconds for status updates (real-time updates after review)
    const interval = setInterval(() => {
      loadVerificationStatus();
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (data: {
    companyName: string;
    businessLicense?: File;
    taxCertificate?: File;
    bankStatement?: File;
    identityProof?: File;
  }) => {
    try {
      // Submit verification documents to backend
      await verificationApi.submit({
        companyName: data.companyName,
        businessLicense: data.businessLicense,
        taxCertificate: data.taxCertificate,
        bankStatement: data.bankStatement,
        identityProof: data.identityProof,
      });
      
      // Reload verification status to get updated status from backend
      await loadVerificationStatus();
      
      setIsDialogOpen(false);
      alert(`Documents submitted for verification! Your status is now PENDING. You will be notified once reviewed.`);
    } catch (err: any) {
      console.error("Failed to submit verification:", err);
      alert(err.response?.data?.message || err.message || "Failed to submit verification documents. Please try again.");
    }
  }


  return (
    <div className="flex min-h-screen bg-gray-100 h-full">
      <Sidebar />

      <main className="flex-1 p-8 min-h-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Verification</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium">12, July 2025</span>
          </div>
        </div>

        {/* Rejection Alert Banner */}
        {verificationStatus.status === "rejected" && verificationStatus.rejectionReason && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">Verification Rejected</h3>
                <p className="text-sm text-red-700 mb-2">
                  Your verification request has been rejected. Please review the feedback below and resubmit your documents.
                </p>
                <Link href="#status-section" className="text-sm text-red-600 hover:text-red-800 font-medium underline">
                  View feedback details →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {verificationStatus.status === "rejected" ? "Resubmit Verification Documents" : "Submit Verification Documents"}
              </h2>
              <p className="text-sm text-gray-600">
                {verificationStatus.status === "rejected" 
                  ? "Please review the feedback below and upload corrected documents"
                  : "Upload your business documents to become a verified supplier"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            {verificationStatus.status === "rejected" ? "Resubmit Documents" : "Submit Documents"}
          </Button>
        </div>

        {/* Current Status Card */}
        <div id="status-section" className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Verification Status</h2>
          
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <p className="text-gray-600">Loading verification status...</p>
            </div>
          ) : (
            <>
              {verificationStatus.status === "not_submitted" && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <div>
                    <p className="font-medium text-gray-700">Not Submitted</p>
                    <p className="text-sm text-gray-500">Please submit your verification documents above</p>
                  </div>
                </div>
              )}

              {verificationStatus.status === "pending" && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="font-medium text-gray-700">Pending Review</p>
                    <p className="text-sm text-gray-500">
                      Your documents are being reviewed by our team
                      {verificationStatus.submittedDate && ` (Submitted: ${verificationStatus.submittedDate})`}
                    </p>
                  </div>
                </div>
              )}

              {verificationStatus.status === "approved" && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-700">Approved</p>
                    <p className="text-sm text-gray-500">Your verification has been approved!</p>
                  </div>
                </div>
              )}

              {verificationStatus.status === "rejected" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-700">Rejected</p>
                      <p className="text-sm text-gray-500">Your verification request was rejected</p>
                    </div>
                  </div>
                  
                  {verificationStatus.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-800 mb-1">Rejection Feedback</h3>
                          <p className="text-sm text-red-700 whitespace-pre-wrap">
                            {verificationStatus.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>Review the feedback above</li>
                      <li>Update or replace the documents that need correction</li>
                      <li>Resubmit your verification documents</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Verification Dialog */}
        <VerificationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          isResubmission={verificationStatus.status === "rejected"}
        />
      </main>
    </div>
  )
}
