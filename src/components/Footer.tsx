export default function Footer() {
  return (
    <footer className="bg-[#003087] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg">Loan Factory AI Advantage</p>
            <p className="text-blue-200 text-sm mt-1">Part of the 1+1+1=5 Program</p>
          </div>
          <div className="text-center md:text-right text-sm text-blue-200 space-y-1">
            <p>Loan Factory, Inc. | NMLS #320841</p>
            <p>Equal Housing Lender</p>
            <p>© 2026 Loan Factory. All rights reserved.</p>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-xs text-blue-300">
          This is not a commitment to lend. All loan applications are subject to credit and property approval.
          Rates and programs are subject to change without notice.
        </div>
      </div>
    </footer>
  );
}
