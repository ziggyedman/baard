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
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.6 }}
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

        <hr className="section-rule mb-10" style={{ borderColor: "var(--color-cream)" }} />

        <div
          className="space-y-6 text-lg md:text-xl leading-relaxed max-w-2xl"
          style={{ color: "var(--color-cream)", opacity: 0.9 }}
        >
          <p>
            I am a Portugal based Support Engineer who enjoys turning complex technical problems into clear,
            workable solutions.
            Part engineer, part troubleshooter, and naturally people focused, I do my best work where deep
            technical knowledge meets calm, practical thinking.
          </p>
          <p>
            Email was my first real deep-dive into tech — not writing messages, but running them.
            Installing, configuring, and maintaining email servers taught me how communication depends on
            reliable systems. That early passion for email still shows up in the work I do today.
          </p>
          <p>
            My experience spans cybersecurity, enterprise messaging, cloud infrastructure,
            and product support across companies like Atlassian, Loom, and Sophos.
            I have worked across Canada, Netherlands, and Portugal, and I am often the person teams
            rely on when things get complicated — whether it is a tough escalation, a system outage,
            or simply making sense of something that feels overly complex.
          </p>
          <p>
            I joined Resend because the product feels easy to use and also has the depth to support real teams.
            Helping people is what I keep coming back to, and I love doing that on platforms that are built
            with both speed and human values in mind.
          </p>
          <p>
            I hold MSCE, MCITP, and MCSA certifications, and I am fluent in Portuguese, English, and the
            universal language of a well written post mortem.
            I am always learning, and always ready for the next challenge.
          </p>
        </div>

        {/* Decorative corner */}
        <div
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 opacity-20 text-right"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "6rem", lineHeight: 1 }}
        >
          I
        </div>
      </div>
    </section>
  );
}
