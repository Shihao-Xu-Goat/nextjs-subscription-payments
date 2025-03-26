import fs from 'fs/promises';
import path from 'path';
import { Locale } from '@/lib/i18n/types/i18n';

export async function getServerTranslations(locale: Locale, namespaces: string[]) {
  const translations: Record<string, any> = {};

  console.log('Loading server translations for:', { locale, namespaces });

  for (const namespace of namespaces) {
    try {
      const filePath = path.join(process.cwd(), '.vercel/output/static/locales', locale, namespace)
      console.log('Reading translation file:', filePath);
      
      const content = await fs.readFile(filePath, 'utf-8');
      const parsedContent = JSON.parse(content);
      translations[namespace] = parsedContent;
      
      // Log the full structure of loaded translations
      console.log(`Full ${namespace} translations structure:`, JSON.stringify(translations[namespace], null, 2));
    } catch (error) {
      console.error(`Server failed to load translations for ${locale}/${namespace}:`, error);
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