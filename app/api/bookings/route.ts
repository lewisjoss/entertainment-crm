import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/bookings - List all bookings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const companyId = searchParams.get('companyId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      deletedAt: null,
    }

    if (status) where.status = status
    if (userId) where.userId = userId
    if (companyId) where.companyId = companyId
    if (startDate || endDate) {
      where.eventDate = {}
      if (startDate) where.eventDate.gte = new Date(startDate)
      if (endDate) where.eventDate.lte = new Date(endDate)
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          contract: {
            select: {
              id: true,
              status: true,
            },
          },
          _count: {
            select: {
              invoices: true,
            },
          },
        },
        orderBy: {
          eventDate: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ])

    return NextResponse.json({
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate booking number
    const bookingCount = await prisma.booking.count()
    const bookingNumber = `BK-${new Date().getFullYear()}-${String(bookingCount + 1).padStart(5, '0')}`

    const booking = await prisma.booking.create({
      data: {
        enquiryId: body.enquiryId,
        quoteId: body.quoteId,
        companyId: body.companyId,
        contactId: body.contactId,
        userId: body.userId,
        bookingNumber,
        title: body.title,
        eventDate: new Date(body.eventDate),
        eventTime: body.eventTime,
        eventDuration: body.eventDuration,
        setupTime: body.setupTime,
        location: body.location,
        locationDetails: body.locationDetails,
        postcode: body.postcode,
        serviceType: body.serviceType,
        specialRequests: body.specialRequests,
        requirements: body.requirements,
        status: body.status || 'CONFIRMED',
        agreedPrice: body.agreedPrice,
        depositAmount: body.depositAmount,
        depositPaid: body.depositPaid || false,
        balancePaid: body.balancePaid || false,
        confirmedAt: body.status === 'CONFIRMED' ? new Date() : null,
      },
      include: {
        company: true,
        contact: true,
        assignedTo: true,
        quote: true,
      },
    })

    // Create calendar event
    await prisma.calendarEvent.create({
      data: {
        bookingId: booking.id,
        title: booking.title,
        description: booking.specialRequests,
        eventType: 'GIG',
        startDateTime: booking.eventDate,
        endDateTime: new Date(
          new Date(booking.eventDate).getTime() + booking.eventDuration * 60000
        ),
        location: booking.location,
      },
    })

    // TODO: Create audit log entry
    // TODO: Trigger automation rules (BOOKING_CONFIRMED)

    return NextResponse.json({ data: booking }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
