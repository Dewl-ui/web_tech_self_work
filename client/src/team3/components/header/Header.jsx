import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="flex h-24 items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <Link to="/team3" className="rounded-xl bg-[linear-gradient(135deg,#4f46e5,#06b6d4)] px-3 py-2 text-sm font-semibold text-white shadow md:hidden">
          Menu
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-[170px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-slate-400 shadow-inner md:w-[290px]">
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Хайх..." />
          <FaSearch className="text-sm" />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fde68a,#fca5a5)] text-lg shadow-md ring-4 ring-white">
          👨🏻
        </div>
      </div>
    </header>
  );
}
