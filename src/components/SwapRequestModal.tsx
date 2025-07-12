'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  images: { imageUrl: string }[];
}

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItemId: string;
  targetItemTitle: string;
}

export function SwapRequestModal({
  isOpen,
  onClose,
  targetItemId,
  targetItemTitle,
}: SwapRequestModalProps) {
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/items/user');
        const data = await response.json();
        setUserItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user items:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserItems();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedItemId) {
      toast({
        title: "No item selected",
        description: "Please select an item to swap",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offeredItemId: selectedItemId,
          requestedItemId: targetItemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create swap request');
      }

      toast({
        title: "Swap request sent!",
        description: `Your swap request for ${targetItemTitle} has been sent.`,
      });
      onClose();
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast({
        title: "Error",
        description: "Failed to send swap request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request to Swap</DialogTitle>
          <DialogDescription>
            Select one of your items to offer in exchange for {targetItemTitle}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : userItems.length === 0 ? (
          <div className="text-center py-6">
            <p className="mb-4">You don't have any items to offer for swap.</p>
            <Button asChild>
              <a href="/add">Add an Item</a>
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <RadioGroup value={selectedItemId} onValueChange={setSelectedItemId}>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {userItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-4 border rounded-lg p-3 cursor-pointer ${
                      selectedItemId === item.id ? 'border-primary' : 'border-border'
                    }`}
                    onClick={() => setSelectedItemId(item.id)}
                  >
                    <RadioGroupItem value={item.id} id={`item-${item.id}`} className="sr-only" />
                    <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.images.length > 0 ? item.images[0].imageUrl : '/images/placeholder.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Label
                      htmlFor={`item-${item.id}`}
                      className="flex-grow font-medium cursor-pointer"
                    >
                      {item.title}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || submitting || userItems.length === 0}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Request...
              </>
            ) : (
              'Request Swap'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 