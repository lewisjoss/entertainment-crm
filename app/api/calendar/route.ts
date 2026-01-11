import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/calendar - Get calendar events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const eventType = searchParams.get('eventType')

    const where: any = {
      deletedAt: null,
    }

    if (startDate || endDate) {
      where.OR = [
        {
          startDateTime: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
        {
          endDateTime: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
        {
          AND: [
            {
              startDateTime: {
                lte: startDate ? new Date(startDate) : undefined,
              },
            },
            {
              endDateTime: {
                gte: endDate ? new Date(endDate) : undefined,
              },
            },
          ],
        },
      ]
    }

    if (eventType) where.eventType = eventType

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        booking: {
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
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
    })

    return NextResponse.json({ data: events })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
}
