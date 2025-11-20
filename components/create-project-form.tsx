'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types';
import { saveProject } from '@/lib/storage';
import { authenticate, deposit, TransactionResult, TokenName } from '@/lib/lemon-sdk-mock';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface CreateProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    initialDeposit: '',
    creatorName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const goalAmount = parseFloat(formData.goalAmount);
      const initialDeposit = parseFloat(formData.initialDeposit);

      // Validation
      if (!formData.title || !formData.description || !formData.creatorName) {
        toast({
          title: 'Información Faltante',
          description: 'Por favor completá todos los campos requeridos',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (isNaN(goalAmount) || goalAmount <= 0) {
        toast({
          title: 'Monto Objetivo Inválido',
          description: 'Por favor ingresá un monto objetivo válido',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (isNaN(initialDeposit) || initialDeposit < 0) {
        toast({
          title: 'Depósito Inicial Inválido',
          description: 'Por favor ingresá un monto de depósito inicial válido',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Authenticate to get user's wallet address
      const authResult = await authenticate();
      
      if (authResult.result !== TransactionResult.SUCCESS) {
        toast({
          title: 'Autenticación Fallida',
          description: authResult.result === TransactionResult.CANCELLED 
            ? 'Autenticación cancelada' 
            : 'No se pudo autenticar tu wallet',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const creatorAddress = authResult.data.wallet;

      // Make initial deposit using Lemon SDK
      if (initialDeposit > 0) {
        const paymentResponse = await deposit({
          amount: initialDeposit.toString(),
          tokenName: TokenName.USDC,
        });
        
        if (paymentResponse.result !== TransactionResult.SUCCESS) {
          toast({
            title: 'Pago Fallido',
            description: paymentResponse.result === TransactionResult.CANCELLED
              ? 'Depósito cancelado'
              : 'No se pudo procesar el depósito inicial',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
      }

      // Create project
      const newProject: Project = {
        id: 'project_' + Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        goalAmount,
        currentAmount: initialDeposit,
        creatorAddress: creatorAddress,
        creatorName: formData.creatorName,
        createdAt: new Date(),
      };

      saveProject(newProject);

      toast({
        title: '¡Campaña Creada!',
        description: 'Tu campaña de crowdfunding ha sido creada exitosamente',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la campaña. Por favor intentá nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Crear Campaña</CardTitle>
        <CardDescription className="text-muted-foreground">
          Completá el formulario para iniciar tu crowdfunding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Título de la Campaña *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Mi Campaña Increíble"
              className="bg-input text-foreground border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describí tu campaña y qué planeas lograr..."
              className="bg-input text-foreground border-border min-h-24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatorName" className="text-foreground">Tu Nombre *</Label>
            <Input
              id="creatorName"
              value={formData.creatorName}
              onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
              placeholder="Juan Pérez"
              className="bg-input text-foreground border-border"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalAmount" className="text-foreground">Monto Objetivo (USDC) *</Label>
              <Input
                id="goalAmount"
                type="number"
                step="0.01"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                placeholder="1000.00"
                className="bg-input text-foreground border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialDeposit" className="text-foreground">Depósito Inicial (USDC)</Label>
              <Input
                id="initialDeposit"
                type="number"
                step="0.01"
                value={formData.initialDeposit}
                onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                placeholder="0.00"
                className="bg-input text-foreground border-border"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-border text-foreground hover:bg-muted"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creando...
                </>
              ) : (
                'Crear Campaña'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
