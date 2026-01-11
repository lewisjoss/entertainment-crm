import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const isCompleted = searchParams.get('isCompleted')
    const dueDate = searchParams.get('dueDate')

    const where: any = {
      deletedAt: null,
    }

    if (userId) where.userId = userId
    if (isCompleted !== null) {
      where.isCompleted = isCompleted === 'true'
    }
    if (dueDate) {
      const date = new Date(dueDate)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0))
      const endOfDay = new Date(date.setHours(23, 59, 59, 999))
      where.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        enquiry: {
          select: {
            id: true,
            subject: true,
          },
        },
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            title: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { isCompleted: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' },
      ],
    })

    return NextResponse.json({ data: tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const task = await prisma.task.create({
      data: {
        enquiryId: body.enquiryId,
        bookingId: body.bookingId,
        userId: body.userId,
        title: body.title,
        description: body.description,
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
      include: {
        enquiry: true,
        booking: true,
        assignedTo: true,
      },
    })

    // TODO: Create audit log entry
    // TODO: Trigger automation rules (TASK_CREATED)

    return NextResponse.json({ data: task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
