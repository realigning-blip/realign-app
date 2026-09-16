import React, { useState, useMemo, useEffect } from "react";
import {
  Compass, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Check, X,
  Zap, BatteryLow, MapPin, TrendingUp, Sparkles, GitCompare,
  ChevronRight, RotateCcw, Info, Flag
} from "lucide-react";
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

/* ---------------------------------------------------------------------- */
/* Design tokens (see plan: Dawn Paper / Ink Indigo / Horizon Teal /      */
/* Amber Glow / Dusk Plum / Mist — the "horizon" motif from the name      */
/* candidates Purnaksh/Samkshitij/Sakshitij, all built on "Kshitij").     */
/* ---------------------------------------------------------------------- */
const T = {
  paper: "#F6F4EF",
  card: "#FFFFFF",
  ink: "#1F2430",
  inkSoft: "#565C6B",
  teal: "#2F6E63",
  tealSoft: "#E4EEEB",
  amber: "#C9860B",
  amberSoft: "#FBF0DC",
  plum: "#6B4E71",
  plumSoft: "#EFE7F0",
  mist: "#DEE2DC",
  danger: "#B4472F",
};

const FONT_IMPORT_ID = "realign-font-import";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const display = { fontFamily: "'Fraunces', serif" };
const body = { fontFamily: "'Inter', sans-serif" };

/* ---------------------------------------------------------------------- */
/* Data: Interest deck (tools/activities — card sort, per spec) + fields  */
/* ---------------------------------------------------------------------- */
const TOOL_CARDS = [
  { id: "designing", label: "Designing something", blurb: "Sketching, arranging, shaping how things look or work" },
  { id: "building", label: "Building or fixing things", blurb: "Working with your hands, tools, or machines" },
  { id: "coding", label: "Coding or automating", blurb: "Writing instructions for a computer to follow" },
  { id: "writing", label: "Writing or storytelling", blurb: "Putting ideas into words that others will read" },
  { id: "organizing", label: "Organizing & planning", blurb: "Bringing order to a messy process or project" },
  { id: "investigating", label: "Investigating a problem", blurb: "Digging until you find out why something happens" },
  { id: "teaching", label: "Teaching or explaining", blurb: "Helping someone else understand something" },
  { id: "helping", label: "Helping people directly", blurb: "Being there for someone who needs support" },
  { id: "analyzing_data", label: "Working with numbers & data", blurb: "Spotting patterns hiding inside information" },
  { id: "oration", label: "Speaking or persuading", blurb: "Getting an idea across to a room of people" },
];

const SUBJECT_OPTIONS = [
  { id: "math", label: "Mathematics" },
  { id: "science", label: "Science" },
  { id: "biology", label: "Biology" },
  { id: "physics", label: "Physics" },
  { id: "history", label: "History" },
  { id: "geography", label: "Geography" },
  { id: "art", label: "Art" },
  { id: "economics", label: "Economics" },
];

const PRIORITY_DEFS = [
  { id: "income", label: "Income potential", hint: "How much this career tends to pay" },
  { id: "stability", label: "Job stability", hint: "How steady and secure the path tends to be" },
  { id: "passion", label: "Fit with my interests", hint: "How closely it matches what you picked" },
  { id: "distance", label: "Close to home", hint: "Whether it's realistically available near you, not only in big cities" },
];

