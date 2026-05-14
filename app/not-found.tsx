export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center gradient-hero">
      <div className="text-center px-4">
        <h1 className="font-heading text-8xl font-bold text-accent mb-4">404</h1>
        <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">Page Not Found</h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <a href="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition">Back to Home</a>
      </div>
    </main>
  );
}
