export function Header({ title }: { title: string }) {
  return (
    <header className="w-full px-6 py-4 border-b bg-background flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="text-sm text-muted-foreground">Admin User</div>
    </header>
  );
}
