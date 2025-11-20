'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, QrCode, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TabBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const isProfileActive = () => {
    return pathname === '/projects/me' || pathname.startsWith('/projects/me/');
  };

  const isExploreActive = () => {
    if (pathname === '/projects') return true;
    if (isProfileActive()) return false;
    if (pathname.includes('/new')) return false;
    // Activo en rutas como /projects/[id]
    return pathname.startsWith('/projects/') && pathname.split('/').length === 3;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around h-[68px] relative">
          {/* Inicio */}
          <Link 
            href="/"
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
              isActive('/') && pathname === '/' 
                ? "text-foreground" 
                : "text-muted-foreground/70"
            )}
          >
            <Home className="h-[22px] w-[22px]" strokeWidth={2} />
            <span className="text-[11px] font-normal tracking-tight">Inicio</span>
            {isActive('/') && pathname === '/' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-foreground rounded-t-full" />
            )}
          </Link>

          {/* Explorar */}
          <Link 
            href="/projects"
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
              isExploreActive()
                ? "text-foreground" 
                : "text-muted-foreground/70"
            )}
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={2} />
            <span className="text-[11px] font-normal tracking-tight">Explorar</span>
            {isExploreActive() && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-foreground rounded-t-full" />
            )}
          </Link>

          {/* QR Scanner - Botón Central estilo Lemon */}
          <Link 
            className="flex flex-col items-center justify-center flex-1 h-full relative -mt-1"
            href="/qr"
          >
            <div className="w-[56px] h-[56px] rounded-full bg-secondary flex items-center justify-center shadow-lg relative -top-1">
              <div className="w-[52px] h-[52px] rounded-full bg-secondary flex items-center justify-center border-4 border-background relative">
                <QrCode className="h-[26px] w-[26px] text-black" strokeWidth={2.5} />
                <Heart className="h-[18px] w-[18px] text-black absolute" fill="black" stroke="none" />
              </div>
            </div>
          </Link>

          {/* Mis Aportes */}
          <Link 
            href="/donations/me"
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
              isActive('/donations')
                ? "text-foreground" 
                : "text-muted-foreground/70"
            )}
          >
            <Heart className="h-[22px] w-[22px]" strokeWidth={2} />
            <span className="text-[11px] font-normal tracking-tight">Aportes</span>
            {isActive('/donations') && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-foreground rounded-t-full" />
            )}
          </Link>

          {/* Perfil */}
          <Link 
            href="/projects/me"
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
              isProfileActive()
                ? "text-foreground" 
                : "text-muted-foreground/70"
            )}
          >
            <User className="h-[22px] w-[22px]" strokeWidth={2} />
            <span className="text-[11px] font-normal tracking-tight">Perfil</span>
            {isProfileActive() && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-foreground rounded-t-full" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

