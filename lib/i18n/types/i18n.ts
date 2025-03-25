export type Locale = 'en' | 'zh' ;

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  [locale: string]: Translation;
}

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}