const hobbies = [
  { title: "travel", emoji: "✈️", description: "Best education you can't get in a classroom" },
  { title: "coffee", emoji: "☕", description: "Ritual matters as much as the cup" },
  { title: "building", emoji: "🛠️", description: "Something from nothing, always" },
  { title: "gaming", emoji: "🎮", description: "Design × logic × pure fun" },
  { title: "music", emoji: "🎵", description: "Always on. Always loud." },
  { title: "racing", emoji: "🏎️", description: "Where engineering meets nerve" },
];

export default function Hobbies() {
  return (
    <section
      id="hobbies"
      className="relative overflow-hidden px-6 py-20 md:px-16 md:py-32 border-t"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 40% 40% at 80% 60%, rgba(240,193,102,0.04), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-sm mb-2">
          <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span>{" "}
          <span className="sh-cmd">ls ./off_the_clock/</span>
        </div>
        <p className="text-sm dim mb-10">6 items · browsable</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hobbies.map((hobby, i) => (
            <div
              key={i}
              className="hobby-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{hobby.emoji}</span>
                <span className="text-base font-bold hl-green" style={{ fontFamily: "var(--font-mono)" }}>
                  {hobby.title}/
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.6 }}>
                {hobby.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
