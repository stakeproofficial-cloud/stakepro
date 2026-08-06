import Image from "next/image";
import Link from "next/link";

const navItems = ["Platform", "Solutions", "Pricing", "Resources"];

const partnerLogos = ["Nexora", "Astra", "Northstar", "Quantum", "Vertex", "Nova"];

const features = [
  {
    title: "Smart capital routing",
    description:
      "Direct deposits, yield strategies, and risk controls are combined into one streamlined operating layer.",
    icon: "↗",
  },
  {
    title: "Real-time reporting",
    description:
      "Track treasury performance, wallet balances, and investor activity with live, trustworthy metrics.",
    icon: "◎",
  },
  {
    title: "Institutional-grade compliance",
    description:
      "Keep every flow auditable with automated checks, secure approvals, and transparent transaction logs.",
    icon: "✓",
  },
];

const stats = [
  { value: "$42M+", label: "Assets under management" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "4.8/5", label: "Average user rating" },
  { value: "12k+", label: "Active accounts" },
];

const workflow = [
  "Connect your treasury and wallet stack",
  "Configure staking and payout rules",
  "Monitor automated performance in real time",
];

const testimonials = [
  {
    quote:
      "The interface feels premium, the insights are actionable, and our operations team now has total visibility across every wallet.",
    author: "Alicia Stone",
    role: "CFO, Northstar Capital",
  },
  {
    quote:
      "We cut manual reconciliation work by nearly half in the first month. It feels like a full financial operating system.",
    author: "Daniel Ross",
    role: "Head of Finance, Helio Labs",
  },
  {
    quote:
      "stakepro gave us the clarity and confidence to scale faster without sacrificing control. It looks polished and performs even better.",
    author: "Priya Shah",
    role: "Operations Director, Vanta Grid",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    description: "For early teams scaling clean financial operations.",
    features: ["1 workspace", "Live dashboards", "Basic automations", "Email support"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$99",
    description: "For businesses managing recurring treasury movement.",
    features: ["Unlimited wallets", "Advanced analytics", "Priority support", "Custom workflows"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For institutions needing deeper compliance and controls.",
    features: ["Dedicated success manager", "Security reviews", "SLA-backed support", "Custom integrations"],
    highlighted: false,
  },
];

const faqs = [
  {
    question: "How quickly can we launch?",
    answer:
      "Most teams are fully configured within a few days, with onboarding support and guided setup for treasury and reward flows.",
  },
  {
    question: "Is the platform secure?",
    answer:
      "Yes. We use encrypted data flows, protected wallet integrations, and audit logs designed for controlled financial operations.",
  },
  {
    question: "Can we integrate with existing systems?",
    answer:
      "Absolutely. The platform is built to fit around your current stack and scales with your workflows as your business grows.",
  },
  {
    question: "Do you offer support for high-volume teams?",
    answer:
      "Yes. Growth and enterprise plans include expanded support coverage, implementation guidance, and higher-touch service tiers.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-violet-400 to-cyan-400 shadow-lg shadow-violet-500/30">
              <Image src="/logo.png" alt="stakepro logo" width={24} height={24} className="rounded-lg" unoptimized />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">stakepro</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-violet-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:-translate-y-0.5 hover:shadow-violet-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25),transparent_35%),radial-gradient(circle_at_70%_20%,_rgba(34,211,238,0.20),transparent_25%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-violet-200 uppercase">
                Built for modern operators
              </div>

              <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                Scale your
                <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent"> treasury</span>
                <br />without friction.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Unify staking, wallet visibility, and automated rewards in one premium platform designed for fast-moving teams.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:-translate-y-0.5 hover:shadow-violet-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
                >
                  Start free trial
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-violet-400/50 hover:bg-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
                >
                  Explore platform
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  24/7 investor access
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-violet-500/30 blur-3xl" />
              <div className="absolute -right-8 bottom-6 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-4 shadow-[0_30px_80px_rgba(76,29,149,0.35)] ring-1 ring-white/5">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/75 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Portfolio</p>
                    <p className="mt-2 text-2xl font-semibold text-white">$2.84M</p>
                  </div>
                  <div className="rounded-xl bg-emerald-400/15 px-3 py-2 text-sm font-medium text-emerald-300">
                    +18.4%
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-slate-900 p-4">
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                      <span>Yield performance</span>
                      <span className="text-cyan-300">+12.6%</span>
                    </div>
                    <div className="flex h-28 items-end gap-2">
                      {[28, 42, 36, 58, 48, 76, 88].map((height, index) => (
                        <span
                          key={index}
                          className="w-full rounded-t-xl bg-gradient-to-t from-violet-500 to-cyan-400"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Staking</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-2xl font-semibold text-white">$580k</span>
                        <span className="text-sm text-emerald-300">Live</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Wallet flow</p>
                      <div className="mt-3 space-y-3">
                        {["USDT", "BTC", "ETH"].map((coin, idx) => (
                          <div key={coin} className="flex items-center justify-between text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${idx === 0 ? "bg-violet-400" : idx === 1 ? "bg-cyan-400" : "bg-emerald-400"}`} />
                              {coin}
                            </div>
                            <span className="font-medium text-white">$1.2M</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1528]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Trusted by teams building the next wave</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-lg font-semibold tracking-wide text-slate-500">
            {partnerLogos.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Core capabilities</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            Every operational layer, in one elegant platform.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-3xl border border-white/10 bg-[#0d1a2e] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.5)] transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-[#111f36]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-lg font-semibold text-violet-200 ring-1 ring-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-4 text-base leading-7 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0c1424]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#101d32] p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.35)]">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="solutions" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              Designed to help teams move faster with more control.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Build a clearer financial workflow with automation, performance insights, and investor-ready reporting that stays aligned with your goals.
            </p>

            <div className="mt-8 space-y-5">
              {workflow.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-[#0e1a2e] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <p className="flex items-center text-base text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0f1b31] to-[#0a1220] p-5 shadow-[0_25px_60px_rgba(15,23,42,0.6)]">
            <div className="rounded-[24px] border border-white/10 bg-[#0d1729] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Operations overview</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Q3 performance</h3>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                  +22.7%
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-300">
                    <span>Capital deployed</span>
                    <span>76%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800">
                    <div className="h-2.5 w-[76%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-300">
                    <span>Reward efficiency</span>
                    <span>91%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800">
                    <div className="h-2.5 w-[91%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                  </div>
                </div>

                <div className="grid gap-4 pt-4 sm:grid-cols-3">
                  {[
                    ["Active pools", "12"],
                    ["Liquidity", "$3.2M"],
                    ["Payouts", "91%"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-[#101d32] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-[#0b1424] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Customer stories</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              Trusted by teams that expect performance and clarity.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.author} className="rounded-3xl border border-white/10 bg-[#0e1b2d] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.45)]">
                <div className="mb-5 flex gap-1 text-violet-300" aria-label="5 star review">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
                <p className="text-lg leading-8 text-slate-200">“{item.quote}”</p>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-semibold text-white">{item.author}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">Simple pricing</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            Flexible plans for every stage of growth.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border p-6 shadow-[0_14px_40px_rgba(15,23,42,0.38)] ${plan.highlighted
                ? "border-violet-400/60 bg-gradient-to-b from-violet-500/15 to-[#121f36]"
                : "border-white/10 bg-[#0d1a2e]"
                }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-white">{plan.name}</p>
                {plan.highlighted && (
                  <span className="rounded-full bg-violet-500/20 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.15em] text-violet-200">
                    Popular
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-[-0.05em] text-white">{plan.price}</span>
                {plan.price !== "Custom" && <span className="pb-1 text-slate-400">/mo</span>}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] ${plan.highlighted
                  ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20 hover:-translate-y-0.5"
                  : "border border-white/10 bg-white/5 text-slate-100 hover:border-violet-400/50 hover:bg-violet-500/10"
                  }`}
              >
                {plan.price === "Custom" ? "Talk to sales" : "Choose plan"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-[#0c1424] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Need answers?</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              Frequently asked questions.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-white/10 bg-[#0f1d32] p-5 text-left open:border-violet-400/50" open={faq.question === "How quickly can we launch?"}>
                <summary className="cursor-pointer list-none text-lg font-medium text-white marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-violet-300 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-violet-400/30 bg-gradient-to-r from-violet-600/20 via-[#142642] to-cyan-500/10 p-8 text-center shadow-[0_20px_60px_rgba(109,40,217,0.2)] sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Ready to go live?</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Put your operations on a smarter track.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Launch better treasury movement, clearer insights, and stronger investor confidence with a platform built to scale with you.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
            >
              Book a demo
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-violet-400/50 hover:bg-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#07111f]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-violet-400 to-cyan-400 shadow-lg shadow-violet-500/30">
              <Image src="/logo.png" alt="stakepro logo" width={22} height={22} className="rounded-lg" unoptimized />
            </span>
            <span className="text-lg font-semibold text-white">stakepro</span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <Link href="#" className="transition hover:text-white">Platform</Link>
            <Link href="#" className="transition hover:text-white">Solutions</Link>
            <Link href="#" className="transition hover:text-white">Pricing</Link>
            <Link href="#" className="transition hover:text-white">Support</Link>
          </div>

          <p className="text-sm text-slate-400">© 2026 stakepro. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

