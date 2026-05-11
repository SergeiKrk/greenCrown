import React from 'react';

export default function TabButton({ 
  isActive, 
  icon: Icon, 
  label, 
  tabId, 
  onClick, 
  posInSet, 
  setSize 
}) {
  return (
    <li role="presentation">
      <button
        className={`inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded px-4 text-sm font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed ${
          isActive
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-primary-500 disabled:bg-emerald-300'
            : 'w-full justify-self-center stroke-slate-700 text-slate-700 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 disabled:text-emerald-300'
        }`}
        id={tabId}
        role="tab"
        aria-setsize={setSize}
        aria-posinset={posInSet}
        tabIndex={isActive ? '0' : '-1'}
        aria-controls={tabId.replace('label', 'panel')}
        aria-selected={isActive ? 'true' : 'false'}
        onClick={onClick}
      >
        <span className="order-2 hidden sm:block dark:text-neutral-50">{label}</span>
        <span className="relative">
          <Icon />
        </span>
      </button>
    </li>
  );
}