import Sidebar from './Sidebar';

export interface PlatformShellProps {
  children: React.ReactNode;
}

export default function PlatformShell({ children }: PlatformShellProps) {
  return (
    <div className="min-h-screen flex bg-[var(--color-lf-surface)] text-[var(--color-lf-text)]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
