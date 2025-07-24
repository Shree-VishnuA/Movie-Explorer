import { Film, Search } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="relative">
        {/* Main Logo Icon */}
        <Film className="w-7 h-7 sm:w-8 sm:h-8 text-[#f67c02] drop-shadow-[0_0_6px_#f67c02]" />
        {/* Search Icon Overlay */}
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00FFFF] absolute -bottom-1 -right-1 bg-[#1A1A1F] rounded-full p-0.5 drop-shadow-[0_0_4px_#00FFFF]" />
      </div>
      <div className="flex flex-col">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-[0_0_4px_#f67c02]">
          MovieHunt
        </div>
        <p className="text-[10px] sm:text-xs tracking-wider uppercase text-[#B3B3B3]">
          Discover Movies
        </p>
      </div>
    </div>
  );
};

export default Logo;
