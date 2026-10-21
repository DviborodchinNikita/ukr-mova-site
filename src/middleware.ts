import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isAuthApi = req.nextUrl.pathname.startsWith("/api/auth");
  const isPublicAsset = req.nextUrl.pathname.startsWith("/_next") || 
                        req.nextUrl.pathname === "/favicon.ico" ||
                        req.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|css|js)$/);

  // Дозволяємо доступ до API авторизації та статичних файлів
  if (isAuthApi || isPublicAsset) return NextResponse.next();

  // Якщо не авторизований і не на сторінці входу -> кидаємо на /login
  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Якщо авторизований і намагається зайти на /login -> кидаємо на головну
  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|css|js)$).*)"],
};