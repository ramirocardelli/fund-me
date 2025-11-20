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
import { Project, Donation } from '@/lib/types';
import { updateProject, saveDonation } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { authenticate, deposit, TokenName, TransactionResult } from '@lemoncash/mini-app-sdk';

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
        title: 'Monto Inválido',
        description: 'Por favor ingresá un monto válido',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Authenticate to get donor's wallet address
      const authResult = await authenticate();
      
      if (authResult.result !== TransactionResult.SUCCESS || !authResult.data) {
        toast({
          title: 'Autenticación Fallida',
          description: 'No se pudo autenticar tu billetera. Por favor intentá nuevamente.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      const donorAddress = authResult.data.wallet;

      // Process payment using Lemon SDK
      const paymentResponse = await deposit({
        amount: fundAmount.toString(),
        tokenName: TokenName.USDC,
      });

      if (paymentResponse.result === TransactionResult.CANCELLED) {
        toast({
          title: 'Pago Cancelado',
          description: 'Cancelaste el pago',
        });
        setLoading(false);
        return;
      }

      if (paymentResponse.result !== TransactionResult.SUCCESS) {
        toast({
          title: 'Pago Fallido',
          description: 'El pago no se pudo completar. Por favor intentá nuevamente.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Update project with new funding
      const newAmount = project.currentAmount + fundAmount;
      updateProject(project.id, { currentAmount: newAmount });

      // Save donation
      const donation: Donation = {
        id: 'donation_' + Math.random().toString(36).substr(2, 9),
        projectId: project.id,
        amount: fundAmount,
        donorAddress,
        timestamp: new Date(),
      };
      saveDonation(donation);

      toast({
        title: 'Donación Exitosa',
        description: `Donaste $${fundAmount.toFixed(2)} a ${project.title}`,
      });

      setAmount('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al procesar el pago. Por favor intentá nuevamente.',
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
          <DialogTitle className="text-foreground text-xl">Apoyar Campaña</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            {project?.title}
          </DialogDescription>
        </DialogHeader>

        {project && (
          <div className="space-y-5 py-4">
            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Actual</span>
                <span className="text-base font-semibold text-secondary">
                  ${project.currentAmount.toLocaleString('es-AR', { maximumFractionDigits: 0 })} USDC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meta</span>
                <span className="text-base font-medium text-foreground">
                  ${project.goalAmount.toLocaleString('es-AR', { maximumFractionDigits: 0 })} USDC
                </span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Falta</span>
                  <span className="text-lg font-bold text-foreground">
                    ${remaining.toLocaleString('es-AR', { maximumFractionDigits: 0 })} USDC
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
                  USDC
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-3 sm:gap-3">
          <Button
            onClick={handleFund}
            className="w-full h-12 bg-secondary text-black hover:bg-secondary/90 font-semibold text-base"
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
