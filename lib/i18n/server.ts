import fs from 'fs/promises';
import path from 'path';
import { Locale } from '@/lib/i18n/types/i18n';

export async function getServerTranslations(locale: Locale, namespaces: string[]) {
  const translations: Record<string, any> = {};

  console.log('Loading server translations for:', { locale, namespaces });

  for (const namespace of namespaces) {
    try {
      // First try the standard path (for local development)
      let filePath = path.join(process.cwd(), 'public', 'locales', locale, `${namespace}.json`);
      let fileExists = false;
      
      try {
        // Check if file exists at the standard path
        await fs.access(filePath);
        fileExists = true;
      } catch {
        // If not found, try the Vercel deployment path
        filePath = path.join('static', 'locales', locale, `${namespace}.json`);
        try {
          await fs.access(filePath);
          fileExists = true;
        } catch {
          // If still not found, try direct static path (another possible Vercel structure)
          filePath = path.join(process.cwd(), 'locales', locale, `${namespace}.json`);
          try {
            await fs.access(filePath);
            fileExists = true;
          } catch {
            // File not found in any expected location
          }
        }
      }
      
      console.log('Reading translation file:', filePath, 'Exists:', fileExists);
      
      if (fileExists) {
        const content = await fs.readFile(filePath, 'utf-8');
        const parsedContent = JSON.parse(content);
        translations[namespace] = parsedContent;
        
        // Log the full structure of loaded translations
        console.log(`Full ${namespace} translations structure:`, JSON.stringify(translations[namespace], null, 2));
      } else {
        throw new Error(`Translation file not found at any expected location`);
      }
    } catch (error) {
      console.error(`Failed to load translations for ${locale}/${namespace}:`, error);
      translations[namespace] = {};
    }
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    // 检查 key 是否有效
    if (!key) {
      console.warn('Translation key is undefined or empty');
      return '';
    }

    // Log the translation lookup attempt
    console.log('Translation lookup:', { key, params });
    
    // 遍历所有命名空间
    for (const namespace of namespaces) {
      const namespaceData = translations[namespace];
      if (!namespaceData) {
        console.log(`Namespace ${namespace} not found`);
        continue;
      }

      try {
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
            const result = value.replace(/\{\{(\w+)\}\}/g, (_, param) => 
              String(params[param] ?? `{{${param}}}`)
            );
            console.log('Translation found with params:', result);
            return result;
          }
          console.log('Translation found:', value);
          return value;
        }
      } catch (error) {
        console.error(`Error looking up translation for key "${key}":`, error);
        continue;
      }
    }

    // 如果所有命名空间都没有找到翻译，返回键名并记录详细信息
    console.warn('Translation lookup failed:', {
      key,
      namespaces,
      availableKeys: namespaces.map(ns => ({
        namespace: ns,
        keys: Object.keys(translations[ns] || {})
      })),
      searchPath: key.split('.')
    });
    return key;
  };

  return { t, translations };
}