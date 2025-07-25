import { prisma } from '@/lib/prisma';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Filter, Search, Plus } from 'lucide-react';
import { CardCarousel } from '@/components/ui/carousel';

// Define categories for filtering
const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

async function getItems(category?: string) {
  try {
    const where = category && category !== 'All' 
      ? { category } 
      : {};
      
    const items = await prisma.item.findMany({
      include: {
        images: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category || 'All';
  const items = await getItems(category === 'All' ? undefined : category);
  const featured = items.filter((item) => item.isFeatured == true);
  
  const images = featured.map(item => ({
    src: item.images[0]?.imageUrl || '/images/placeholder.jpg',
    alt: item.title
  }));

  // Fallback images if no featured items
  if (images.length === 0) {
    images.push(
      { src: "/card/1.png", alt: "Image 1" },
      { src: "/card/2.png", alt: "Image 2" },
      { src: "/card/3.png", alt: "Image 3" }
    );
  }
  
  return (
    <div className="container py-6 px-20">

        <div className="mb-10">
          <h1 className='text-3xl font-semibold text-center mb-4'>Featured Collection</h1>
          <CardCarousel
          images={images}
          autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
          />
        </div>


      <div className=""><h1 className='text-3xl font-semibold mb-10'>Browse More </h1></div>
            {/* Active filters */}
      {category !== 'All' && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Filters:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {category}
            <Link href="/items" className="ml-1 hover:text-primary">
              ×
            </Link>
          </Badge>
        </div>
      )}

      {/* Items grid */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No items found</h2>
          <p className="text-muted-foreground mb-6">
            {category !== 'All'
              ? `No items found in the ${category} category.`
              : 'Be the first to add an item to our collection!'}
          </p>
          <Button asChild>
            <Link href="/add">Add Item</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.category}
              condition={item.condition}
              imageUrl={item.images.length > 0 ? item.images[0].imageUrl : '/images/placeholder.jpg'}
              userName={item.createdBy.name}
            />
          ))}
        </div>
      )}
    </div>
  );
} 