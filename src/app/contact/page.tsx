export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#2b2118]">
      <header className="border-b border-[#d9cfbf]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="text-sm tracking-wide">Revision Foundations</div>
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#" className="hover:opacity-70">Hub</a>
            <a href="#" className="hover:opacity-70">Pricing</a>
            <a href="#" className="hover:opacity-70">About</a>
            <a href="#" className="hover:opacity-70">Dashboard</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-[#d9cfbf]">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8b7a67]">
                Contact · Support · Collaborations
              </p>
              <h1 className="max-w-xl font-serif text-5xl leading-tight tracking-tight md:text-6xl">
                Get in touch about your revision resources.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#5f5348] md:text-lg">
                If you have a question about your access, need support, or want to discuss a collaboration, feel free to get in touch. I aim to respond within 1–2 working days.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-[#d9cfbf] bg-[#f7f2ea] p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8874]">Email</p>
                  <p className="mt-3 font-serif text-2xl">lauren@revisionfoundations.com</p>
                  <p className="mt-2 text-sm leading-6 text-[#6c5f53]">Best for support, feedback, and general questions.</p>
                </div>
                <div className="rounded-[28px] border border-[#d9cfbf] bg-[#f7f2ea] p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8874]">WhatsApp</p>
                  <p className="mt-3 font-serif text-2xl">Quick replies</p>
                  <p className="mt-2 text-sm leading-6 text-[#6c5f53]">Useful for fast questions about access, updates, or resources.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#d9cfbf] bg-[#f8f4ed] p-6 shadow-sm md:p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8b7a67]">Send a message</p>
              <form className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#5f5348]">First name</span>
                    <input
                      type="text"
                      placeholder="Lauren"
                      className="w-full rounded-2xl border border-[#d9cfbf] bg-[#fbf8f2] px-4 py-3 text-sm outline-none transition focus:border-[#bca68d]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#5f5348]">Last name</span>
                    <input
                      type="text"
                      placeholder="Smith"
                      className="w-full rounded-2xl border border-[#d9cfbf] bg-[#fbf8f2] px-4 py-3 text-sm outline-none transition focus:border-[#bca68d]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-[#5f5348]">Email address</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#d9cfbf] bg-[#fbf8f2] px-4 py-3 text-sm outline-none transition focus:border-[#bca68d]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-[#5f5348]">What can I help with?</span>
                  <select className="w-full rounded-2xl border border-[#d9cfbf] bg-[#fbf8f2] px-4 py-3 text-sm outline-none transition focus:border-[#bca68d]">
                    <option>General question</option>
                    <option>Support</option>
                    <option>Partnership or collaboration</option>
                    <option>Feedback or update request</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-[#5f5348]">Message</span>
                  <textarea
                    rows={7}
                    placeholder="Tell me a little about what you need..."
                    className="w-full rounded-[24px] border border-[#d9cfbf] bg-[#fbf8f2] px-4 py-3 text-sm outline-none transition focus:border-[#bca68d]"
                  />
                </label>

                <div className="flex flex-col gap-4 border-t border-[#e2d8cb] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-xs leading-5 text-[#7a6c60]">
                    Usually replies within 1–2 working days. For account issues, include the email you signed up with.
                  </p>
                  <button
                    type="submit"
                    className="rounded-full bg-[#1f140d] px-6 py-3 text-sm text-[#f7efe4] transition hover:translate-y-[-1px]"
                  >
                    Send message →
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                eyebrow: 'Support',
                title: 'Email',
                body: 'lauren@revisionfoundations.com — Best for detailed questions and support.',
              },
              {
                eyebrow: 'Quick contact',
                title: 'WhatsApp',
                body: '07572650980 — Fast replies for quick questions or access issues.',
              },
              {
                eyebrow: 'Direct line',
                title: 'Phone',
                body: '07572650980 — Available during working hours for urgent queries.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-[#d9cfbf] bg-[#f7f2ea] p-6">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8874]">{item.eyebrow}</p>
                <h2 className="mt-4 font-serif text-3xl leading-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#66594d]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#1a120d] text-[#d9c7b2]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-4 lg:px-10">
          <div>
            <div className="font-serif text-2xl text-[#f2e7d7]">Revision Foundations</div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#b49f8a]">
              Made with care for nursing students preparing for real assessments.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9f8b77]">Products</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="#" className="block hover:text-white">OSCE Tool</a>
              <a href="#" className="block hover:text-white">Core Quiz</a>
              <a href="#" className="block hover:text-white">Revision Hub</a>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9f8b77]">Company</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="#" className="block hover:text-white">About</a>
              <a href="#" className="block hover:text-white">Contact</a>
              <a href="#" className="block hover:text-white">Privacy Policy</a>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9f8b77]">Account</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="#" className="block hover:text-white">Sign in</a>
              <a href="#" className="block hover:text-white">Sign up</a>
              <a href="#" className="block hover:text-white">Dashboard</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
