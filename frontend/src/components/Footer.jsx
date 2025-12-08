import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-[#020817] py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="text-center md:text-left">
                    <p className="text-sm text-gray-400">
                        {new Date().getFullYear()} SOMAD
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        Social Media Misinformation Analysis and Detection
                    </p>
                </div>

                <div className="flex items-center space-x-6">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors">
                        <Github className="w-5 h-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors">
                        <Twitter className="w-5 h-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
