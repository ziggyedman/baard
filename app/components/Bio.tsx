export default function Bio() {
  return (
    <section
      id="bio"
      className="relative overflow-hidden px-6 py-20 md:px-16 md:py-32 border-t"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 40% 40% at 10% 20%, rgba(74,222,128,0.04), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-sm mb-8">
          <span className="prompt">➜</span> <span className="path-cmd">~/baard.cc</span>{" "}
          <span className="sh-cmd">cat about.txt</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Main copy */}
          <div className="lg:col-span-7">
            <h2
              className="text-xl md:text-2xl font-bold mb-8 leading-relaxed"
              style={{ color: "var(--color-heading)" }}
            >
              Where deep technical knowledge meets{" "}
              <span className="hl-green">calm, practical thinking</span>.
            </h2>

            <div className="space-y-5 text-[15px] md:text-base leading-relaxed" style={{ color: "var(--color-text)" }}>
              <p>
                Portugal-based Support Engineer who enjoys turning complex technical problems into clear,
                workable solutions. Part engineer, part troubleshooter, and naturally{" "}
                <span className="hl-amber">people focused</span>.
              </p>
              <p>
                Email was my first real deep dive into tech — not writing messages, but running them.
                Installing, configuring, and maintaining email servers taught me how communication depends
                on reliable systems. That early passion for email still shows up in the work I do today.
              </p>
              <p>
                My experience spans cybersecurity, enterprise messaging, cloud infrastructure, and product
                support across companies like Atlassian, Loom, and Sophos. I have worked across Canada,
                Netherlands, and Portugal, and I am often the person teams rely on when things get
                complicated — escalations, outages, or simply making sense of something overly complex.
              </p>
              <p>
                I joined Resend because the product feels easy to use and also has the depth to support real
                teams. Helping people is what I keep coming back to.
              </p>
              <p className="dim">
                I hold MSCE, MCITP, and MCSA certifications, and I am fluent in Portuguese, English, and
                the universal language of a well-written post-mortem.
              </p>
            </div>
          </div>

          {/* Stats panel */}
          <aside className="lg:col-span-5">
            <div className="win lg:sticky lg:top-24">
              <div className="win-bar">
                <span className="dot dot--r" />
                <span className="dot dot--y" />
                <span className="dot dot--g" />
                <span className="win-title">cat stats.md</span>
              </div>
              <div className="px-6 py-6 space-y-6 text-sm">
                <div>
                  <div className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>location</div>
                  <div style={{ color: "var(--color-heading)" }}>Aveiro → Vancouver → Lousã</div>
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>certifications</div>
                  <div className="flex flex-wrap gap-2">
                    {["MSCE", "MCITP", "MCSA"].map((cert) => (
                      <span
                        key={cert}
                        className="px-3 py-1 rounded-md border text-xs"
                        style={{ borderColor: "var(--color-panel-border)", color: "var(--color-amber)" }}
                      >
                        {cert.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>languages</div>
                  <div style={{ color: "var(--color-heading)" }}>
                    <span className="hl-green">PT</span> · <span className="hl-green">EN</span> ·{" "}
                    <span className="dim">well-written post-mortems</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>focus_areas</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ color: "var(--color-text)" }}>
                    <span>email_systems</span>
                    <span>escalations</span>
                    <span>cloud_infra</span>
                    <span>security</span>
                  </div>
                </div>
                <div className="pt-4 border-t" style={{ borderColor: "var(--color-panel-border)" }}>
                  <div className="text-xs dim">
                    <span className="hl-green">✓</span> always learning, always ready
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