/* ---------------------------------------------------------------------- */
/* Data: mock careers (Sectors 1, 2, 3, 6, 8 — MVP-priority per            */
/* demand-deconstruction-v0.md). Real build sources these from the        */
/* regulated pipeline; here they're illustrative fixtures.                */
/* ---------------------------------------------------------------------- */
const CAREERS = [
  {
    id: "renewable-energy-tech",
    name: "Renewable energy technician",
    sector: "Energy, environment & climate",
    tags: ["building", "investigating", "physics", "math"],
    income: { median: 4.5, p90: 9, thin: false, experience: "Typical experience for top earners: 15+ years" },
    stability: 78, distance: 85,
    geo: "Tier 2–3 available",
    confidence: "Strong evidence",
    strengths: "Hands-on, practical work with a clear, visible result — you can point at what you built.",
    tradeoffs: "Physically demanding at times, and pay grows mainly with certifications and experience, not fast promotions.",
    skills: ["Solar/wind installation basics", "Electrical safety", "Troubleshooting", "Grid systems literacy"],
    why: "You leaned toward building things and investigating how systems work, with a pull toward physics and maths.",
    dev: "As the energy mix shifts toward non-fossil sources, technician demand grows fastest outside big cities, where microgrids and rooftop solar are expanding first.",
    sus: "Directly tied to the climate transition — the work itself reduces reliance on fossil fuels, not just a side benefit of the paycheck.",
  },
  {
    id: "agritech-analyst",
    name: "Agri-tech data analyst",
    sector: "Agriculture & food security",
    tags: ["analyzing_data", "investigating", "math", "geography"],
    income: { median: 6, p90: 14, thin: false, experience: "Typical experience for top earners: 10+ years" },
    stability: 70, distance: 88,
    geo: "Widely available",
    confidence: "Strong evidence",
    strengths: "Sits at the intersection of two growing fields — you get the stability of agriculture with the upside of tech.",
    tradeoffs: "Still an emerging role in India, so job titles and expectations vary a lot between employers.",
    skills: ["Data analysis", "GIS basics", "Crop science literacy", "Spreadsheets / Python"],
    why: "You picked working with numbers and investigating problems, alongside geography.",
    dev: "As farming becomes more precision-driven, the labour freed from direct farm work increasingly moves into agri-adjacent tech roles like this one.",
    sus: "Better data means less water and fertilizer waste — the role has a direct link to more sustainable farming, not just higher yields.",
  },
  {
    id: "ux-product-designer",
    name: "UX / product designer",
    sector: "Technology & digital infrastructure",
    tags: ["designing", "art", "math", "coding"],
    income: { median: 9, p90: 24, thin: false, experience: "Typical experience for top earners: 12+ years" },
    stability: 60, distance: 55,
    geo: "Metro-weighted, growing elsewhere",
    confidence: "Strong evidence",
    strengths: "A genuine intersection career for people who like both art and structured, logical thinking.",
    tradeoffs: "Competitive to break into, and still concentrated mostly in larger cities for now.",
    skills: ["User research", "Wireframing", "Visual design", "Basic prototyping tools"],
    why: "You liked designing things and picked both art and maths — this career sits right at that intersection.",
    dev: "Every digital product needs this skill, and as more Indian companies build software for Indian users, demand keeps expanding well beyond big tech.",
    sus: "Good design reduces frustration and wasted time for millions of users — a quieter form of human wellbeing than it gets credit for.",
  },
  {
    id: "robotics-ai-engineer",
    name: "Robotics & AI engineer",
    sector: "Technology & digital infrastructure",
    tags: ["coding", "building", "math", "science"],
    income: { median: 12, p90: 35, thin: false, experience: "Typical experience for top earners: 15+ years" },
    stability: 65, distance: 48,
    geo: "Metro-weighted",
    confidence: "Strong evidence",
    strengths: "High ceiling for people who genuinely enjoy hard technical problem-solving.",
    tradeoffs: "Demands continuous learning — the tools and techniques shift every couple of years.",
    skills: ["Programming (Python/C++)", "Machine learning basics", "Robotics fundamentals", "Linear algebra & calculus"],
    why: "You picked coding and building, plus maths and science — a strong technical-track match.",
    dev: "India is building a credible, substantial position in global AI and technology work — this role sits right in that growth path.",
    sus: "Worth weighing honestly: automation and AI research can cut both ways for human wellbeing, depending on what gets built and why.",
  },
  {
    id: "electrician",
    name: "Electrician (skilled trade)",
    sector: "Economy & industry",
    tags: ["building", "helping", "organizing"],
    income: { median: 3.6, p90: 8, thin: false, experience: "Typical experience for top earners: 20+ years, often running their own crew" },
    stability: 85, distance: 95,
    geo: "Widely available",
    confidence: "Strong evidence",
    strengths: "Steady, essential demand everywhere — this work doesn't disappear, and skilled hands are genuinely scarce.",
    tradeoffs: "Physical work, and income growth depends on building a reputation and client base over time, not a fixed ladder.",
    skills: ["Wiring & circuits", "Safety codes", "Tool handling", "Client communication"],
    why: "You leaned toward building/fixing and helping people directly, with a preference for organizing your own work.",
    dev: "As visibility into skilled-trade pay grows, wages for previously undervalued trades like this one should rise on their own merit, not through any single policy push.",
    sus: "Skilled trades carry real dignity of labour — the work itself is honest and necessary, not a fallback option.",
  },
  {
    id: "urban-infra-planner",
    name: "Urban & infrastructure planner",
    sector: "Infrastructure, housing & urban-rural balance",
    tags: ["organizing", "investigating", "geography", "math"],
    income: { median: 7, p90: 16, thin: true, experience: "Limited data — experience curve not yet well-sourced" },
    stability: 72, distance: 78,
    geo: "Tier 2–3 available",
    confidence: "Limited data — treat as directional",
    strengths: "Directly shapes whether growth reaches smaller towns, not just megacities — genuinely decentralization-relevant work.",
    tradeoffs: "Career paths and pay bands are less standardized in India today than in more established professions.",
    skills: ["Urban planning fundamentals", "GIS", "Public policy basics", "Data presentation"],
    why: "You picked organizing and investigating, alongside geography and maths.",
    dev: "A larger share of genuine opportunity is expected to shift toward tier 2/3 towns — planners are central to making that shift work well, not just theoretically possible.",
    sus: "Good planning directly affects how liveable a town is for the people in it — this is human-flourishing work, not only economic work.",
  },
  {
    id: "industrial-designer",
    name: "Industrial designer",
    sector: "Technology & digital infrastructure (art × maths intersection)",
    tags: ["designing", "building", "art", "math"],
    income: { median: 7.5, p90: 18, thin: false, experience: "Typical experience for top earners: 12+ years" },
    stability: 58, distance: 52,
    geo: "Metro-weighted",
    confidence: "Strong evidence",
    strengths: "A physical-world sibling to UX design — for people who like designing things you can actually hold.",
    tradeoffs: "Manufacturing and materials knowledge take time to build, and studio roles cluster in a handful of cities.",
    skills: ["3D modeling / CAD", "Material science basics", "Sketching", "Manufacturing literacy"],
    why: "You liked designing and building things, and picked both art and maths.",
    dev: "As India's manufacturing sector grows in sophistication, product design becomes a differentiator, not just an afterthought.",
    sus: "Thoughtful product design reduces material waste over a product's life — a quieter sustainability lever than it's usually given credit for.",
  },
  {
    id: "agri-supply-chain",
    name: "Agri supply chain & logistics analyst",
    sector: "Economy & industry / agriculture",
    tags: ["organizing", "analyzing_data", "math", "geography"],
    income: { median: 5.5, p90: 12, thin: false, experience: "Typical experience for top earners: 10+ years" },
    stability: 75, distance: 82,
    geo: "Widely available",
    confidence: "Strong evidence",
    strengths: "Practical, in-demand work connecting farms to markets — genuinely needed almost everywhere in India.",
    tradeoffs: "Can involve irregular hours around harvest seasons and transport schedules.",
    skills: ["Logistics planning", "Data analysis", "Supply chain software", "Negotiation basics"],
    why: "You picked organizing and working with data, alongside maths and geography.",
    dev: "As food security scales with fewer people farming directly, moving what's grown efficiently to market becomes a bigger, better-paid problem to solve.",
    sus: "Less wastage between farm and market means more food actually reaches people — a direct line to food security, not just business efficiency.",
  },
];

