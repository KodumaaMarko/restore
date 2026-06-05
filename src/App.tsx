import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Send,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  Building2,
  Trees,
  Home,
  Store,
  Factory,
  Warehouse,
  Wrench,
  Sparkles,
  Zap,
  ClipboardCheck,
  Puzzle,
  ShieldCheck,
  Gift,
  Banknote,
  Landmark,
  Plane,
  RefreshCcw,
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// BRAND CONSTANTS
// ============================================================================

const PHONE_DISPLAY = '+372 56 330 897';
const PHONE_TEL = '+37256330897';
const EMAIL = 'info@restore.ee';
const WHATSAPP_TEXT = 'Tere! Soovin saada pakkumist oma kinnisvarale.';
const WHATSAPP_URL = `https://wa.me/37256330897?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const IMG = {
  hero: '/restore_capital_1.jpg',
  about: '/restore_capital_2.jpg',
};

type PropertyType = {
  key: string;
  label: string;
  desc: string;
  photo: string;
  alt: string;
  Icon: LucideIcon;
};

const PROPERTY_TYPES: PropertyType[] = [
  {
    key: 'korter',
    label: 'Korterid',
    desc: 'Ostame kortereid igas seisukorras üle Eesti.',
    photo: '/restore_capital_3.jpg',
    alt: 'Korter linnas',
    Icon: Building2,
  },
  {
    key: 'eramu',
    label: 'Eramud',
    desc: 'Ostame eramuid, ridaelamuid ja maju.',
    photo: '/restore_capital_4.jpg',
    alt: 'Eramu',
    Icon: Home,
  },
  {
    key: 'suvila',
    label: 'Suvilad',
    desc: 'Ostame suvilaid ja aiamaju üle Eesti.',
    photo: '/restore_capital_5.jpg',
    alt: 'Suvila aias',
    Icon: Trees,
  },
  {
    key: 'buruohoone',
    label: 'Büroohooned',
    desc: 'Ostame äri- ja büroopindu.',
    photo: '/restore_capital_6.jpg',
    alt: 'Büroopinnad',
    Icon: Store,
  },
  {
    key: 'laohoone',
    label: 'Laohooned',
    desc: 'Ostame laoruume ja logistikakinnisvara.',
    photo: '/restore_capital_7.jpg',
    alt: 'Laohoone',
    Icon: Warehouse,
  },
  {
    key: 'tootmishoone',
    label: 'Tootmishooned',
    desc: 'Ostame tootmis- ja tööstuskinnisvara.',
    photo: '/restore_capital_8.jpg',
    alt: 'Tootmishoone',
    Icon: Factory,
  },
  {
    key: 'arendusmaa',
    label: 'Arendusmaa',
    desc: 'Ostame arenduspotentsiaaliga krunte ja maad.',
    photo: '/restore_capital_9.jpg',
    alt: 'Arendusmaa',
    Icon: Landmark,
  },
  {
    key: 'probleemne',
    label: 'Probleemne kinnisvara',
    desc: 'Leiame lahendusi seal, kus teised loobuvad.',
    photo: '/restore_capital_10.jpg',
    alt: 'Probleemne kinnisvara',
    Icon: Sparkles,
  },
];

const FORM_PROPERTY_OPTIONS = ['Korter', 'Eramu', 'Suvila', 'Büroohoone', 'Laohoone', 'Tootmishoone', 'Arendusprojekt', 'Muu'];

const REASONS: { title: string; desc: string; Icon: LucideIcon }[] = [
  { title: 'Kiire pakkumine', desc: 'Vastame kiiresti ja liigume edasi ilma venitamata.', Icon: Zap },
  { title: 'Lihtne asjaajamine', desc: 'Aitame kogu protsessiga algusest lõpuni.', Icon: ClipboardCheck },
  { title: 'Ostame ka keerulisi', desc: 'Leiame lahenduse ka dokumentatsiooni- ja muude probleemidega kinnisvaradele.', Icon: Puzzle },
  { title: 'Usaldusväärne partner', desc: 'Aus ja professionaalne suhtlus igas etapis.', Icon: ShieldCheck },
];

const PERSONAS: { title: string; desc: string; Icon: LucideIcon }[] = [
  { title: 'Päritatud kinnisvara', desc: 'Said korteri, maja või muu vara päranduseks.', Icon: Gift },
  { title: 'Kiire rahavajadus', desc: 'Soovid kinnisvara kiiresti realiseerida.', Icon: Banknote },
  { title: 'Hüpoteek või võlad', desc: 'Kinnisvaraga seotud kohustused vajavad lahendust.', Icon: Landmark },
  { title: 'Kolimine välismaale', desc: 'Soovid müüa ilma liigse asjaajamiseta.', Icon: Plane },
  { title: 'Kinnisvara vajab remonti', desc: 'Remont on suur investeering ja müük tundub lihtsam.', Icon: Wrench },
  { title: 'Tavamüük ei õnnestunud', desc: 'Kinnisvara on pikalt müügis olnud ilma tulemuseta.', Icon: RefreshCcw },
];

const STEPS: { title: string; desc: string }[] = [
  { title: 'Saada päring', desc: 'Täida vorm või kirjuta meile WhatsAppis.' },
  { title: 'Võtame ühendust', desc: 'Meie tiim võtab Sinuga ühendust 24 tunni jooksul.' },
  { title: 'Hindame kinnisvara', desc: 'Analüüsime kinnisvara võimalusi ja turuväärtust.' },
  { title: 'Teeme pakkumise', desc: 'Esitame konkreetse ja läbipaistva pakkumise.' },
  { title: 'Tehing notaribüroos', desc: 'Vormistame tehingu kiiresti ja professionaalselt.' },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// ============================================================================
// PRIMITIVES
// ============================================================================

const WhatsAppGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.5 2.1 7.9L.3 31.6l7.9-2.1c2.3 1.3 5 1.9 7.8 1.9 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.2c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.7 1.2 1.3-4.6-.3-.5C3.4 20.9 2.7 18.5 2.7 16 2.7 8.7 8.7 2.7 16 2.7S29.3 8.7 29.3 16 23.3 28.6 16 28.6zm7.4-9.9c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.3-2-1.2-1.1-2-2.4-2.3-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7s-.9-2.1-1.2-2.9c-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.1-.3-.2-.7-.4z" />
  </svg>
);

const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  key?: string | number;
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
};

const SectionHeading = ({
  eyebrow,
  title,
  intro,
  align = 'center',
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}) => (
  <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
    {eyebrow && (
      <span
        className={`inline-block text-xs font-semibold uppercase tracking-[0.22em] ${
          dark ? 'text-accent' : 'text-accent'
        }`}
      >
        {eyebrow}
      </span>
    )}
    <h2
      className={`mt-3 text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-[2.75rem] ${
        dark ? 'text-white' : 'text-primary'
      }`}
    >
      {title}
    </h2>
    {intro && (
      <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-white/80' : 'text-muted'}`}>
        {intro}
      </p>
    )}
  </div>
);

