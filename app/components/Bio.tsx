export default function Bio() {
  return (
    <section
      id="bio"
      className="relative grain overflow-hidden px-6 py-20 md:px-16 md:py-32"
      style={{ backgroundColor: "var(--color-green-vivid)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Label */}
        <p
          className="text-sm tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-maroon-dark)", opacity: 0.6 }}
        >
          The Story So Far
        </p>

        {/* Heading */}
        <h2
          className="text-3d-sm uppercase leading-none mb-10"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-orange-hot)",
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
          }}
        >
          Act I — Bio
        </h2>

        <hr className="section-rule mb-10" style={{ borderColor: "var(--color-maroon-dark)" }} />

        <div
          className="space-y-6 text-lg md:text-xl leading-relaxed max-w-2xl"
          style={{ color: "var(--color-maroon-dark)" }}
        >
          <p>
            Michael Vaz is a Portugal-based Support Engineer with over two
            decades of experience turning complex technical problems into elegant solutions. Equal
            parts engineer, troubleshooter, and people-person — he operates where deep technical
            expertise meets calm under pressure.
          </p>
          <p>
            His career spans cybersecurity, enterprise messaging, cloud infrastructure, and product
            support engineering across companies like Atlassian, Loom, and Sophos — working across
            Vancouver, the Netherlands, and Portugal. He&apos;s the person teams call when
            escalations get hard, when systems go down at the worst possible time, and when someone
            needs to translate complexity into clarity.
          </p>
          <p>
            Certified MSCE, MCITP, and MCSA. Fluent in Portuguese, English, and the universal
            language of a well-written post-mortem. Always building, always learning, always one
            troubleshooting session away from a breakthrough.
          </p>
        </div>

        {/* Decorative corner */}
        <div
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 opacity-20 text-right"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-maroon-dark)", fontSize: "6rem", lineHeight: 1 }}
        >
          I
        </div>
      </div>
    </section>
  );
}
