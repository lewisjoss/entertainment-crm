'use client'

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    // Enquiry statuses
    NEW: { color: 'bg-blue-100 text-blue-800', label: 'New' },
    CONTACTED: { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted' },
    QUOTED: { color: 'bg-purple-100 text-purple-800', label: 'Quoted' },
    NEGOTIATING: { color: 'bg-orange-100 text-orange-800', label: 'Negotiating' },
    WON: { color: 'bg-green-100 text-green-800', label: 'Won' },
    LOST: { color: 'bg-red-100 text-red-800', label: 'Lost' },
    ARCHIVED: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
    
    // Quote statuses
    DRAFT: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
    SENT: { color: 'bg-blue-100 text-blue-800', label: 'Sent' },
    ACCEPTED: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
    REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    EXPIRED: { color: 'bg-gray-100 text-gray-800', label: 'Expired' },
    CONVERTED: { color: 'bg-green-100 text-green-800', label: 'Converted' },
    
    // Booking statuses
    PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    CONFIRMED: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
    IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
    COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    NO_SHOW: { color: 'bg-red-100 text-red-800', label: 'No Show' },
    
    // Invoice statuses
    PARTIAL: { color: 'bg-yellow-100 text-yellow-800', label: 'Partial' },
    PAID: { color: 'bg-green-100 text-green-800', label: 'Paid' },
    OVERDUE: { color: 'bg-red-100 text-red-800', label: 'Overdue' },
    WRITTEN_OFF: { color: 'bg-gray-100 text-gray-800', label: 'Written Off' },
    
    // Contract statuses
    SIGNED: { color: 'bg-green-100 text-green-800', label: 'Signed' },
  }
  
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  )
}
