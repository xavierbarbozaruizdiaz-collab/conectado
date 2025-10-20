
'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductAuctionNavigationProps {
  prevProductId: string | null;
  nextProductId: string | null;
}

export default function ProductAuctionNavigation({ prevProductId, nextProductId }: ProductAuctionNavigationProps) {
  return (
    <TooltipProvider>
      {prevProductId && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="fixed top-1/2 left-4 md:left-8 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg"
            >
              <Link href={`/products/${prevProductId}`}>
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Subasta Anterior</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Subasta Anterior</p>
          </TooltipContent>
        </Tooltip>
      )}

      {nextProductId && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="fixed top-1/2 right-4 md:right-8 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg"
            >
              <Link href={`/products/${nextProductId}`}>
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Siguiente Subasta</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Siguiente Subasta</p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
}
