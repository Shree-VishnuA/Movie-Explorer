
import { Film, Search } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Film className="w-8 h-8 text-primary" />
        <Search className="w-4 h-4 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl  font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-black">
          MovieHunt
        </h1>
        <p className="text-xs text-muted-foreground tracking-wider uppercase">
          Discover Movies
        </p>
      </div>
    </div>
  );
};

export default Logo;
