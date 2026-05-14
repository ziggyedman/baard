const hobbies = [
  {
    emoji: "📈",
    title: "Trading",
    description:
      "Markets are the world's most honest feedback loop. Reading charts, sizing positions, and staying disciplined under pressure.",
  },
  {
    emoji: "🏋️",
    title: "Fitness",
    description:
      "The gym is where mental clarity is forged. Consistent reps, heavy lifts, and the discipline that bleeds into everything else.",
  },
  {
    emoji: "✈️",
    title: "Travel",
    description:
      "Different cities, different cultures, different perspectives. The best education you can't get in a classroom.",
  },
  {
    emoji: "🎵",
    title: "Music",
    description:
      "From deep house to classic rock — the right track makes everything sharper. Also dabbles in production.",
  },
  {
    emoji: "📚",
    title: "Reading",
    description:
      "Biographies, history, philosophy, and the occasional sci-fi rabbit hole. Books are leverage for the mind.",
  },
  {
    emoji: "🛠️",
    title: "Building",
    description:
      "Side projects, prototypes, and experiments. The joy of creating something from nothing never gets old.",
  },
];

export default function Hobbies() {
  return (
    <section
      id="hobbies"
      className="relative grain overflow-hidden px-6 py-20 md:px-16 md:py-32"
      style={{ backgroundColor: "var(--color-green-vivid)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p
          className="text-sm tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-maroon-dark)", opacity: 0.6 }}
        >
          Act III
        </p>

        {/* Heading */}
        <h2
          className="text-3d-sm uppercase leading-none mb-10"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-orange-hot)",
            fontSize: "clamp(3rem, 9vw, 7rem)",
          }}
        >
          Special Features
        </h2>

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-maroon-dark)" }} />

        {/* Hobby grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ border: "3px solid var(--color-maroon-dark)", backgroundColor: "var(--color-maroon-dark)" }}>
          {hobbies.map((hobby, i) => (
            <div
              key={i}
              className="p-8 flex flex-col gap-3"
              style={{ backgroundColor: "var(--color-green-vivid)" }}
            >
              <span className="text-4xl" role="img" aria-label={hobby.title}>
                {hobby.emoji}
              </span>
              <h3
                className="uppercase leading-none"
                style={{
                  fontFamily: "var(--font-bebas)",
                  color: "var(--color-orange-hot)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                }}
              >
                {hobby.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-maroon-dark)" }}>
                {hobby.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