const scrollToForm = () => {
  document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ============================================================================
// NAVIGATION
// ============================================================================

const NAV_LINKS = [
  { label: 'Mida ostame', target: 'ostame' },
  { label: 'Miks meie', target: 'miks' },
  { label: 'Protsess', target: 'protsess' },
  { label: 'Meist', target: 'meist' },
];

const Logo = ({ onDark = false }: { onDark?: boolean }) => (
  <a href="#top" className="group flex items-center gap-2.5" aria-label="Restore Capital avaleht">
    <span className="font-display text-[15px] font-extrabold uppercase leading-[0.92] tracking-tight">
      <span className={`block ${onDark ? 'text-white' : 'text-primary'}`}>Restore</span>
      <span className="block text-accent">Capital</span>
    </span>
  </a>
);

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (target: string) => {
    setOpen(false);
    setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 120);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-xl border border-line p-2 text-primary transition-colors hover:bg-surface md:hidden"
        aria-label="Ava menüü"
      >
        <Menu size={22} />
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[80] bg-primary/97 backdrop-blur-xl md:hidden"
              >
                <div className="flex items-center justify-between px-6 py-5">
                  <Logo onDark />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Sulge menüü"
                  >
                    <X size={26} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 px-6 pt-6">
                  {NAV_LINKS.map((link, i) => (
                    <motion.button
                      key={link.target}
                      type="button"
                      onClick={() => go(link.target)}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i + 0.08, ease: EASE_OUT, duration: 0.45 }}
                      className="border-b border-white/10 py-4 text-left font-display text-2xl font-bold text-white"
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-8 flex flex-col gap-3 px-6">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setTimeout(scrollToForm, 120);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-semibold text-white transition-transform active:scale-[0.98]"
                  >
                    Küsi pakkumist <ArrowRight size={18} />
                  </button>
                  <a
                    href={WHATSAPP_URL}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-4 font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <WhatsAppGlyph className="h-5 w-5" /> Kirjuta WhatsAppis
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
      <Logo />
      <nav className="hidden items-center gap-9 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.target}
            href={`#${link.target}`}
            className="text-sm font-semibold text-muted transition-colors hover:text-primary"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <a
          href={`tel:${PHONE_TEL}`}
          className="hidden items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent lg:inline-flex"
        >
          <Phone size={16} /> {PHONE_DISPLAY}
        </a>
        <button
          type="button"
          onClick={scrollToForm}
          className="hidden items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98] md:inline-flex"
        >
          Küsi pakkumist
        </button>
        <MobileMenu />
      </div>
    </div>
  </header>
);

// ============================================================================
// INQUIRY FORM
// ============================================================================

const fieldClass =
  'w-full rounded-xl border border-line bg-canvas px-4 py-3 text-ink placeholder:text-muted/70 outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/15';

const InquiryForm = () => {
  const [form, setForm] = useState({
    propertyType: '',
    address: '',
    name: '',
    phone: '',
    email: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    form.propertyType && form.name.trim() && form.phone.trim() && form.email.trim() && !submitting;

  const update = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const body = new URLSearchParams({
        'form-name': 'kinnisvara-paring',
        'bot-field': '',
        propertyType: form.propertyType,
        address: form.address,
        name: form.name,
        phone: form.phone,
        email: form.email,
        description: form.description,
      });
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Saatmisel tekkis viga. Palun proovi uuesti või kirjuta meile WhatsAppis.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-canvas p-8 text-center shadow-[0_24px_60px_-30px_rgba(16,24,39,0.4)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
          <CheckCircle2 className="h-9 w-9 text-accent" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-primary">Aitäh päringu eest!</h3>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          Vaatame kinnisvara üle ja võtame Sinuga ühendust kuni 24 tunni jooksul.
        </p>
        <a
          href={WHATSAPP_URL}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3 font-semibold text-primary transition-colors hover:bg-surface"
        >
          <WhatsAppGlyph className="h-5 w-5 text-[#25D366]" /> Kirjuta meile kohe WhatsAppis
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="kinnisvara-paring"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="rounded-2xl border border-line bg-canvas p-6 shadow-[0_28px_70px_-32px_rgba(16,24,39,0.5)] sm:p-7"
    >
      <input type="hidden" name="form-name" value="kinnisvara-paring" />
      <p className="hidden">
        <label>
          Ära täida seda välja: <input name="bot-field" />
        </label>
      </p>

      <h3 className="font-display text-xl font-bold text-primary">Küsi tasuta pakkumist</h3>
      <p className="mt-1 text-sm text-muted">Vastame kuni 24 tunni jooksul.</p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="propertyType" className="mb-1.5 block text-sm font-semibold text-ink">
            Mis tüüpi kinnisvara on? <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <select
              id="propertyType"
              name="propertyType"
              required
              value={form.propertyType}
              onChange={update('propertyType')}
              className={`${fieldClass} appearance-none pr-10 ${form.propertyType ? '' : 'text-muted/70'}`}
            >
              <option value="" disabled>
                Vali kinnisvara tüüp
              </option>
              {FORM_PROPERTY_OPTIONS.map((o) => (
                <option key={o} value={o} className="text-ink">
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-ink">
            Kinnisvara aadress
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={update('address')}
            placeholder="Nt. Tallinn, Mustamäe või täpne aadress"
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
              Nimi <span className="text-accent">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Sinu nimi"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">
              Telefon <span className="text-accent">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={update('phone')}
              placeholder="+372 5XXX XXXX"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
            E-post <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="nimi@email.ee"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-ink">
            Lisainfo <span className="font-normal text-muted">(valikuline)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={update('description')}
            placeholder="Suurus, seisukord, eripärad…"
            className={`${fieldClass} min-h-[88px] resize-none`}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted/40"
        >
          {submitting ? 'Saadan…' : 'Saada päring'}
          {!submitting && <Send size={18} />}
        </button>
        <p className="text-center text-xs text-muted">
          Võtame Teiega ühendust 24 tunni jooksul.
        </p>
      </div>
    </form>
  );
};

// ============================================================================
// HERO
// ============================================================================

const Hero = () => (
  <section id="top" className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={IMG.hero} alt="Eesti kinnisvara — linnamaastik" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/92 via-primary/72 to-primary/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />
    </div>

    <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-28 lg:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="text-white"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
          Kinnisvara kokkuost üle Eesti
        </span>

        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.04] sm:text-5xl lg:text-6xl">
          Müü oma kinnisvara kiiresti ja probleemivabalt
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
          Ostame kortereid, maju, suvilaid, ärikinnisvara ja arendusobjekte üle Eesti.
          Leiame lahenduse ka keerulistes olukordades.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent-hover active:scale-[0.98]"
          >
            Küsi pakkumist <ArrowRight size={20} />
          </button>
          <a
            href={WHATSAPP_URL}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <WhatsAppGlyph className="h-5 w-5" /> Kirjuta WhatsAppis
          </a>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/85 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <span className="font-semibold uppercase tracking-wide text-white/60">Või võta kohe ühendust</span>
          <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 hover:text-white">
            <Phone size={16} className="text-accent" /> {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-white">
            <Mail size={16} className="text-accent" /> {EMAIL}
          </a>
        </div>
      </motion.div>

      <motion.div
        id="kontakt"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.12, ease: EASE_OUT }}
      >
        <InquiryForm />
      </motion.div>
    </div>
  </section>
);

// ============================================================================
// STATS BAND
// ============================================================================

const STATS = [
  { value: '50+', label: 'Analüüsitud kinnisvara' },
  { value: '2M+ EUR', label: 'Tehingute maht' },
  { value: '24h', label: 'Keskmine reageerimisaeg' },
  { value: '100%', label: 'Konfidentsiaalne protsess' },
];

const Stats = () => (
  <section className="border-b border-white/10 bg-primary py-10 md:py-14">
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div>
              <p className="font-display text-3xl font-extrabold text-accent lg:text-4xl">{s.value}</p>
              <p className="mt-1.5 text-sm text-white/65">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// PROPERTY TYPES — "Mida me ostame?"
// ============================================================================

const PropertyTypes = () => (
  <section id="ostame" className="bg-canvas px-5 py-20 md:px-8 md:py-28">
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <SectionHeading
          eyebrow="Mida me ostame"
          title="Millist kinnisvara me ostame?"
          intro="Ostame kinnistuid üle kogu Eesti — igas suuruses ja igas seisukorras."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROPERTY_TYPES.map((t, i) => (
          <Reveal key={t.key} delay={(i % 4) * 0.07}>
            <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-canvas">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={t.photo}
                  alt={t.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/55 to-transparent" />
                <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-canvas/95 text-primary shadow-sm backdrop-blur">
                  <t.Icon size={20} strokeWidth={2} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-primary">{t.label}</h3>
                <p className="mt-1.5 text-muted">{t.desc}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// WHY US — "Miks müüa meile?"
// ============================================================================

const WhyUs = () => (
  <section id="miks" className="bg-surface px-5 py-20 md:px-8 md:py-28">
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <SectionHeading
          eyebrow="Miks meie"
          title="Miks valida Restore Capital?"
          intro="Näeme võimalusi seal, kus teised näevad probleeme."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((r, i) => (
          <Reveal key={r.title} delay={(i % 4) * 0.07} className="h-full">
            <div className="flex h-full flex-col gap-4 bg-canvas p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <r.Icon size={22} strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg font-bold text-primary">{r.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{r.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// PERSONAS — "Kas tunned ennast ära?"
// ============================================================================

const Personas = () => (
  <section className="bg-canvas px-5 py-20 md:px-8 md:py-28">
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <SectionHeading
          eyebrow="Kellele me lahendust pakume"
          title="Kas tunned ennast ära?"
          intro="Meie poole pöörduvad sageli inimesed, kes on ühes neist olukordadest."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.07}>
            <div className="flex h-full items-start gap-4 rounded-2xl border border-line bg-canvas p-6 transition-colors hover:border-accent/50">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
                <p.Icon size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-primary">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// PROCESS — "Kuidas see toimib?"
// ============================================================================

const Process = () => (
  <section id="protsess" className="bg-surface px-5 py-20 md:px-8 md:py-28">
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <SectionHeading eyebrow="Kuidas see toimib" title="Kuidas müügiprotsess käib?" />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:items-center lg:text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-display text-xl font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-primary">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// ABOUT — "Kes me oleme?"
// ============================================================================

const About = () => (
  <section id="meist" className="bg-canvas px-5 py-20 md:px-8 md:py-28">
    <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal className="order-2 lg:order-1">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={IMG.about}
            alt="Restore Capital — investeerime Eesti kinnisvarasse"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-primary/10" />
        </div>
      </Reveal>

      <Reveal delay={0.1} className="order-1 lg:order-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Restore Capitalist</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-primary sm:text-4xl">
          Investorid, kes usuvad Eesti kinnisvarasse
        </h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            Restore Capital on Eesti kinnisvarale keskendunud varahaldus- ja investeerimisettevõte.
            Meie taga seisab investorite, ettevõtjate ja kinnisvaraekspertide kogukond, kelle
            eesmärk on luua väärtust renoveerimise, arendamise ja nutikate investeeringute kaudu.
          </p>
          <p>
            Usume, et Eesti kinnisvara ees on tugev tulevik — ja soovime aidata muuta Eesti
            kinnisvara paremaks, ilusamaks ja väärtuslikumaks. Leiame lahendusi seal, kus teised
            näevad takistusi.
          </p>
        </div>
        <p className="mt-6 font-display text-xl font-bold text-primary">
          Me ei otsi ainult häid tehinguid. Me otsime võimalusi luua väärtust.
        </p>
      </Reveal>
    </div>
  </section>
);

// ============================================================================
// FINAL CTA
// ============================================================================

const FinalCta = () => (
  <section className="relative overflow-hidden bg-primary px-5 py-20 md:px-8 md:py-28">
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
    <Reveal className="relative mx-auto max-w-3xl text-center">
      <h2 className="font-display text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
        Soovid oma kinnisvara müüa?
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
        Saada meile kinnisvara andmed ja teeme pakkumise kuni 24 tunni jooksul.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={scrollToForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98]"
        >
          Küsi pakkumist <ArrowRight size={20} />
        </button>
        <a
          href={WHATSAPP_URL}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
        >
          <WhatsAppGlyph className="h-5 w-5" /> Kirjuta WhatsAppis
        </a>
      </div>
    </Reveal>
  </section>
);

// ============================================================================
// FOOTER
// ============================================================================

const Footer = () => (
  <footer className="bg-primary-hover px-5 pb-12 pt-16 text-white md:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Kinnisvara kokkuost ja investeerimine üle Eesti. Taastame väärtust.
          </p>
          <p className="mt-4 text-sm text-white/50">L.T Estate OÜ</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Kontakt</h4>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-3 hover:text-white">
              <Phone size={16} className="text-accent" /> {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 hover:text-white">
              <Mail size={16} className="text-accent" /> {EMAIL}
            </a>
            <a href={WHATSAPP_URL} className="inline-flex items-center gap-3 hover:text-white">
              <WhatsAppGlyph className="h-4 w-4 text-accent" /> WhatsApp
            </a>
            <span className="inline-flex items-center gap-3 text-white/60">
              <MapPin size={16} className="text-accent" /> Eesti
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Mida ostame</h4>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80">
            {PROPERTY_TYPES.map((t) => (
              <a key={t.key} href="#ostame" className="hover:text-white">
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
        <p>© {new Date().getFullYear()} Restore Capital · L.T Estate OÜ</p>
        <p>restore.ee</p>
      </div>
    </div>
  </footer>
);

// ============================================================================
// FLOATING ACTIONS
// ============================================================================

const FloatingWhatsApp = () => (
  <a
    href={WHATSAPP_URL}
    aria-label="Kirjuta meile WhatsAppis"
    className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-transform hover:scale-105 active:scale-95 md:flex"
  >
    <WhatsAppGlyph className="h-7 w-7" />
  </a>
);

const MobileContactBar = () => (
  <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-canvas/95 backdrop-blur-md md:hidden">
    <a
      href={`tel:${PHONE_TEL}`}
      className="flex flex-col items-center gap-1 py-2.5 text-xs font-semibold text-primary"
    >
      <Phone size={20} /> Helista
    </a>
    <a
      href={WHATSAPP_URL}
      className="flex flex-col items-center gap-1 border-x border-line py-2.5 text-xs font-semibold text-[#1a8c47]"
    >
      <WhatsAppGlyph className="h-5 w-5" /> WhatsApp
    </a>
    <button
      type="button"
      onClick={scrollToForm}
      className="flex flex-col items-center gap-1 py-2.5 text-xs font-semibold text-primary"
    >
      <Send size={20} /> Pakkumist
    </button>
  </div>
);

// ============================================================================
// APP
// ============================================================================

export default function App() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas pb-[60px] md:pb-0">
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <PropertyTypes />
        <WhyUs />
        <Personas />
        <Process />
        <About />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileContactBar />
    </div>
  );
}
