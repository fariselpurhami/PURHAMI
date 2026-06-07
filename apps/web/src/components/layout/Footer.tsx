import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#121212] text-[#F9F8F6] py-24 px-6 md:px-12 border-t border-[#3B0918]">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-serif text-4xl text-[#F9F8F6] uppercase tracking-widest mb-6">Purhami</h2>
          <p className="max-w-sm text-xs uppercase tracking-widest leading-loose text-[#F9F8F6]/60">
            The architecture of identity. Designed for the uncompromising.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[#F9F8F6]/40">Client Services</h4>
          <ul className="flex flex-col gap-4 text-sm tracking-wide">
            <li><a href="#" className="hover:text-[#3B0918] transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-[#3B0918] transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-[#3B0918] transition-colors">Care Instructions</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[#F9F8F6]/40">Legal</h4>
          <ul className="flex flex-col gap-4 text-sm tracking-wide">
            <li><a href="#" className="hover:text-[#3B0918] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#3B0918] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#3B0918] transition-colors">Accessibility</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto mt-24 pt-8 border-t border-[#F9F8F6]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-[#F9F8F6]/40">
        <p>© {new Date().getFullYear()} PURHAMI. ALL RIGHTS RESERVED.</p>
        <p>ENGINEERED FOR PRODUCTION.</p>
      </div>
    </footer>
  );
};
