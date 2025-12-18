"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { FileText, Upload, CheckCircle2, X, Building2, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface VerificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    companyName: string;
    businessLicense?: File;
    taxCertificate?: File;
    bankStatement?: File;
    identityProof?: File;
  }) => void;
  isResubmission?: boolean;
}

export function VerificationDialog({
  open,
  onClose,
  onSubmit,
  isResubmission = false,
}: VerificationDialogProps) {
  const [files, setFiles] = useState<{
    businessLicense?: File;
    taxCertificate?: File;
    bankStatement?: File;
    identityProof?: File;
  }>({});
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("");
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load company names when dialog opens
  useEffect(() => {
    if (open) {
      loadCompanyNames();
    }
  }, [open]);

  const loadCompanyNames = async () => {
    setLoadingCompanies(true);
    try {
      const response = await axios.get<string[]>(
        `${API_BASE_URL}/api/auth/companies`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setCompanyNames(response.data);
    } catch (error) {
      console.error("Failed to load company names:", error);
      alert("Failed to load companies. Please try again.");
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Filter companies based on search term
  const filteredCompanies = companyNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (
    type: keyof typeof files,
    file: File | undefined
  ) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if company is selected
    if (!selectedCompanyName || !selectedCompanyName.trim()) {
      alert("Please select a company/organization");
      return;
    }

    // Check if all required files are uploaded
    const requiredFiles = [
      "businessLicense",
      "taxCertificate",
      "bankStatement",
      "identityProof",
    ];
    const missingFiles = requiredFiles.filter(
      (file) => !files[file as keyof typeof files]
    );

    if (missingFiles.length > 0) {
      alert(
        `Please upload all required documents. Missing: ${missingFiles.join(", ")}`
      );
      return;
    }

    onSubmit({
      companyName: selectedCompanyName,
      ...files,
    });
    setFiles({});
    setSelectedCompanyName("");
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setFiles({});
    setSelectedCompanyName("");
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {isResubmission
              ? "Resubmit Verification Documents"
              : "Submit Verification Documents"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {isResubmission
              ? "Please review the feedback and upload corrected documents"
              : "Upload your business documents to become a verified supplier"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Company Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="companyName"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Building2 className="w-4 h-4 text-[#1a3a3a]" />
              Select Company/Organization <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300"
              />
              {loadingCompanies ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading companies...
                </div>
              ) : (
                <select
                  id="companyName"
                  value={selectedCompanyName}
                  onChange={(e) => setSelectedCompanyName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a3a3a] text-gray-700"
                >
                  <option value="">-- Select a company --</option>
                  {filteredCompanies.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
              {filteredCompanies.length === 0 && !loadingCompanies && searchTerm && (
                <p className="text-xs text-gray-500">No companies found matching "{searchTerm}"</p>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Select the company that will review your verification documents
            </p>
          </div>

          {/* Business License */}
          <div className="space-y-2">
            <Label
              htmlFor="businessLicense"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="w-4 h-4 text-[#1a3a3a]" />
              Business License <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="businessLicense"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(
                    "businessLicense",
                    e.target.files?.[0]
                  )
                }
                className="flex-1 border-gray-300"
              />
              {files.businessLicense && (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload your valid business license (PDF, JPG, PNG)
            </p>
          </div>

          {/* Tax Certificate */}
          <div className="space-y-2">
            <Label
              htmlFor="taxCertificate"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="w-4 h-4 text-[#1a3a3a]" />
              Tax Certificate <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="taxCertificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(
                    "taxCertificate",
                    e.target.files?.[0]
                  )
                }
                className="flex-1 border-gray-300"
              />
              {files.taxCertificate && (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload your tax registration certificate
            </p>
          </div>

          {/* Bank Statement */}
          <div className="space-y-2">
            <Label
              htmlFor="bankStatement"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="w-4 h-4 text-[#1a3a3a]" />
              Bank Statement <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="bankStatement"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange("bankStatement", e.target.files?.[0])
                }
                className="flex-1 border-gray-300"
              />
              {files.bankStatement && (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              Recent bank statement (last 3 months)
            </p>
          </div>

          {/* Identity Proof */}
          <div className="space-y-2">
            <Label
              htmlFor="identityProof"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="w-4 h-4 text-[#1a3a3a]" />
              Identity Proof <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="identityProof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange("identityProof", e.target.files?.[0])
                }
                className="flex-1 border-gray-300"
              />
              {files.identityProof && (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              Government-issued ID or passport
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white"
              disabled={
                !selectedCompanyName ||
                !files.businessLicense ||
                !files.taxCertificate ||
                !files.bankStatement ||
                !files.identityProof
              }
            >
              <Upload className="w-4 h-4 mr-2" />
              {isResubmission ? "Resubmit Documents" : "Submit for Verification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

