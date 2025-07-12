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

// Define categories for filtering
const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

async function getItems(category?: string) {
  try {
    const where = category && category !== 'All' 
      ? { category } 
      : {};
      
    const items = await prisma.item.findMany({
      where,
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

  return (
    <div className="container py-6 px-30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Items</h1>
          <p className="text-muted-foreground mt-1">
            Find your next favorite piece of clothing
          </p>
        </div>
        <Button asChild>
          <Link href="/add" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select defaultValue={category}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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