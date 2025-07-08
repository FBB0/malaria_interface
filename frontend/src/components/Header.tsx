export default function Header() {
  return (
    <header className="bg-[#333333] text-white p-8 lg:p-16">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 sm:gap-6 relative">
          <div className="flex-shrink-0">
            <img 
              src="/assets/Epoch_Logo_Light.png" 
              alt="Epoch" 
              className="h-6 lg:h-10"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = '/assets/Epoch_Logo_Light.png';
              }}
            />
          </div>
          
          {/* X Button */}
          <a 
            href="https://x.com/FelipeBBello" 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 group"
            aria-label="Follow on X (Twitter)"
          >
            <svg 
              className="w-5 h-5 fill-current text-white group-hover:text-blue-400 transition-colors duration-200" 
              viewBox="0 0 24 24" 
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}