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

        {/* Bio content — edit this */}
        <div
          className="space-y-6 text-lg md:text-xl leading-relaxed max-w-2xl"
          style={{ color: "var(--color-maroon-dark)" }}
        >
          <p>
            Michael Vaz is a builder, trader, and creator with a passion for turning ideas into
            reality. With a background spanning technology, finance, and entrepreneurship, he brings
            a unique blend of analytical precision and creative energy to everything he does.
          </p>
          <p>
            Whether he&apos;s architecting software systems, navigating markets, or launching new
            ventures, Michael operates at the intersection of innovation and execution — always
            looking for the edge between what exists and what&apos;s possible.
          </p>
          <p>
            Based across continents, he&apos;s driven by curiosity, fuelled by coffee, and obsessed
            with the craft of building things that matter.
          </p>
        </div>

        {/* Decorative corner stamp */}
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
