'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ItemCard } from '@/components/ItemCard';
import { CldUploadWidget } from 'next-cloudinary';
import { Camera, Edit2, User, Package, RefreshCcw, Award, Loader2 } from 'lucide-react';

// Mock data for demonstration
const mockUserItems = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    category: 'Outerwear',
    condition: 'Good',
    imageUrl: '/images/products/jacket-denim.jpg',
    userName: 'You',
  },
  {
    id: '2',
    title: 'Summer Floral Dress',
    category: 'Dresses',
    condition: 'Like new',
    imageUrl: '/images/products/dress-floral.jpg',
    userName: 'You',
  },
];

const mockSwaps = [
  {
    id: '1',
    status: 'pending',
    date: '2023-05-15',
    item: 'Black Leather Boots',
    withUser: 'Sarah',
    offerItem: 'Vintage Denim Jacket',
  },
  {
    id: '2',
    status: 'accepted',
    date: '2023-05-10',
    item: 'Summer Floral Dress',
    withUser: 'Mike',
    offerItem: 'Casual Hoodie',
  },
];

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(session?.user?.image || '');

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      // In a real app, you would update the user profile in the database
      await update({ name, image: profilePhoto });
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsUpdating(false);
    }
  };

  return (
    <div className="container py-6 px-20">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">My Items</span>
          </TabsTrigger>
          <TabsTrigger value="swaps" className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Swaps</span>
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Points</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profilePhoto} alt={name} />
                      <AvatarFallback className="text-2xl">
                        {name ? name[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={(result) => {
                        if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                          setProfilePhoto(result.info.secure_url as string);
                        }
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute -bottom-2 -right-2 rounded-full"
                          onClick={() => open()}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </CldUploadWidget>
                  </div>
                  <div>
                    <p className="font-medium text-lg">{name}</p>
                    <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfile} disabled={isUpdating} className="w-full">
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Update Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>
                  Your account statistics and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Points</p>
                    <p className="text-3xl font-bold">120</p>
                  </div>
                  <Button variant="outline" size="sm">Redeem</Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm">Items Listed</p>
                    <p className="font-medium">2</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Successful Swaps</p>
                    <p className="font-medium">5</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Pending Swaps</p>
                    <p className="font-medium">1</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Member Since</p>
                    <p className="font-medium">May 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Items Tab */}
        <TabsContent value="items">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Listed Items</h2>
              <Button asChild>
                <a href="/add">Add New Item</a>
              </Button>
            </div>

            {mockUserItems.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">You haven't listed any items yet.</p>
                  <Button asChild>
                    <a href="/add">Add Your First Item</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockUserItems.map((item) => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Swaps Tab */}
        <TabsContent value="swaps">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">My Swap Requests</h2>

            {mockSwaps.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">You don't have any swap requests yet.</p>
                  <Button asChild>
                    <a href="/items">Browse Items to Swap</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockSwaps.map((swap) => (
                  <Card key={swap.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={swap.status === 'pending' ? 'outline' : 'secondary'}>
                              {swap.status === 'pending' ? 'Pending' : 'Accepted'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {swap.date}
                            </span>
                          </div>
                          <p className="font-medium">
                            {swap.status === 'pending' ? 'Requesting' : 'Swapped'}: {swap.item}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            With {swap.withUser} • Offering: {swap.offerItem}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {swap.status === 'pending' && (
                            <Button variant="outline" size="sm">Cancel</Button>
                          )}
                          <Button size="sm">Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Points Tab */}
        <TabsContent value="points">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Points Balance</CardTitle>
                <CardDescription>
                  Track and redeem your ReWear points
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-5xl font-bold text-primary mb-2">120</div>
                  <p className="text-muted-foreground">Available Points</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">How to Earn Points</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">+10</Badge>
                      <span>List a new item</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">+20</Badge>
                      <span>Complete a successful swap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">+5</Badge>
                      <span>Receive a positive review</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Browse Items to Redeem</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 