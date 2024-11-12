import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-[#333333] text-white p-16 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/src/assets/Epoch_Logo_Light.png" alt="Epoch" className="h-16" />
      </div>
      <h1 className="text-4xl font-semibold">Malaria Detection Model</h1>
    </header>
  );
}