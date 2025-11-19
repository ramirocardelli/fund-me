'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/40 pb-safe">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around h-16 px-2">
          {/* Inicio */}
          <Link 
            href="/"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors relative",
              isActive('/') && pathname === '/' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home className="h-6 w-6 mb-0.5" strokeWidth={isActive('/') && pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Inicio</span>
            {isActive('/') && pathname === '/' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-foreground rounded-t-full" />
            )}
          </Link>

          {/* Explorar */}
          <Link 
            href="/projects"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors relative",
              isActive('/projects') && !pathname.includes('/new')
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Search className="h-6 w-6 mb-0.5" strokeWidth={isActive('/projects') && !pathname.includes('/new') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Explorar</span>
            {isActive('/projects') && !pathname.includes('/new') && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-foreground rounded-t-full" />
            )}
          </Link>

          {/* Crear Proyecto - Botón Central */}
          <Link 
            href="/projects/new"
            className="flex flex-col items-center justify-center flex-1 h-full -mt-2"
          >
            <div className="w-14 h-14 rounded-full bg-[#00D26B] flex items-center justify-center shadow-lg shadow-[#00D26B]/20 hover:bg-[#00B85C] transition-colors">
              <Plus className="h-7 w-7 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground mt-1">Crear</span>
          </Link>

          {/* Mis Donaciones */}
          <Link 
            href="/donations/mine"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors relative",
              isActive('/donations')
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className="h-6 w-6 mb-0.5" strokeWidth={isActive('/donations') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Aportes</span>
            {isActive('/donations') && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-foreground rounded-t-full" />
            )}
          </Link>

          {/* Mis Proyectos */}
          <Link 
            href="/projects/mine"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors relative",
              pathname.includes('/mine') && pathname.includes('/projects')
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="h-6 w-6 mb-0.5" strokeWidth={pathname.includes('/mine') && pathname.includes('/projects') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Míos</span>
            {pathname.includes('/mine') && pathname.includes('/projects') && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-foreground rounded-t-full" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

