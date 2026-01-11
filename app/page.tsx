import Layout from './components/Layout'
import Card from './components/Card'
import StatusBadge from './components/StatusBadge'

export default function Dashboard() {
  // This would be populated from API calls in a real implementation
  const stats = [
    { label: 'New Enquiries', value: '12', change: '+3', color: 'text-blue-600' },
    { label: 'Confirmed Bookings', value: '8', change: '+2', color: 'text-green-600' },
    { label: 'Pending Quotes', value: '5', change: '-1', color: 'text-yellow-600' },
    { label: 'Overdue Invoices', value: '3', change: '-2', color: 'text-red-600' },
  ]

  const upcomingBookings = [
    { id: '1', title: 'Wedding - Smith & Jones', date: '2024-01-15', time: '18:00', status: 'CONFIRMED' },
    { id: '2', title: 'Corporate Event - ABC Ltd', date: '2024-01-18', time: '19:00', status: 'CONFIRMED' },
    { id: '3', title: 'Birthday Party - Private', date: '2024-01-20', time: '17:00', status: 'PENDING' },
  ]

  const recentEnquiries = [
    { id: '1', company: 'XYZ Events', subject: 'Wedding entertainment enquiry', status: 'NEW', date: '2024-01-10' },
    { id: '2', company: 'Private Client', subject: '50th birthday party', status: 'CONTACTED', date: '2024-01-09' },
    { id: '3', company: 'Corporate Ltd', subject: 'Annual company party', status: 'QUOTED', date: '2024-01-08' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${stat.color}`}>{stat.change}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Upcoming bookings and recent enquiries */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Bookings */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{booking.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(booking.date).toLocaleDateString('en-GB', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })} at {booking.time}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
            <a href="/bookings" className="block mt-4 text-sm text-primary-600 hover:text-primary-700">
              View all bookings →
            </a>
          </Card>

          {/* Recent Enquiries */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Enquiries</h2>
            <div className="space-y-4">
              {recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{enquiry.subject}</p>
                      <p className="text-sm text-gray-500 mt-1">{enquiry.company}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(enquiry.date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <StatusBadge status={enquiry.status} />
                  </div>
                </div>
              ))}
            </div>
            <a href="/enquiries" className="block mt-4 text-sm text-primary-600 hover:text-primary-700">
              View all enquiries →
            </a>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
