export default function InventarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Inventario - Joyería</h1>
        </div>
      </header>

      <main className="pb-12">{children}</main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          © 2024 Sistema de Inventario de Joyería
        </div>
      </footer>
    </div>
  );
}
