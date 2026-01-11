import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const companyId = searchParams.get('companyId')
    const overdue = searchParams.get('overdue') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      deletedAt: null,
    }

    if (status) where.status = status
    if (companyId) where.companyId = companyId
    if (overdue) {
      where.status = { in: ['SENT', 'PARTIAL'] }
      where.dueDate = { lt: new Date() }
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
          booking: {
            select: {
              id: true,
              bookingNumber: true,
              title: true,
            },
          },
          lineItems: true,
          payments: {
            where: { status: 'COMPLETED', deletedAt: null },
          },
          _count: {
            select: {
              payments: true,
            },
          },
        },
        orderBy: {
          invoiceDate: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ])

    return NextResponse.json({
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate invoice number
    const invoiceCount = await prisma.invoice.count()
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`

    // Calculate totals
    const lineItems = body.lineItems || []
    const subtotal = lineItems.reduce(
      (sum: number, item: any) => sum + Number(item.total || 0),
      0
    )
    const vatRate = body.vatRate || 0.2
    const vatAmount = subtotal * vatRate
    const total = subtotal + vatAmount

    const invoice = await prisma.invoice.create({
      data: {
        bookingId: body.bookingId,
        quoteId: body.quoteId,
        companyId: body.companyId,
        contactId: body.contactId,
        userId: body.userId,
        invoiceNumber,
        title: body.title,
        description: body.description,
        invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),
        dueDate: new Date(body.dueDate),
        subtotal,
        vatRate,
        vatAmount,
        total,
        amountDue: total,
        currency: body.currency || 'GBP',
        status: body.status || 'DRAFT',
        paymentTerms: body.paymentTerms,
        paymentMethod: body.paymentMethod,
        bankDetails: body.bankDetails,
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
        booking: true,
        lineItems: true,
      },
    })

    // TODO: Create audit log entry
    // TODO: Trigger automation rules (INVOICE_CREATED)

    return NextResponse.json({ data: invoice }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
