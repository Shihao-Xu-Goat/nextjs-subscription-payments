'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n/types/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Record<string, any>;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

// 定义所有需要的翻译命名空间
const NAMESPACES = ['common', 'hero'];

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTranslations: Record<string, any>;
}

export function LocaleProvider({
  children,
  initialLocale,
  initialTranslations,
}: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<Record<string, any>>(
    initialTranslations || {}
  );

  console.log('LocaleProvider initialTranslations:', initialTranslations);
  console.log('LocaleProvider current translations:', translations);

  useEffect(() => {
    const loadTranslations = async () => {
      // 如果已经有翻译数据且语言没有改变，不需要重新加载
      if (Object.keys(translations).length > 0 && locale === initialLocale) {
        console.log('Using existing translations:', JSON.stringify(translations, null, 2));
        return;
      }

      try {
        // 加载所有翻译文件
        const responses = await Promise.all(
          NAMESPACES.map(async namespace => {
            console.log(`Loading namespace: ${namespace}`);
            const response = await fetch(`/locales/${locale}/${namespace}.json`);
            if (!response.ok) {
              console.error(`Failed to load namespace ${namespace}: ${response.statusText}`);
              return {};
            }
            const data = await response.json();
            console.log(`Loaded ${namespace} translations:`, JSON.stringify(data, null, 2));
            return data;
          })
        );

        // 将所有翻译合并到一个对象中
        const newTranslations = NAMESPACES.reduce((acc, namespace, index) => {
          acc[namespace] = responses[index];
          return acc;
        }, {} as Record<string, any>);

        console.log('All loaded translations:', JSON.stringify(newTranslations, null, 2));
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setTranslations({});
      }
    };

    loadTranslations();
  }, [locale, initialLocale]);

  const t = (key: string, params?: Record<string, string>): string => {
    // 检查 key 是否有效
    if (!key) {
      console.warn('Translation key is undefined or empty');
      return '';
    }

    console.log('Translation lookup:', { key, params, translations });
    
    try {
      // 遍历所有命名空间
      for (const namespace of NAMESPACES) {
        const namespaceData = translations[namespace];
        if (!namespaceData) {
          console.log(`Namespace ${namespace} not found`);
          continue;
        }

        // 尝试在当前命名空间中查找完整的键路径
        const keys = key.split('.');
        let value: any = namespaceData;
        let found = true;

        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
            console.log(`Found key ${k} in path, current value:`, value);
          } else {
            found = false;
            console.log(`Key ${k} not found in path`);
            break;
          }
        }

        if (found && typeof value === 'string') {
          if (params) {
            const result = Object.entries(params).reduce((str, [key, val]) => {
              return str.replace(new RegExp(`{{${key}}}`, 'g'), val);
            }, value);
            console.log('Translation found with params:', result);
            return result;
          }
          console.log('Translation found:', value);
          return value;
        }
      }
    } catch (error) {
      console.error(`Error looking up translation for key "${key}":`, error);
    }

    // 如果所有命名空间都没有找到翻译，返回键名
    console.warn('Translation lookup failed:', {
      key,
      namespaces: NAMESPACES,
      availableKeys: NAMESPACES.map(ns => ({
        namespace: ns,
        keys: translations[ns] ? Object.keys(translations[ns]) : []
      }))
    });
    return key;
  };

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    // 更新 URL 中的语言参数
    const newPath = window.location.pathname.replace(/^\/[^/]+/, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t, translations }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
} 