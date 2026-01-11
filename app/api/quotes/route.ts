import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/quotes - List all quotes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const companyId = searchParams.get('companyId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      deletedAt: null,
    }

    if (status) where.status = status
    if (companyId) where.companyId = companyId

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
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
            },
          },
          enquiry: {
            select: {
              id: true,
              subject: true,
            },
          },
          lineItems: true,
          _count: {
            select: {
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
      prisma.quote.count({ where }),
    ])

    return NextResponse.json({
      data: quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

// POST /api/quotes - Create new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate quote number
    const quoteCount = await prisma.quote.count()
    const quoteNumber = `QT-${new Date().getFullYear()}-${String(quoteCount + 1).padStart(5, '0')}`

    // Calculate totals
    const lineItems = body.lineItems || []
    const subtotal = lineItems.reduce(
      (sum: number, item: any) => sum + Number(item.total || 0),
      0
    )
    const vatRate = body.vatRate || 0.2
    const vatAmount = subtotal * vatRate
    const total = subtotal + vatAmount

    const quote = await prisma.quote.create({
      data: {
        enquiryId: body.enquiryId,
        companyId: body.companyId,
        contactId: body.contactId,
        userId: body.userId,
        quoteNumber,
        title: body.title,
        description: body.description,
        subtotal,
        vatRate,
        vatAmount,
        total,
        currency: body.currency || 'GBP',
        quoteDate: body.quoteDate ? new Date(body.quoteDate) : new Date(),
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventDuration: body.eventDuration,
        location: body.location,
        status: body.status || 'DRAFT',
        paymentTerms: body.paymentTerms,
        cancellationTerms: body.cancellationTerms,
        notes: body.notes,
        lineItems: {
          create: lineItems.map((item: any, index: number) => ({
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            vatRate: item.vatRate || vatRate,
            total: item.total,
            sortOrder: index,
          })),
        },
      },
      include: {
        company: true,
        contact: true,
        lineItems: true,
      },
    })

    // TODO: Create audit log entry
    // TODO: Update enquiry status to QUOTED
    // TODO: Trigger automation rules

    return NextResponse.json({ data: quote }, { status: 201 })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}
