import fs from 'fs/promises';
import path from 'path';
import { Locale } from '@/lib/i18n/types/i18n';

// Function to recursively print directory structure
async function printDirectoryStructure(dir: string, indent: string = '', prefix: string = '') {
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    const sortedItems = [...items].sort((a, b) => {
      // Directories first, then files
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
    
    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const isLast = i === sortedItems.length - 1;
      const itemPath = path.join(dir, item.name);
      
      // Create the current line prefix
      const linePrefix = isLast ? '└── ' : '├── ';
      // Create the next level indent prefix
      const nextPrefix = isLast ? '    ' : '│   ';
      
      // Print current item with appropriate prefix
      console.log(`${indent}${linePrefix}${item.isDirectory() ? '📁' : '📄'} ${item.name}`);
      
      if (item.isDirectory()) {
        // Recursively print subdirectories with updated indent
        await printDirectoryStructure(itemPath, indent + nextPrefix);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
}

export async function getServerTranslations(locale: Locale, namespaces: string[]) {
  const translations: Record<string, any> = {};

  console.log('Loading server translations for:', { locale, namespaces });
  
  // Print the entire project directory structure
  console.log('\n📁 PROJECT DIRECTORY STRUCTURE:');
  await printDirectoryStructure(process.cwd());
  console.log('\n');

  for (const namespace of namespaces) {
    try {
      // Try multiple possible paths for translation files
      const possiblePaths = [
        // Path for local development
        path.join(process.cwd(), 'public', 'locales', locale, `${namespace}.json`),
        // Path for Vercel production
        path.join(process.cwd(), '.vercel', 'output', 'static', 'locales', locale, `${namespace}.json`),
        path.join(process.cwd(), 'output', 'static', 'locales', locale, `${namespace}.json`),
        path.join(process.cwd(),  'locales', locale, `${namespace}.json`),
        // Path as previously used
        path.join(process.cwd(), '.vercel/output/static/locales', locale, namespace)
      ];
      
      let content = null;
      let usedPath = null;
      
      // Try each path until we find one that works
      for (const attemptPath of possiblePaths) {
        try {
          console.log('Attempting to read translation file from:', attemptPath);
          content = await fs.readFile(attemptPath, 'utf-8');
          usedPath = attemptPath;
          console.log('Successfully read translation file from:', usedPath);
          break;
        } catch (pathError: unknown) {
          if (pathError instanceof Error) {
            console.log(`Could not read from ${attemptPath}:`, (pathError as { code?: string }).code);
          } else {
            console.log(`Could not read from ${attemptPath}: Unknown error`);
          }
          // Continue to the next path
        }
      }
      
      if (!content) {
        throw new Error(`Could not find translation file for ${locale}/${namespace} in any of the expected locations`);
      }
      
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