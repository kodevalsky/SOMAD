import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020817]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo / Title */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="p-2 bg-teal-500/10 rounded-lg group-hover:bg-teal-500/20 transition-colors">
                        <ShieldAlert className="w-6 h-6 text-teal-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight text-white leading-none">SOMAD</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Misinformation Detection</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Who are we
                    </Link>
                </nav>

                {/* Mobile Menu Button (Placeholder) */}
                <button className="md:hidden p-2 text-gray-400 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>

            </div>
        </header>
    );
};

export default Header;
