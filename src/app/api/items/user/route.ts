import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { ItemStatus } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all items created by the user
    const userItems = await prisma.item.findMany({
      where: {
        userId: user.id,
        status: {
          notIn: [ItemStatus.REDEEMED, ItemStatus.SWAPPED] // Only get items that are available
        }
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(userItems);
  } catch (error) {
    console.error('Error fetching user items:', error);
    return NextResponse.json(
      { message: 'Error fetching user items' },
      { status: 500 }
    );
  }
} 