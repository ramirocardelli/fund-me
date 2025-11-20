'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    goalCurrency: 'USD',
    imageUrl: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const goalAmount = parseFloat(formData.goalAmount);

      // Validation
      if (!formData.title.trim()) {
        toast({
          title: 'Título Requerido',
          description: 'Por favor ingresá un título para la campaña',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        toast({
          title: 'Descripción Requerida',
          description: 'Por favor ingresá una descripción para la campaña',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (isNaN(goalAmount) || goalAmount <= 0) {
        toast({
          title: 'Monto Objetivo Inválido',
          description: 'Por favor ingresá un monto objetivo válido mayor a 0',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Validar fechas si se proporcionan ambas
      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        
        if (startDate > endDate) {
          toast({
            title: 'Fechas Inválidas',
            description: 'La fecha de inicio debe ser anterior a la fecha de fin',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
      }

      // Crear campaña usando el API endpoint
      const payload = {
        title: formData.title,
        description: formData.description,
        goalAmount,
        goalCurrency: formData.goalCurrency,
        imageUrl: formData.imageUrl || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      const response = await axios.post('/api/campaigns', payload);

      if (response.data.success) {
        toast({
          title: '¡Campaña Creada!',
          description: 'Tu campaña de crowdfunding ha sido creada exitosamente',
        });
        onSuccess();
      } else {
        throw new Error(response.data.error || 'Error al crear la campaña');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'No se pudo crear la campaña';
      
      toast({
        title: 'Error',
        description: errorMessage,
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
            <Label htmlFor="imageUrl" className="text-foreground">URL de Imagen</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="bg-input text-foreground border-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalAmount" className="text-foreground">Monto Objetivo *</Label>
              <Input
                id="goalAmount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                placeholder="1000.00"
                className="bg-input text-foreground border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalCurrency" className="text-foreground">Moneda *</Label>
              <Input
                id="goalCurrency"
                value={formData.goalCurrency}
                onChange={(e) => setFormData({ ...formData, goalCurrency: e.target.value })}
                placeholder="USD"
                className="bg-input text-foreground border-border"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground">Fecha de Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-input text-foreground border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-foreground">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