const CURIOSITY_FACTS = [
  { sector: "Energy", fact: "A single wind technician can service turbines powering thousands of homes — but most of India's wind-service jobs are in small towns near the turbines, not big cities." },
  { sector: "Agriculture", fact: "India's precision-farming sector is growing fast enough that 'agri-fintech' — lending decisions based on real-time crop data — is becoming its own career track." },
  { sector: "Technology", fact: "Not every tech career needs deep specialization — 'AI-literate professional in any field' will likely be a far more common job description than 'ML researcher.'" },
  { sector: "Infrastructure", fact: "Urban planners increasingly use the same GIS tools as agri-tech analysts — the same underlying skill shows up in very different careers." },
  { sector: "Trades", fact: "As pay transparency improves, several skilled trades are quietly becoming better-paid than some office jobs — just less visible in career conversations." },
];

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */
function logNormalCurve(median, p90, points = 36) {
  const mu = Math.log(median);
  // solve sigma from p90: p90 = exp(mu + sigma * 1.2816)
  const sigma = Math.max(0.15, (Math.log(p90) - mu) / 1.2816);
  const maxX = p90 * 2.1;
  const data = [];
  for (let i = 0; i <= points; i++) {
    const x = (maxX / points) * i + 0.05;
    const density =
      (1 / (x * sigma * Math.sqrt(2 * Math.PI))) *
      Math.exp(-((Math.log(x) - mu) ** 2) / (2 * sigma * sigma));
    data.push({ income: Math.round(x * 10) / 10, density: Math.round(density * 1000) / 1000 });
  }
  return data;
}

function normalize(val, max) {
  return max > 0 ? Math.min(100, (val / max) * 100) : 0;
}

function computeScores(selectedTags, priorityOrder) {
  const weights = [4, 3, 2, 1];
  const maxIncomeMedian = Math.max(...CAREERS.map((c) => c.income.median));
  return CAREERS.map((career) => {
    const overlap = career.tags.filter((t) => selectedTags.has(t)).length;
    const fit = career.tags.length ? (overlap / career.tags.length) * 100 : 0;
    const dims = {
      income: normalize(career.income.median, maxIncomeMedian),
      stability: career.stability,
      passion: fit,
      distance: career.distance,
    };
    let score = 0;
    priorityOrder.forEach((pid, idx) => {
      score += (weights[idx] || 0) * dims[pid];
    });
    return { career, score, overlap, fit };
  });
}

