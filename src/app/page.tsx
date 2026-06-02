export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <section className="border border-border bg-panel/80 p-8 shadow-command-glow backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan">
          Phase 0 scaffold
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          ReuniteRC
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Digital reunification and lost-and-found operations support for the trusted Information
          Bureau workflow at major Redemption City programmes.
        </p>
        <div className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-3">
          <div className="border border-border bg-panel-strong p-4">
            Reunite Point reporting
          </div>
          <div className="border border-border bg-panel-strong p-4">
            Verified handover and release
          </div>
          <div className="border border-border bg-panel-strong p-4">
            Offline queue architecture
          </div>
        </div>
      </section>
    </main>
  );
}
