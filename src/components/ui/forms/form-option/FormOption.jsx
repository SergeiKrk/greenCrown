import React, { useState, useRef, useEffect } from 'react';
import TabButton from './TabButton';
import ContactForm from './ContactForm';
import PhoneIcon from './icons/PhoneIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import TelegramIcon from './icons/TelegramIcon';

export default function FormOption({ titleForm, idForm }) {
  const [tabSelected, setTabSelected] = useState({
    currentTab: 1,
    noTabs: 3
  });

  const wrapperRef = useRef(null);
  const tabs = [
    { id: '1', label: 'Телефон', icon: PhoneIcon, formType: 'phone' },
    { id: '2', label: 'Whatsapp', icon: WhatsappIcon, formType: 'wp' },
    { id: '3', label: 'Telegram', icon: TelegramIcon, formType: 'tg' }
  ];

  const handleKeyDown = (e) => {
    if (e.keyCode === 39) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        setTabSelected(prev => ({
          ...prev,
          currentTab: prev.currentTab < prev.noTabs ? prev.currentTab + 1 : 1
        }));
      }
    }

    if (e.keyCode === 37) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        setTabSelected(prev => ({
          ...prev,
          currentTab: prev.currentTab > 1 ? prev.currentTab - 1 : prev.noTabs
        }));
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <p className="my-3 flex items-start text-xs">Выберите удобный способ связи:</p>
      <ul className="flex items-center gap-1" role="tablist" ref={wrapperRef}>
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.id}
            isActive={tabSelected.currentTab === parseInt(tab.id)}
            icon={tab.icon}
            label={tab.label}
            tabId={`tab-label-${tab.id}fi`}
            onClick={() => setTabSelected(prev => ({ 
              ...prev, 
              currentTab: parseInt(tab.id) 
            }))}
            posInSet={index + 1}
            setSize={tabs.length}
          />
        ))}
      </ul>
      
      <div className="">
        {tabs.map(tab => (
          <ContactForm
            key={tab.id}
            isActive={tabSelected.currentTab === parseInt(tab.id)}
            formType={tab.formType}
            titleForm={titleForm}
            idForm={idForm}
          />
        ))}
      </div>
    </>
  );
}