/* ---------------------------------------------------------------------- */
/* Small shared UI bits                                                   */
/* ---------------------------------------------------------------------- */
function HorizonBar({ fraction }) {
  return (
    <div style={{ height: 4, width: "100%", background: T.mist, borderRadius: 4, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${Math.min(100, Math.max(4, fraction * 100))}%`,
          background: `linear-gradient(90deg, ${T.plum}, ${T.amber}, ${T.teal})`,
          transition: "width 400ms ease",
        }}
      />
    </div>
  );
}

function Pill({ children, tone = "mist", small }) {
  const tones = {
    mist: { bg: T.mist, fg: T.inkSoft },
    teal: { bg: T.tealSoft, fg: T.teal },
    amber: { bg: T.amberSoft, fg: T.amber },
    plum: { bg: T.plumSoft, fg: T.plum },
  };
  const c = tones[tone] || tones.mist;
  return (
    <span
      style={{
        ...body,
        background: c.bg,
        color: c.fg,
        fontSize: small ? 11 : 12.5,
        fontWeight: 600,
        padding: small ? "3px 8px" : "4px 10px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Button({ children, onClick, variant = "primary", style: sx = {}, disabled }) {
  const base = {
    ...body,
    fontWeight: 600,
    fontSize: 14,
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    opacity: disabled ? 0.5 : 1,
    transition: "transform 120ms ease, opacity 120ms ease",
  };
  const variants = {
    primary: { background: T.teal, color: "#fff" },
    ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.mist}` },
    subtle: { background: T.tealSoft, color: T.teal },
    danger: { background: "transparent", color: T.danger, border: `1px solid ${T.danger}33` },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...sx }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

function Card({ children, style: sx = {} }) {
  return (
    <div
      style={{
        background: T.card,
        borderRadius: 16,
        border: `1px solid ${T.mist}`,
        padding: 20,
        ...sx,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Income distribution chart                                              */
/* ---------------------------------------------------------------------- */
function IncomeCurve({ career, bracket }) {
  const data = useMemo(() => logNormalCurve(career.income.median, career.income.p90), [career]);
  const thin = career.income.thin;
  const simple = bracket === "11-14";

  return (
    <div>
      <div style={{ height: 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${career.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.teal} stopOpacity={0.35} />
                <stop offset="100%" stopColor={T.teal} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="density"
              stroke={T.teal}
              strokeWidth={2}
              strokeDasharray={thin ? "5 4" : undefined}
              fill={`url(#grad-${career.id})`}
            />
            {!simple && (
              <XAxis
                dataKey="income"
                tickFormatter={(v) => `₹${v}L`}
                tick={{ fontSize: 10, fill: T.inkSoft }}
                axisLine={{ stroke: T.mist }}
                tickLine={false}
                interval={Math.floor(data.length / 4)}
              />
            )}
            <Tooltip
              formatter={() => null}
              labelFormatter={(v) => `₹${v} LPA`}
              contentStyle={{ display: simple ? "none" : "block", fontSize: 11, borderRadius: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {simple ? (
        <div style={{ ...body, fontSize: 12.5, color: T.inkSoft, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span>↑ Most people earn around here</span>
          <span>A few reach much higher →</span>
        </div>
      ) : (
        <div style={{ ...body, fontSize: 12.5, color: T.inkSoft, marginTop: 4 }}>
          {career.income.experience}
        </div>
      )}
      {thin && (
        <div style={{ ...body, fontSize: 11.5, color: T.amber, marginTop: 4, fontWeight: 600 }}>
          Limited data — treat this curve as directional, not precise.
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Screens                                                                 */
/* ---------------------------------------------------------------------- */
function Welcome({ onStart }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 16px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.teal, marginBottom: 18 }}>
        <Compass size={20} />
        <span style={{ ...body, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
          Career exploration
        </span>
      </div>
      <h1 style={{ ...display, fontSize: 34, fontWeight: 600, color: T.ink, margin: "0 0 14px", lineHeight: 1.15 }}>
        Discover who you are,<br />before you decide what to become.
      </h1>
      <p style={{ ...body, fontSize: 15.5, color: T.inkSoft, maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.6 }}>
        A few honest questions about what you enjoy and what matters to you —
        then a small set of real career possibilities, explained without the noise.
      </p>
      <Button onClick={onStart} style={{ padding: "13px 26px", fontSize: 15 }}>
        Begin <ArrowRight size={16} />
      </Button>
      <p style={{ ...body, fontSize: 12.5, color: T.inkSoft, marginTop: 18 }}>
        Takes about 5 minutes. Nothing here decides your future for you.
      </p>
    </div>
  );
}

function AgeCheck({ onPick }) {
  return (
    <div style={{ padding: "24px 4px" }}>
      <h2 style={{ ...display, fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 8 }}>
        Which of these is closer to you?
      </h2>
      <p style={{ ...body, fontSize: 14, color: T.inkSoft, marginBottom: 24 }}>
        This just tunes how we ask questions — nothing else changes.
      </p>
      <div style={{ display: "grid", gap: 12 }}>
        {[
          { id: "11-14", label: "I'm 11 to 14", sub: "Simpler questions, plain-language results" },
          { id: "15-18", label: "I'm 15 to 18", sub: "Fuller detail, including numbers" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onPick(opt.id)}
            style={{
              ...body,
              textAlign: "left",
              background: T.card,
              border: `1px solid ${T.mist}`,
              borderRadius: 14,
              padding: "18px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 15.5, color: T.ink }}>{opt.label}</div>
              <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 2 }}>{opt.sub}</div>
            </div>
            <ChevronRight size={18} color={T.inkSoft} />
          </button>
        ))}
      </div>
    </div>
  );
}

function InterestDeck({ liked, setLiked, energy, setEnergy, onDone }) {
  const [idx, setIdx] = useState(0);
  const card = TOOL_CARDS[idx];
  const finished = idx >= TOOL_CARDS.length;

  function choose(likeIt) {
    if (likeIt) {
      setLiked((prev) => new Set(prev).add(card.id));
    }
    setIdx((i) => i + 1);
  }

  function setEnergyFor(val) {
    setEnergy((prev) => ({ ...prev, [card.id]: val }));
    setIdx((i) => i + 1);
  }

  if (finished) {
    return (
      <div style={{ textAlign: "center", padding: "40px 8px" }}>
        <Check size={28} color={T.teal} style={{ marginBottom: 10 }} />
        <p style={{ ...body, fontSize: 14.5, color: T.inkSoft, marginBottom: 20 }}>
          You picked {liked.size} thing{liked.size === 1 ? "" : "s"} you'd enjoy doing.
        </p>
        <Button onClick={onDone}>Next: pick your subjects <ArrowRight size={15} /></Button>
      </div>
    );
  }

  const justLiked = liked.has(card.id) && energy[card.id] === undefined;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ ...body, fontSize: 12.5, color: T.inkSoft }}>Card {idx + 1} of {TOOL_CARDS.length}</span>
        <span style={{ ...body, fontSize: 12.5, color: T.inkSoft }}>{liked.size} liked</span>
      </div>
      <Card style={{ minHeight: 190, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        {!justLiked ? (
          <>
            <div style={{ ...display, fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ ...body, fontSize: 13.5, color: T.inkSoft }}>{card.blurb}</div>
          </>
        ) : (
          <>
            <div style={{ ...body, fontSize: 13.5, color: T.inkSoft, marginBottom: 14 }}>
              After doing that — how do you usually feel?
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setEnergyFor("energized")}
                style={{ ...body, background: T.amberSoft, color: T.amber, border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 600, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Zap size={15} /> Energized
              </button>
              <button
                onClick={() => setEnergyFor("drained")}
                style={{ ...body, background: T.mist, color: T.inkSoft, border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 600, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <BatteryLow size={15} /> Drained
              </button>
            </div>
          </>
        )}
      </Card>
      {!justLiked && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Button variant="ghost" onClick={() => choose(false)} style={{ flex: 1, justifyContent: "center" }}>
            <X size={15} /> Not for me
          </Button>
          <Button onClick={() => choose(true)} style={{ flex: 1, justifyContent: "center" }}>
            <Check size={15} /> I'd enjoy this
          </Button>
        </div>
      )}
    </div>
  );
}

function SubjectPicker({ selected, setSelected, onDone }) {
  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  return (
    <div>
      <h2 style={{ ...display, fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 6 }}>
        Which subjects pull you in?
      </h2>
      <p style={{ ...body, fontSize: 13.5, color: T.inkSoft, marginBottom: 18 }}>
        Pick as many as genuinely interest you — marks don't matter here.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {SUBJECT_OPTIONS.map((s) => {
          const active = selected.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              style={{
                ...body,
                fontSize: 13.5,
                fontWeight: 600,
                padding: "9px 15px",
                borderRadius: 999,
                border: `1px solid ${active ? T.teal : T.mist}`,
                background: active ? T.tealSoft : T.card,
                color: active ? T.teal : T.ink,
                cursor: "pointer",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <Button onClick={onDone} disabled={selected.size === 0}>
        Next: set your priorities <ArrowRight size={15} />
      </Button>
    </div>
  );
}

function PriorityRank({ order, setOrder, onDone, doneLabel }) {
  function move(idx, dir) {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
  }
  return (
    <div>
      <h2 style={{ ...display, fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 6 }}>
        Rank what matters most to you
      </h2>
      <p style={{ ...body, fontSize: 13.5, color: T.inkSoft, marginBottom: 18 }}>
        Put these in order, most important first. This is what actually shapes your ranking.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {order.map((pid, idx) => {
          const def = PRIORITY_DEFS.find((p) => p.id === pid);
          return (
            <div
              key={pid}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: T.card,
                border: `1px solid ${T.mist}`,
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  ...display,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: T.tealSoft,
                  color: T.teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...body, fontWeight: 600, fontSize: 14, color: T.ink }}>{def.label}</div>
                <div style={{ ...body, fontSize: 12, color: T.inkSoft }}>{def.hint}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => move(idx, -1)} disabled={idx === 0} style={arrowBtnStyle(idx === 0)}>
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1} style={arrowBtnStyle(idx === order.length - 1)}>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Button onClick={onDone} style={{ marginTop: 20 }}>
        {doneLabel || <>See my recommendations <ArrowRight size={15} /></>}
      </Button>
    </div>
  );
}
function arrowBtnStyle(disabled) {
  return {
    border: `1px solid ${T.mist}`,
    background: disabled ? T.paper : T.card,
    borderRadius: 6,
    width: 22,
    height: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    color: T.inkSoft,
    opacity: disabled ? 0.4 : 1,
  };
}

function RecCard({ result, rank, onOpen, feedback, setFeedback, inCompare, toggleCompare }) {
  const { career } = result;
  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ ...body, fontSize: 11.5, fontWeight: 700, color: T.plum, background: T.plumSoft, borderRadius: 999, padding: "2px 8px" }}>
              #{rank}
            </span>
            <span style={{ ...body, fontSize: 11.5, color: T.inkSoft }}>{career.sector}</span>
          </div>
          <div
            role="button"
            onClick={() => onOpen(career.id)}
            style={{ ...display, fontSize: 18, fontWeight: 600, color: T.ink, cursor: "pointer" }}
          >
            {career.name}
          </div>
        </div>
        <Pill tone={career.confidence.startsWith("Limited") ? "amber" : "teal"} small>
          {career.confidence}
        </Pill>
      </div>

      <p style={{ ...body, fontSize: 13, color: T.inkSoft, margin: "10px 0" }}>{career.why}</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <Pill small>₹{career.income.median}L median</Pill>
        <Pill small>
          <MapPin size={11} /> {career.geo}
        </Pill>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[
          { k: "not_me", label: "Not me", icon: X },
          { k: "maybe", label: "Maybe", icon: Info },
          { k: "love", label: "Love this", icon: Sparkles },
        ].map(({ k, label, icon: Icon }) => {
          const active = feedback[career.id] === k;
          return (
            <button
              key={k}
              onClick={() => setFeedback((prev) => ({ ...prev, [career.id]: k }))}
              style={{
                ...body,
                flex: 1,
                fontSize: 12.5,
                fontWeight: 600,
                border: `1px solid ${active ? T.teal : T.mist}`,
                background: active ? T.tealSoft : "transparent",
                color: active ? T.teal : T.inkSoft,
                borderRadius: 8,
                padding: "7px 0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Icon size={12} /> {label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => onOpen(career.id)}
          style={{ ...body, background: "none", border: "none", color: T.teal, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }}
        >
          See full career page <ChevronRight size={14} />
        </button>
        <button
          onClick={() => toggleCompare(career.id)}
          style={{ ...body, background: "none", border: "none", color: inCompare ? T.teal : T.inkSoft, fontWeight: 600, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
        >
          <GitCompare size={13} /> {inCompare ? "Added to compare" : "Add to compare"}
        </button>
      </div>
    </Card>
  );
}

function Recommendations({
  selectedTags, priorityOrder, setPriorityOrder, onOpenCareer,
  feedback, setFeedback, compareIds, toggleCompare, liked, setLiked,
  subjects, setSubjects,
}) {
  const [playOpen, setPlayOpen] = useState(false);
  const scored = useMemo(() => computeScores(selectedTags, priorityOrder), [selectedTags, priorityOrder]);
  const top = scored
    .filter((r) => feedback[r.career.id] !== "not_me")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  function toggleTag(tag) {
    const isSubject = SUBJECT_OPTIONS.some((s) => s.id === tag);
    if (isSubject) {
      setSubjects((prev) => {
        const next = new Set(prev);
        next.has(tag) ? next.delete(tag) : next.add(tag);
        return next;
      });
    } else {
      setLiked((prev) => {
        const next = new Set(prev);
        next.has(tag) ? next.delete(tag) : next.add(tag);
        return next;
      });
    }
  }

  return (
    <div>
      <h2 style={{ ...display, fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 4 }}>
        Your top {top.length}
      </h2>
      <p style={{ ...body, fontSize: 13.5, color: T.inkSoft, marginBottom: 16 }}>
        Ranked by what you said matters most. Nothing here is a verdict — tap a card to see the full picture.
      </p>

      <button
        onClick={() => setPlayOpen((v) => !v)}
        style={{
          ...body, width: "100%", textAlign: "left", background: T.plumSoft, border: "none",
          borderRadius: 12, padding: "12px 14px", marginBottom: 16, cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13.5, color: T.plum, display: "flex", alignItems: "center", gap: 6 }}>
          <RotateCcw size={14} /> Play with it — adjust interests & priorities live
        </span>
        {playOpen ? <ChevronUp size={16} color={T.plum} /> : <ChevronDown size={16} color={T.plum} />}
      </button>

      {playOpen && (
        <Card style={{ marginBottom: 18, background: T.paper }}>
          <div style={{ ...body, fontSize: 12.5, fontWeight: 700, color: T.inkSoft, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Interests
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {[...TOOL_CARDS.map((c) => ({ id: c.id, label: c.label })), ...SUBJECT_OPTIONS].map((t) => {
              const active = selectedTags.has(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  style={{
                    ...body, fontSize: 12, fontWeight: 600, padding: "6px 11px", borderRadius: 999,
                    border: `1px solid ${active ? T.teal : T.mist}`,
                    background: active ? T.tealSoft : T.card, color: active ? T.teal : T.inkSoft, cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div style={{ ...body, fontSize: 12.5, fontWeight: 700, color: T.inkSoft, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Priorities
          </div>
          <PriorityRank order={priorityOrder} setOrder={setPriorityOrder} onDone={() => setPlayOpen(false)} doneLabel="Done adjusting" />
        </Card>
      )}

      {top.length === 0 && (
        <p style={{ ...body, fontSize: 13.5, color: T.inkSoft }}>
          Nothing matches right now — try adding a few more interests above.
        </p>
      )}

      {top.map((r, i) => (
        <RecCard
          key={r.career.id}
          result={r}
          rank={i + 1}
          onOpen={onOpenCareer}
          feedback={feedback}
          setFeedback={setFeedback}
          inCompare={compareIds.includes(r.career.id)}
          toggleCompare={toggleCompare}
        />
      ))}
    </div>
  );
}

function DualLens({ career }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          ...body, width: "100%", textAlign: "left", background: T.plumSoft, border: "none",
          borderRadius: 12, padding: "12px 14px", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13.5, color: T.plum }}>
          See where we think this is heading (our extrapolation)
        </span>
        {open ? <ChevronUp size={16} color={T.plum} /> : <ChevronDown size={16} color={T.plum} />}
      </button>
      {open && (
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          <div style={{ background: T.tealSoft, borderRadius: 12, padding: 14 }}>
            <div style={{ ...body, fontWeight: 700, fontSize: 12, color: T.teal, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>
              Development lens
            </div>
            <p style={{ ...body, fontSize: 13, color: T.ink, margin: 0, lineHeight: 1.55 }}>{career.dev}</p>
          </div>
          <div style={{ background: T.amberSoft, borderRadius: 12, padding: 14 }}>
            <div style={{ ...body, fontWeight: 700, fontSize: 12, color: T.amber, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>
              Sustainability lens (people & planet)
            </div>
            <p style={{ ...body, fontSize: 13, color: T.ink, margin: 0, lineHeight: 1.55 }}>{career.sus}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CareerDetail({ career, bracket, onBack, inCompare, toggleCompare }) {
  return (
    <div>
      <button onClick={onBack} style={{ ...body, background: "none", border: "none", color: T.inkSoft, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginBottom: 14, padding: 0 }}>
        <ArrowLeft size={14} /> Back to recommendations
      </button>

      <div style={{ ...body, fontSize: 12.5, color: T.inkSoft, marginBottom: 4 }}>{career.sector}</div>
      <h1 style={{ ...display, fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{career.name}</h1>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        <Pill tone={career.confidence.startsWith("Limited") ? "amber" : "teal"}>{career.confidence}</Pill>
        <Pill tone="plum"><MapPin size={12} /> {career.geo}</Pill>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <SectionLabel>Why this showed up for you</SectionLabel>
        <p style={{ ...body, fontSize: 14, color: T.ink, lineHeight: 1.6, margin: "6px 0 0" }}>{career.why}</p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <Card>
          <SectionLabel tone="teal">Strengths for you</SectionLabel>
          <p style={{ ...body, fontSize: 13, color: T.ink, lineHeight: 1.55, margin: "6px 0 0" }}>{career.strengths}</p>
        </Card>
        <Card>
          <SectionLabel tone="amber">Trade-offs, honestly</SectionLabel>
          <p style={{ ...body, fontSize: 13, color: T.ink, lineHeight: 1.55, margin: "6px 0 0" }}>{career.tradeoffs}</p>
        </Card>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <SectionLabel>Income — what people actually earn</SectionLabel>
        <div style={{ marginTop: 8 }}>
          <IncomeCurve career={career} bracket={bracket} />
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <SectionLabel>Skills this leans on</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {career.skills.map((s) => (
            <Pill key={s} small>{s}</Pill>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <DualLens career={career} />
      </Card>

      <Button variant={inCompare ? "subtle" : "ghost"} onClick={() => toggleCompare(career.id)} style={{ width: "100%", justifyContent: "center" }}>
        <GitCompare size={15} /> {inCompare ? "Added to compare" : "Add to compare"}
      </Button>
    </div>
  );
}
function SectionLabel({ children, tone }) {
  const color = tone === "teal" ? T.teal : tone === "amber" ? T.amber : T.inkSoft;
  return (
    <div style={{ ...body, fontSize: 11.5, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {children}
    </div>
  );
}

function Compare({ careers, onBack, onOpenCareer, removeFromCompare }) {
  if (careers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 8px" }}>
        <GitCompare size={24} color={T.inkSoft} style={{ marginBottom: 10 }} />
        <p style={{ ...body, fontSize: 14, color: T.inkSoft, marginBottom: 18 }}>
          Add a couple of careers to compare them side by side.
        </p>
        <Button variant="ghost" onClick={onBack}>Back to recommendations</Button>
      </div>
    );
  }
  const rows = [
    { label: "Median income", get: (c) => `₹${c.income.median}L` },
    { label: "Stability", get: (c) => `${c.stability}/100` },
    { label: "Availability", get: (c) => c.geo },
    { label: "Evidence", get: (c) => c.confidence },
    { label: "Strengths", get: (c) => c.strengths },
    { label: "Trade-offs", get: (c) => c.tradeoffs },
    { label: "Skills", get: (c) => c.skills.join(", ") },
  ];
  return (
    <div>
      <button onClick={onBack} style={{ ...body, background: "none", border: "none", color: T.inkSoft, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginBottom: 14, padding: 0 }}>
        <ArrowLeft size={14} /> Back to recommendations
      </button>
      <h2 style={{ ...display, fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 16 }}>Comparing {careers.length} careers</h2>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${careers.length}, minmax(180px, 1fr))`, gap: 1, background: T.mist, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: T.paper, padding: 10 }} />
          {careers.map((c) => (
            <div key={c.id} style={{ background: T.card, padding: 12 }}>
              <div style={{ ...body, fontWeight: 700, fontSize: 13.5, color: T.ink }}>{c.name}</div>
              <button onClick={() => removeFromCompare(c.id)} style={{ ...body, background: "none", border: "none", color: T.danger, fontSize: 11.5, cursor: "pointer", padding: 0, marginTop: 4 }}>
                Remove
              </button>
            </div>
          ))}
          {rows.map((row) => (
            <React.Fragment key={row.label}>
              <div style={{ background: T.paper, padding: 10, ...body, fontSize: 12, fontWeight: 700, color: T.inkSoft }}>{row.label}</div>
              {careers.map((c) => (
                <div key={c.id + row.label} style={{ background: T.card, padding: 10, ...body, fontSize: 12.5, color: T.ink, lineHeight: 1.5 }}>
                  {row.get(c)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {careers.map((c) => (
          <Button key={c.id} variant="ghost" onClick={() => onOpenCareer(c.id)}>
            Open {c.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ExploreMore({ onBack }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <button onClick={onBack} style={{ ...body, background: "none", border: "none", color: T.inkSoft, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginBottom: 14, padding: 0 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.plum, marginBottom: 12 }}>
        <Sparkles size={16} />
        <span style={{ ...body, fontWeight: 700, fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.5 }}>Explore more</span>
      </div>
      <Card style={{ minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ ...body, fontSize: 11.5, fontWeight: 700, color: T.plum, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {CURIOSITY_FACTS[i].sector}
        </div>
        <p style={{ ...display, fontSize: 17, color: T.ink, lineHeight: 1.5, margin: 0 }}>{CURIOSITY_FACTS[i].fact}</p>
      </Card>
      <Button onClick={() => setI((v) => (v + 1) % CURIOSITY_FACTS.length)} style={{ marginTop: 14 }}>
        Surprise me again <RotateCcw size={14} />
      </Button>
      <p style={{ ...body, fontSize: 12, color: T.inkSoft, marginTop: 14 }}>
        This section is just for curiosity — nothing you look at here affects your recommendations.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* App shell                                                               */
/* ---------------------------------------------------------------------- */
const STEPS = ["welcome", "age", "tools", "subjects", "priorities", "recs"];

export default function CareerExplorerApp() {
  useFonts();
  const [screen, setScreen] = useState("welcome");
  const [bracket, setBracket] = useState("15-18");
  const [liked, setLiked] = useState(new Set());
  const [energy, setEnergy] = useState({});
  const [subjects, setSubjects] = useState(new Set());
  const [priorityOrder, setPriorityOrder] = useState(PRIORITY_DEFS.map((p) => p.id));
  const [feedback, setFeedback] = useState({});
  const [compareIds, setCompareIds] = useState([]);
  const [activeCareerId, setActiveCareerId] = useState(null);
  const [previousScreen, setPreviousScreen] = useState("recs");

  const selectedTags = useMemo(() => new Set([...liked, ...subjects]), [liked, subjects]);
  const activeCareer = CAREERS.find((c) => c.id === activeCareerId);
  const compareCareers = CAREERS.filter((c) => compareIds.includes(c.id));

  function toggleCompare(id) {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]));
  }
  function openCareer(id) {
    setPreviousScreen(screen === "compare" ? "compare" : "recs");
    setActiveCareerId(id);
    setScreen("career");
  }

  const stepIdx = STEPS.indexOf(screen);
  const showProgress = stepIdx >= 0 && screen !== "welcome";

  return (
    <div style={{ ...body, background: T.paper, minHeight: 480, borderRadius: 20, padding: "22px 22px 30px", maxWidth: 560, margin: "0 auto" }}>
      {screen !== "welcome" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.teal }}>
            <Compass size={16} />
            <span style={{ ...display, fontWeight: 600, fontSize: 14 }}>Realign</span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {screen === "recs" || screen === "career" || screen === "compare" ? (
              <>
                <button onClick={() => setScreen("explore")} style={navBtn(screen === "explore")}>
                  <Sparkles size={13} /> Explore more
                </button>
                <button onClick={() => setScreen("compare")} style={navBtn(screen === "compare")}>
                  <GitCompare size={13} /> Compare {compareIds.length > 0 && `(${compareIds.length})`}
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {showProgress && (
        <div style={{ marginBottom: 22 }}>
          <HorizonBar fraction={(stepIdx + 1) / STEPS.length} />
        </div>
      )}

      {screen === "welcome" && <Welcome onStart={() => setScreen("age")} />}

      {screen === "age" && (
        <AgeCheck
          onPick={(b) => {
            setBracket(b);
            setScreen("tools");
          }}
        />
      )}

      {screen === "tools" && (
        <InterestDeck
          liked={liked}
          setLiked={setLiked}
          energy={energy}
          setEnergy={setEnergy}
          onDone={() => setScreen("subjects")}
        />
      )}

      {screen === "subjects" && (
        <SubjectPicker selected={subjects} setSelected={setSubjects} onDone={() => setScreen("priorities")} />
      )}

      {screen === "priorities" && (
        <PriorityRank order={priorityOrder} setOrder={setPriorityOrder} onDone={() => setScreen("recs")} />
      )}

      {screen === "recs" && (
        <Recommendations
          selectedTags={selectedTags}
          priorityOrder={priorityOrder}
          setPriorityOrder={setPriorityOrder}
          onOpenCareer={openCareer}
          feedback={feedback}
          setFeedback={setFeedback}
          compareIds={compareIds}
          toggleCompare={toggleCompare}
          liked={liked}
          setLiked={setLiked}
          subjects={subjects}
          setSubjects={setSubjects}
        />
      )}

      {screen === "career" && activeCareer && (
        <CareerDetail
          career={activeCareer}
          bracket={bracket}
          onBack={() => setScreen(previousScreen)}
          inCompare={compareIds.includes(activeCareer.id)}
          toggleCompare={toggleCompare}
        />
      )}

      {screen === "compare" && (
        <Compare careers={compareCareers} onBack={() => setScreen("recs")} onOpenCareer={openCareer} removeFromCompare={toggleCompare} />
      )}

      {screen === "explore" && <ExploreMore onBack={() => setScreen("recs")} />}
    </div>
  );
}
function navBtn(active) {
  return {
    ...body,
    background: "none",
    border: "none",
    color: active ? T.teal : T.inkSoft,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: 0,
  };
}
