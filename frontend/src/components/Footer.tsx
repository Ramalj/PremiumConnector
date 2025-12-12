"use client";
import React from 'react';
import { QrCode, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand/Logo Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <QrCode className="text-white w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                QRPrimeGen
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">
                            Premium QR code solutions for modern businesses. Beautiful, secure, and easy to use.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Features</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">API</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Showcase</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">About</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Careers</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {currentYear} QRPrimeGen. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>Made with</span>
                        <Heart size={16} className="text-red-500 fill-red-500" />
                        <span>for the web</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
