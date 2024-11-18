export default function Header() {
  return (
    <header className="bg-[#333333] text-white p-8 lg:p-16">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <img src="/src/assets/Epoch_Logo_Light.png" alt="Epoch" className="h-10 lg:h-16" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-5xl lg:ml-6 font-semibold text-center sm:text-left">
            Malaria Detection Model
          </h1>
        </div>
      </div>
    </header>
  );
}