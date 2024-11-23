const epochLogo = '/Epoch_Logo_Light.png'  // If using public folder

export default function Header() {
  return (
    <header className="bg-[#333333] text-white p-8 lg:p-16">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <img 
              src={epochLogo} 
              alt="Epoch" 
              className="h-6 lg:h-10"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = '/Epoch_Logo_Light.png';  // Fallback path
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}