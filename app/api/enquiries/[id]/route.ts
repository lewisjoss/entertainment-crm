import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/enquiries/[id] - Get single enquiry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        company: {
          include: {
            contacts: {
              where: { deletedAt: null },
            },
          },
        },
        contact: true,
        assignedTo: true,
        quotes: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          where: { deletedAt: null },
        },
        notes: {
          where: { deletedAt: null },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          where: { deletedAt: null, isCompleted: false },
          orderBy: { dueDate: 'asc' },
        },
      },
    })

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: enquiry })
  } catch (error) {
    console.error('Error fetching enquiry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enquiry' },
      { status: 500 }
    )
  }
}

// PATCH /api/enquiries/[id] - Update enquiry
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const oldEnquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
    })

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: {
        subject: body.subject,
        description: body.description,
        enquiryType: body.enquiryType,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        eventLocation: body.eventLocation,
        estimatedGuests: body.estimatedGuests,
        budget: body.budget,
        status: body.status,
        priority: body.priority,
        userId: body.userId,
        tags: body.tags,
        customFields: body.customFields,
      },
      include: {
        company: true,
        contact: true,
        assignedTo: true,
      },
    })

    // TODO: Create audit log entry
    // TODO: Trigger automation if status changed

    return NextResponse.json({ data: updatedEnquiry })
  } catch (error) {
    console.error('Error updating enquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    )
  }
}

// DELETE /api/enquiries/[id] - Soft delete enquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.enquiry.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
      },
    })

    // TODO: Create audit log entry

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting enquiry:', error)
    return NextResponse.json(
      { error: 'Failed to delete enquiry' },
      { status: 500 }
    )
  }
}
