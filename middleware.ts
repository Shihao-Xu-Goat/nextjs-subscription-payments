import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['en', 'zh'];
const DEFAULT_LOCALE = 'en';

export async function middleware(request: NextRequest) {
  // 1. Supabase 更新 Session
  const response = await updateSession(request);

  // 2. 跳过静态文件
  if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
    return response;
  }

  // 3. 跳过 API 路由
  if (request.nextUrl.pathname.startsWith('/api')) {
    return response;
  }

  // 4. 检查路径是否已包含 locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) =>
      request.nextUrl.pathname.startsWith(`/${locale}/`) ||
      request.nextUrl.pathname === `/${locale}`
  );
  if (pathnameHasLocale) return response;

  // 5. 判断用户的语言偏好（cookie 或 header）
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const headerLocale = request.headers.get('accept-language')?.split(',')[0].split('-')[0];

  let locale = DEFAULT_LOCALE;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (headerLocale && SUPPORTED_LOCALES.includes(headerLocale)) {
    locale = headerLocale;
  }

  // 6. 重定向到带 locale 的路径
  return NextResponse.redirect(
    new URL(
      `/${locale}${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}${request.nextUrl.search}`,
      request.url
    )
  );
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
