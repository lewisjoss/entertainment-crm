import Layout from '../components/Layout'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'

export default function CalendarPage() {
  // This would be populated from API in real implementation
  const events = [
    {
      id: '1',
      title: 'Wedding - Smith & Jones',
      startDateTime: '2024-01-15T18:00:00',
      endDateTime: '2024-01-15T23:00:00',
      location: 'The Grand Hotel, London',
      eventType: 'GIG',
      booking: { status: 'CONFIRMED' },
    },
    {
      id: '2',
      title: 'Corporate Event - ABC Ltd',
      startDateTime: '2024-01-18T19:00:00',
      endDateTime: '2024-01-18T23:30:00',
      location: 'Business Centre, Manchester',
      eventType: 'GIG',
      booking: { status: 'CONFIRMED' },
    },
    {
      id: '3',
      title: 'Rehearsal',
      startDateTime: '2024-01-17T14:00:00',
      endDateTime: '2024-01-17T16:00:00',
      location: 'Studio',
      eventType: 'REHEARSAL',
    },
  ]

  // Group events by date
  const eventsByDate: Record<string, typeof events> = {}
  events.forEach((event) => {
    const date = new Date(event.startDateTime).toLocaleDateString('en-GB')
    if (!eventsByDate[date]) {
      eventsByDate[date] = []
    }
    eventsByDate[date].push(event)
  })

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="mt-1 text-sm text-gray-500">View your upcoming gigs and events</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">Today</button>
            <button className="btn-secondary">Week</button>
            <button className="btn-primary">Month</button>
          </div>
        </div>

        {/* Calendar view */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar grid would go here in a real implementation */}
          <div className="lg:col-span-2">
            <Card>
              <div className="text-center py-8 text-gray-500">
                Calendar grid view would be implemented here with a calendar library
              </div>
            </Card>
          </div>

          {/* Upcoming events sidebar */}
          <div>
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {Object.entries(eventsByDate).map(([date, dateEvents]) => (
                  <div key={date}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      {new Date(date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </h3>
                    <div className="space-y-2">
                      {dateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border-l-4 border-primary-500 pl-3 py-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(event.startDateTime).toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {' - '}
                                {new Date(event.endDateTime).toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                              <p className="text-xs text-gray-500">{event.location}</p>
                            </div>
                            {event.booking && (
                              <StatusBadge status={event.booking.status} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
