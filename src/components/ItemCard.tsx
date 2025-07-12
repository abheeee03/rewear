import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ItemCardProps {
  id: string;
  title: string;
  category: string;
  condition: string;
  imageUrl: string;
  userName: string;
}

export function ItemCard({ id, title, category, condition, imageUrl, userName }: ItemCardProps) {
  return (
    <Link href={`/items/${id}`} className="block">
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <Badge variant="secondary">{category}</Badge>
              <Badge variant="outline">{condition}</Badge>
            </div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">Added by {userName}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 