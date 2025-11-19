'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Project } from '@/lib/types';
import { updateProject } from '@/lib/storage';
import { lemonSDK } from '@/lib/lemon-sdk-mock';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface FundProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FundProjectDialog({ project, open, onOpenChange, onSuccess }: FundProjectDialogProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFund = async () => {
    if (!project) return;

    const fundAmount = parseFloat(amount);

    if (isNaN(fundAmount) || fundAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid funding amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Process payment using Lemon SDK
      const paymentResponse = await lemonSDK.makePayment(fundAmount, project.creatorAddress);

      if (!paymentResponse.success) {
        toast({
          title: 'Payment Failed',
          description: paymentResponse.error || 'Failed to process payment',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Update project with new funding
      const newAmount = project.currentAmount + fundAmount;
      updateProject(project.id, { currentAmount: newAmount });

      toast({
        title: 'Success!',
        description: `You've funded $${fundAmount.toFixed(2)} to ${project.title}`,
      });

      setAmount('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process funding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const remaining = project ? project.goalAmount - project.currentAmount : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Apoyar Proyecto</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            {project?.title}
          </DialogDescription>
        </DialogHeader>

        {project && (
          <div className="space-y-5 py-4">
            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Actual</span>
                <span className="text-base font-semibold text-[#00D26B]">
                  ${project.currentAmount.toFixed(0)} ARS
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meta</span>
                <span className="text-base font-medium text-foreground">
                  ${project.goalAmount.toFixed(0)} ARS
                </span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Falta</span>
                  <span className="text-lg font-bold text-foreground">
                    ${remaining.toFixed(0)} ARS
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount" className="text-foreground text-sm font-medium">
                Monto a aportar
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="bg-input text-foreground border-border h-14 text-xl pl-4 pr-16 font-semibold"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                  ARS
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-3 sm:gap-3">
          <Button
            onClick={handleFund}
            className="w-full h-12 bg-[#00D26B] text-black hover:bg-[#00B85C] font-semibold text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Procesando...
              </>
            ) : (
              'Confirmar Aporte'
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-transparent"
            disabled={loading}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
