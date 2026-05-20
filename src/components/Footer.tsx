export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--color-lf-border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-[var(--color-lf-black)] text-lg tracking-tight">
              LOAN FACTORY
              <span className="block text-[var(--color-lf-orange)] text-[10px] font-bold tracking-[0.22em] mt-0.5">
                AI ADVANTAGE
              </span>
            </p>
            <p className="text-[var(--color-lf-muted)] text-sm mt-2">
              Part of the 1+1+1=5 Team Leader Program
            </p>
          </div>
          <div className="text-center md:text-right text-sm text-[var(--color-lf-muted)] space-y-1">
            <p>Loan Factory, Inc. · NMLS #320841</p>
            <p>Equal Housing Lender</p>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Loan Factory. All rights reserved.
            </p>
          </div>
        </div>
        <div className="border-t border-[var(--color-lf-border)] mt-8 pt-6 text-center text-xs text-[var(--color-lf-muted)] leading-relaxed">
          This is not a commitment to lend. All loan applications are subject to credit and property
          approval. Rates and programs are subject to change without notice.
        </div>
      </div>
    </footer>
  );
}
