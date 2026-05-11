import React from 'react';

const tabStyles = {
  active: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-primary-500 disabled:bg-emerald-300',
  inactive: 'w-full justify-self-center stroke-slate-700 text-slate-700 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 disabled:text-emerald-300'
};

export const TabButton = ({ 
  isActive, 
  onClick, 
  icon, 
  label, 
  id, 
  ariaPosinset, 
  ariaSetsize 
}) => (
  <li role="presentation">
    <button
      className={`inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded px-4 text-sm font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed ${
        isActive ? tabStyles.active : tabStyles.inactive
      }`}
      id={id}
      role="tab"
      aria-setsize={ariaSetsize}
      aria-posinset={ariaPosinset}
      tabIndex={isActive ? '0' : '-1'}
      aria-controls={id.replace('label', 'panel')}
      aria-selected={isActive}
      onClick={onClick}
    >
      <span className="order-2 hidden sm:block dark:text-neutral-50">{label}</span>
      <span className="relative">{icon}</span>
    </button>
  </li>
);