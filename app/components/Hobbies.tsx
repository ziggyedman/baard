const hobbies = [
  {
    emoji: "✈️",
    title: "Travel",
    description:
      "Different cities, different cultures, different perspectives. The best education you can't get in a classroom.",
  },
  {
    emoji: "☕",
    title: "Coffee",
    description:
      "A serious pursuit. From single-origin pour-overs to a perfectly pulled espresso — the ritual matters as much as the cup.",
  },
  {
    emoji: "🛠️",
    title: "Building",
    description:
      "Side projects, prototypes, and experiments. The joy of creating something from nothing never gets old.",
  },
  {
    emoji: "🎮",
    title: "Gaming",
    description:
      "Strategy, story, and the occasional all-nighter. Games are the intersection of design, logic, and pure fun.",
  },
  {
    emoji: "🎵",
    title: "Music",
    description:
      "From deep house to classic rock — the right track makes everything sharper. Always on, always loud.",
  },
];

export default function Hobbies() {
  return (
    <section
      id="hobbies"
      className="relative grain overflow-hidden px-6 py-20 md:px-16 md:py-32"
      style={{ backgroundColor: "var(--color-green-vivid)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2
          className="text-3d-sm uppercase leading-none mb-10 text-left"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-orange-hot)",
            fontSize: "clamp(3rem, 9vw, 7rem)",
          }}
        >
          Highlights
        </h2>

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-cream)" }} />

        {/* Hobby grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ border: "3px solid var(--color-navy)", backgroundColor: "var(--color-navy)" }}>
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
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-cream)", opacity: 0.8 }}>
                {hobby.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
