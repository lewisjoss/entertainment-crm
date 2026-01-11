import Layout from '../components/Layout'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'

export default function BookingsPage() {
  // This would be populated from API in real implementation
  const bookings = [
    {
      id: '1',
      bookingNumber: 'BK-2024-00001',
      title: 'Wedding - Smith & Jones',
      company: { name: 'XYZ Events' },
      contact: { firstName: 'Jane', lastName: 'Smith', phone: '+44 7700 900000' },
      eventDate: '2024-01-15',
      eventTime: '18:00',
      location: 'The Grand Hotel, London',
      status: 'CONFIRMED',
      agreedPrice: 2500,
      depositPaid: true,
    },
    {
      id: '2',
      bookingNumber: 'BK-2024-00002',
      title: 'Corporate Event - ABC Ltd',
      company: { name: 'Corporate Ltd' },
      contact: { firstName: 'Sarah', lastName: 'Johnson', phone: '+44 7700 900001' },
      eventDate: '2024-01-18',
      eventTime: '19:00',
      location: 'Business Centre, Manchester',
      status: 'CONFIRMED',
      agreedPrice: 1800,
      depositPaid: true,
    },
    {
      id: '3',
      bookingNumber: 'BK-2024-00003',
      title: 'Birthday Party - Private',
      company: { name: 'Private Client' },
      contact: { firstName: 'John', lastName: 'Doe', phone: '+44 7700 900002' },
      eventDate: '2024-01-20',
      eventTime: '17:00',
      location: 'Private Residence, Birmingham',
      status: 'PENDING',
      agreedPrice: 1200,
      depositPaid: false,
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your gigs and performances</p>
          </div>
          <Button>New Booking</Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="input">
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input type="text" placeholder="Search bookings..." className="input" />
            </div>
          </div>
        </Card>

        {/* Bookings list */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                    <StatusBadge status={booking.status} />
                    <span className="text-sm text-gray-500">#{booking.bookingNumber}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Company:</span> {booking.company.name}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span> {booking.contact.firstName} {booking.contact.lastName} - {booking.contact.phone}
                    </p>
                    <p>
                      <span className="font-medium">Date & Time:</span>{' '}
                      {new Date(booking.eventDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} at {booking.eventTime}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {booking.location}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span> £{booking.agreedPrice.toLocaleString()}
                      {booking.depositPaid && (
                        <span className="ml-2 text-green-600">✓ Deposit Paid</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="secondary" size="sm">View</Button>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
