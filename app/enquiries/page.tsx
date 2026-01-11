import Layout from '../components/Layout'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'

export default function EnquiriesPage() {
  // This would be populated from API in real implementation
  const enquiries = [
    {
      id: '1',
      subject: 'Wedding entertainment enquiry',
      company: { name: 'XYZ Events' },
      contact: { firstName: 'Jane', lastName: 'Smith' },
      status: 'NEW',
      priority: 'HIGH',
      eventDate: '2024-06-15',
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      subject: '50th birthday party',
      company: { name: 'Private Client' },
      contact: { firstName: 'John', lastName: 'Doe' },
      status: 'CONTACTED',
      priority: 'MEDIUM',
      eventDate: '2024-05-20',
      createdAt: '2024-01-09',
    },
    {
      id: '3',
      subject: 'Annual company party',
      company: { name: 'Corporate Ltd' },
      contact: { firstName: 'Sarah', lastName: 'Johnson' },
      status: 'QUOTED',
      priority: 'MEDIUM',
      eventDate: '2024-04-10',
      createdAt: '2024-01-08',
    },
  ]

  const priorityColors = {
    LOW: 'text-gray-500',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    URGENT: 'text-red-600',
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your pipeline and leads</p>
          </div>
          <Button>New Enquiry</Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="input">
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUOTED">Quoted</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select className="input">
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input type="text" placeholder="Search enquiries..." className="input" />
            </div>
          </div>
        </Card>

        {/* Enquiries list */}
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{enquiry.subject}</h3>
                    <StatusBadge status={enquiry.status} />
                    <span className={`text-sm font-medium ${priorityColors[enquiry.priority as keyof typeof priorityColors]}`}>
                      {enquiry.priority}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Company:</span> {enquiry.company.name}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span> {enquiry.contact.firstName} {enquiry.contact.lastName}
                    </p>
                    {enquiry.eventDate && (
                      <p>
                        <span className="font-medium">Event Date:</span>{' '}
                        {new Date(enquiry.eventDate).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Created: {new Date(enquiry.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="secondary" size="sm">View</Button>
                  <Button size="sm">Convert</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-3 of 12 enquiries</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
