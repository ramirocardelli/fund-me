'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  url: string;
  title?: string;
  description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: 'URL Copiada',
        description: 'El enlace se copió al portapapeles',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo copiar el enlace',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Download the image
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast({
        title: 'QR Descargado',
        description: 'El código QR se guardó como imagen',
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShare = async () => {
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Compartir Campaña',
          text: description || 'Mirá esta campaña',
          url: url,
        });
        return;
      } catch (error) {
        // User cancelled or share not supported, show QR dialog instead
      }
    }
    
    // Fallback to QR code dialog
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleShare}
        variant="outline"
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Compartir
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Compartir Campaña</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Escaneá el código QR o copiá el enlace para compartir
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeSVG
                id="qr-code-svg"
                value={url}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadQR}
                className="flex-1 bg-secondary text-black hover:bg-secondary/90 gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar QR
              </Button>
              <Button
                onClick={handleCopyUrl}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
