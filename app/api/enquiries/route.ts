import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/enquiries - List all enquiries with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const companyId = searchParams.get('companyId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      deletedAt: null,
    }

    if (status) where.status = status
    if (userId) where.userId = userId
    if (companyId) where.companyId = companyId

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
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
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              quotes: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.enquiry.count({ where }),
    ])

    return NextResponse.json({
      data: enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    )
  }
}

// POST /api/enquiries - Create new enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const enquiry = await prisma.enquiry.create({
      data: {
        companyId: body.companyId,
        contactId: body.contactId,
        userId: body.userId,
        subject: body.subject,
        description: body.description,
        enquiryType: body.enquiryType || 'WEDDING',
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventLocation: body.eventLocation,
        estimatedGuests: body.estimatedGuests,
        budget: body.budget,
        status: body.status || 'NEW',
        source: body.source,
        priority: body.priority || 'MEDIUM',
        tags: body.tags || [],
        customFields: body.customFields,
      },
      include: {
        company: true,
        contact: true,
        assignedTo: true,
      },
    })

    // TODO: Create audit log entry
    // TODO: Trigger automation rules (ENQUIRY_CREATED)

    return NextResponse.json({ data: enquiry }, { status: 201 })
  } catch (error) {
    console.error('Error creating enquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    )
  }
}
