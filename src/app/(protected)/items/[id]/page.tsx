import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, Tag, Truck } from 'lucide-react';
import Link from 'next/link';

interface ItemPageProps {
  params: {
    id: string;
  };
}

async function getItem(id: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        images: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            profile_photo_url: true,
          },
        },
      },
    });
    return item;
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  const item = await getItem(params.id);

  if (!item) {
    notFound();
  }

  // Format date
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container py-6 px-20">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 mb-4">
          <Link href="/items" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to items
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-30">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            {item.images.length > 0 ? (
              <Image
                src={item.images[0].imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.slice(0, 4).map((image) => (
                <div key={image.id} className="relative aspect-square rounded-md overflow-hidden border">
                  <Image
                    src={image.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className="px-3 py-1">{item.category}</Badge>
            <Badge variant="outline" className="px-3 py-1">{item.condition}</Badge>
            <Badge variant="secondary" className="px-3 py-1">{item.size}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <Avatar>
              {item.createdBy.profile_photo_url ? (
                <AvatarImage src={item.createdBy.profile_photo_url} alt={item.createdBy.name} />
              ) : (
                <AvatarFallback>
                  {item.createdBy.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{item.createdBy.name}</p>
              <p className="text-sm text-muted-foreground">Owner</p>
            </div>
          </div>

          <Tabs defaultValue="details" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="exchange">Exchange Options</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <div className="prose prose-sm max-w-none mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p>{item.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Size</p>
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Listed</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="exchange" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Swap Request</CardTitle>
                  <CardDescription>
                    Offer one of your items in exchange for this item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">Arrange shipping or pickup with the owner after approval</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Request to Swap</Button>
                </CardFooter>
              </Card>
              
              <div className="h-4"></div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Redeem with Points</CardTitle>
                  <CardDescription>
                    Use your accumulated points to get this item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">Estimated points required: 50 points</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Redeem with Points</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 