import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/contracts - List all contracts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const bookingId = searchParams.get('bookingId')

    const where: any = {
      deletedAt: null,
    }

    if (status) where.status = status
    if (bookingId) where.bookingId = bookingId

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        booking: {
          include: {
            company: true,
            contact: true,
          },
        },
        company: true,
        contact: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ data: contracts })
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}

// POST /api/contracts - Create new contract
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate contract number
    const contractCount = await prisma.contract.count()
    const contractNumber = `CON-${new Date().getFullYear()}-${String(contractCount + 1).padStart(5, '0')}`

    const contract = await prisma.contract.create({
      data: {
        bookingId: body.bookingId,
        companyId: body.companyId,
        contactId: body.contactId,
        contractNumber,
        title: body.title,
        content: body.content,
        templateId: body.templateId,
        status: body.status || 'DRAFT',
      },
      include: {
        booking: true,
        company: true,
        contact: true,
      },
    })

    // TODO: Create audit log entry
    // TODO: Generate PDF

    return NextResponse.json({ data: contract }, { status: 201 })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    )
  }
}
