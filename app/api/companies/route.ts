import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/companies - List all companies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      deletedAt: null,
    }

    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { companyNumber: { contains: search } },
      ]
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          _count: {
            select: {
              enquiries: true,
              bookings: true,
              invoices: true,
            },
          },
          contacts: {
            where: { deletedAt: null, isPrimary: true },
            take: 1,
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.company.count({ where }),
    ])

    return NextResponse.json({
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const company = await prisma.company.create({
      data: {
        name: body.name,
        companyNumber: body.companyNumber,
        vatNumber: body.vatNumber,
        website: body.website,
        industry: body.industry,
        size: body.size,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        county: body.county,
        postcode: body.postcode,
        country: body.country || 'GB',
        phone: body.phone,
        email: body.email,
        status: body.status || 'ACTIVE',
        tags: body.tags || [],
        notes: body.notes,
        rating: body.rating,
      },
    })

    // Create primary contact if provided
    if (body.contact) {
      const contact = await prisma.contact.create({
        data: {
          companyId: company.id,
          firstName: body.contact.firstName,
          lastName: body.contact.lastName,
          jobTitle: body.contact.jobTitle,
          email: body.contact.email,
          phone: body.contact.phone,
          mobile: body.contact.mobile,
          isPrimary: true,
        },
      })

      await prisma.company.update({
        where: { id: company.id },
        data: { primaryContactId: contact.id },
      })
    }

    // TODO: Create audit log entry

    return NextResponse.json({ data: company }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}
