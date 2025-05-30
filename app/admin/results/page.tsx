"use client"

import { TestResultsViewer } from "@/components/admin/test-results-viewer"

export default function AdminResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Results Management</h1>
              <p className="text-gray-600 mt-1">View, analyze, and export test results</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <TestResultsViewer />
      </div>
    </div>
  )
}
