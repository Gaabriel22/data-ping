import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/login", "/register"])

export default clerkMiddleware(async (auth, req) => {
  // Se a rota **não** for pública, exige autenticação
  if (!isPublicRoute(req)) {
    const session = await auth();
    if (!session.isAuthenticated) {
      // Redireciona para a página de login se não autenticado
      return Response.redirect(new URL("/login", req.url));
    }
  }
})

export const config = {
  matcher: [
    // Padrão recomendado pela Clerk para proteger rotas e APIs
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
