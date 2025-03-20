'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/client';
import { Locale } from '@/lib/i18n/types/i18n';
import { usePathname, useRouter } from 'next/navigation';

const LANGUAGES: Record<Locale, string> = {
  en: 'language.english',
  zh: 'language.chinese'
};

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    
    // 获取当前路径并处理语言切换
    const pathSegments = pathname.split('/').filter(Boolean);
    let newPath;
    
    // 如果路径中包含语言代码，替换它
    if (Object.keys(LANGUAGES).includes(pathSegments[0])) {
      pathSegments[0] = newLocale;
      newPath = '/' + pathSegments.join('/');
    } else {
      // 如果路径中没有语言代码，添加新的语言代码
      newPath = `/${newLocale}${pathname}`;
    }
    
    //router.push(newPath);
    // 硬跳转，强制全页 reload，避免流错误
    window.location.href = newPath;
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-sm font-medium text-secondary-600 hover:text-primary-600 focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{t(LANGUAGES[locale])}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {Object.entries(LANGUAGES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => changeLanguage(key as Locale)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                locale === key
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              {t(value)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}