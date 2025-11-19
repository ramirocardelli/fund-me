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
              isActive('/projects') && !pathname.includes('/new')
                ? "text-foreground" 
                : "text-muted-foreground/70"
            )}
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={2} />
            <span className="text-[11px] font-normal tracking-tight">Explorar</span>
            {isActive('/projects') && !pathname.includes('/new') && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-foreground rounded-t-full" />
            )}
          </Link>

          {/* QR Scanner - Botón Central estilo Lemon */}
          <button 
            className="flex flex-col items-center justify-center flex-1 h-full relative -mt-1"
            onClick={() => {
              // TODO: Implementar scanner QR para proyectos
              console.log('QR Scanner - Coming soon');
            }}
          >
            <div className="w-[56px] h-[56px] rounded-full bg-[#00D26B] flex items-center justify-center shadow-lg relative -top-1">
              <div className="w-[52px] h-[52px] rounded-full bg-[#00D26B] flex items-center justify-center border-4 border-background relative">
                <QrCode className="h-[26px] w-[26px] text-black" strokeWidth={2.5} />
                <Heart className="h-[14px] w-[14px] text-[#00D26B] absolute" fill="#00D26B" stroke="none" />
              </div>
            </div>
          </button>

          {/* Mis Aportes */}
          <Link 
            href="/donations/mine"
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

          {/* Mis Proyectos */}
          <Link 
            href="/projects/mine"
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
              pathname.includes('/mine') && pathname.includes('/projects')
                ? "text-foreground" 
                : "text-muted-foreground/70"
            )}
          >
            <User className="h-[22px] w-[22px]" strokeWidth={2} />
            <span className="text-[11px] font-normal tracking-tight">Perfil</span>
            {pathname.includes('/mine') && pathname.includes('/projects') && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-foreground rounded-t-full" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

