'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  pointsRequired: number;
  userPoints: number;
}

export function RedeemModal({
  isOpen,
  onClose,
  itemId,
  itemTitle,
  pointsRequired,
  userPoints,
}: RedeemModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const hasEnoughPoints = userPoints >= pointsRequired;

  const handleRedeem = async () => {
    if (!hasEnoughPoints) {
      toast({
        title: "Not enough points",
        description: `You need ${pointsRequired - userPoints} more points to redeem this item.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/redemptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          pointsSpent: pointsRequired,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to redeem item');
      }

      toast({
        title: "Item redeemed successfully!",
        description: `You have redeemed ${itemTitle} for ${pointsRequired} points.`,
      });
      onClose();
    } catch (error) {
      console.error('Error redeeming item:', error);
      toast({
        title: "Error",
        description: "Failed to redeem item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Redeem with Points</DialogTitle>
          <DialogDescription>
            Use your accumulated points to get this item
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Item:</span>
            <span>{itemTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Points Required:</span>
            <span className="text-lg font-bold">{pointsRequired}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Your Points:</span>
            <span className={`text-lg font-bold ${hasEnoughPoints ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {userPoints}
            </span>
          </div>

          {!hasEnoughPoints && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have enough points to redeem this item. You need {pointsRequired - userPoints} more points.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleRedeem} 
            disabled={!hasEnoughPoints || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Redemption'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 