export default function Header() {
  return (
    <header className="bg-[#333333] text-white p-8 lg:p-16">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 sm:gap-6"> {/* Changed to flex-col and centered */}
          <div className="flex-shrink-0">
            <img src="/src/assets/Epoch_Logo_Light.png" alt="Epoch" className="h-6 lg:h-10" /> {/* Adjusted size to be smaller */}
          </div>
        </div>
      </div>
    </header>
  );
}