import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
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

    const { title, description, category, size, condition, tags, images } = await req.json();

    // Create new item
    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        size,
        condition,
        tags,
        userId: user.id,
        status: 'PENDING',
        isFeatured: false,
      },
    });

    // Create item images
    if (images && images.length > 0) {
      for (const image of images) {
        await prisma.itemImage.create({
          data: {
            imageUrl: image.imageUrl,
            itemId: item.id,
          },
        });
      }
    }

    return NextResponse.json(
      { message: 'Item created successfully', item },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { message: 'Error creating item' },
      { status: 500 }
    );
  }
} 