import { Film, Search } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="relative">
        <Film className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
      </div>
      <div className="flex flex-col">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-black leading-tight">
          MovieHunt
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground tracking-wider uppercase">
          Discover Movies
        </p>
      </div>
    </div>
  );
};

export default Logo;
