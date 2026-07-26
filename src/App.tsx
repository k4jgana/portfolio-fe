import { useState } from "react";
import ChatAssistant from "./components/ChatAssistant";
import type { ChatIntent } from "./components/ChatAssistant";
import { GitHubIcon } from "./components/GitHubIcon";
import { portfolio } from "./data/portfolio.v1";
import portraitUrl from "./assets/MACEDONIA_NENAD KAJGANA_GUEST.jpg";
import "./styles/index.css";

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function App() {
  const [chatIntent, setChatIntent] = useState<ChatIntent | null>(null);

  const askAbout = (prompt: string) => {
    setChatIntent({ id: Date.now(), prompt });
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Nenad Kajgana — back to top">
          <span className="brand__monogram">{portfolio.initials}</span>
          <span className="brand__name">{portfolio.name}</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <div className="site-nav__sections">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#work">Work</a>
            <a href="#skills">Skills</a>
            <a href="#certification">Certified</a>
          </div>
          <a
            className="site-nav__github"
            href={portfolio.links.profile.href}
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Nenad Kajgana’s GitHub profile (opens in a new tab)"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
          <button type="button" className="site-nav__ask" onClick={() => askAbout("")}>Ask AI</button>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="kicker"><span />{portfolio.hero.eyebrow}</p>
            <h1 id="hero-title">
              Machine Learning Engineer building <em>practical</em> NLP and GenAI systems.
            </h1>
            <p className="hero__summary">{portfolio.hero.summary}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#work">Explore selected work <span aria-hidden="true">↓</span></a>
              <button className="button button--secondary" type="button" onClick={() => askAbout("Give me a concise overview of Nenad’s ML and GenAI experience.")}>Ask my AI <ArrowIcon /></button>
            </div>
            <dl className="hero__facts">
              <div><dt>Focus</dt><dd>NLP · GenAI</dd></div>
              <div><dt>Builds</dt><dd>Models → products</dd></div>
            </dl>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual__orbit hero-visual__orbit--one" />
            <div className="hero-visual__orbit hero-visual__orbit--two" />
            <span className="hero-visual__node hero-visual__node--one">RAG</span>
            <span className="hero-visual__node hero-visual__node--two">NLP</span>
            <span className="hero-visual__node hero-visual__node--three">API</span>
            <div className="signal-card">
              <div className="signal-card__chrome"><i /><i /><i /><span>system.profile</span></div>
              <div className="signal-card__body">
                <p><span>01</span> ingest(context)</p>
                <p><span>02</span> retrieve(signal)</p>
                <p><span>03</span> orchestrate(agents)</p>
                <p className="signal-card__active"><span>04</span> ship(product)<b>_</b></p>
              </div>
              <div className="signal-card__footer"><span><i /> workflow ready</span><strong>NK / 04</strong></div>
            </div>
          </div>
        </section>

        <section className="about section" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="section-index">01 / About</p>
            <h2 id="about-title">Useful systems, strange ideas, and the <em>fun</em> of making both real.</h2>
          </div>
          <div className="about__content">
            <figure className="about__portrait">
              <div className="about__portrait-frame">
                <img src={portraitUrl} alt="Nenad Kajgana" width="500" height="500" loading="lazy" decoding="async" />
              </div>
              <figcaption><span>NK / Profile</span><span>Human, confirmed</span></figcaption>
            </figure>
            <div className="about__body">
              {portfolio.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="about__links">
                <a className="text-link" href={portfolio.links.letterboxd.href} target="_blank" rel="noreferrer" aria-label="View Nenad’s Letterboxd profile (opens in a new tab)">See what I’m watching on Letterboxd <ArrowIcon /></a>
                <button type="button" className="text-link" onClick={() => askAbout("Tell me about Nenad’s passion projects and what he likes building for fun.")}>Ask AI about the side quests <ArrowIcon /></button>
              </div>
            </div>
          </div>
        </section>

        <section className="experience section" id="experience" aria-labelledby="experience-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-index">02 / Experience</p>
              <h2 id="experience-title">A path through data, product, and intelligent systems.</h2>
            </div>
            <p className="section-note">Current workforce intelligence at HTEC, backed by a foundation in NLP and product engineering.</p>
          </div>

          <div className="timeline">
            {portfolio.experience.map((item, index) => (
              <article className="timeline-item" key={item.company}>
                <div className="timeline-item__marker"><span>{String(index + 1).padStart(2, "0")}</span></div>
                <div className="timeline-item__meta">
                  <p>{item.period}</p>
                  <h3>{item.company}</h3>
                  <span>{item.role}</span>
                </div>
                <div className="timeline-item__content">
                  <p className="timeline-item__summary">{item.summary}</p>
                  <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                  <button type="button" className="ask-link" onClick={() => askAbout(item.askPrompt)}><span aria-hidden="true">✦</span> Ask about this</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="work section" id="work" aria-labelledby="work-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-index">03 / Selected work</p>
              <h2 id="work-title">Systems designed to leave the notebook.</h2>
            </div>
            <p className="section-note">A selection of applied work, summarized from the live knowledge base.</p>
          </div>

          <div className="work-grid">
            {portfolio.work.map((item) => (
              <article className="work-card" key={item.index}>
                <div className="work-card__top"><span>{item.index}</span><p>{item.eyebrow}</p><i aria-hidden="true">↗</i></div>
                <h3>{item.title}</h3>
                <p className="work-card__description">{item.description}</p>
                <ul className="tag-list" aria-label={`${item.title} technologies`}>
                  {item.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                <button type="button" className="ask-link" onClick={() => askAbout(item.askPrompt)}><span aria-hidden="true">✦</span> Ask about this</button>
              </article>
            ))}
          </div>
        </section>

        <section className="skills section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <p className="section-index">04 / Toolkit</p>
            <h2 id="skills-title">The stack behind the systems.</h2>
          </div>
          <div className="skills-grid">
            {portfolio.skillGroups.map((group, index) => (
              <article className="skill-group" key={group.title}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3></div>
                <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="certification section" id="certification" aria-labelledby="certification-title">
          <div className="certification__copy">
            <p className="section-index">05 / Certification</p>
            <p className="certification__issuer">Certified by {portfolio.certification.issuer}</p>
            <h2 id="certification-title">{portfolio.certification.title}</h2>
            <p>{portfolio.certification.description}</p>
            <a className="button certification__link" href={portfolio.certification.href} target="_blank" rel="noreferrer" aria-label="Verify Nenad’s Anthropic certification on Credly (opens in a new tab)">
              Verify on Credly <ArrowIcon />
            </a>
          </div>
          <a className="certification__badge" href={portfolio.certification.href} target="_blank" rel="noreferrer" aria-label="Open Nenad’s Claude Certified Architect credential on Credly">
            <img src={portfolio.certification.image} alt="Claude Certified Architect — Foundations badge issued by Anthropic" loading="lazy" />
            <span>Verified credential <ArrowIcon /></span>
          </a>
        </section>

        <section className="education-interests section" aria-label="Education and interests">
          <article className="education-card">
            <p className="section-index">06 / Education</p>
            <span className="education-card__year">2019—23</span>
            <h2>{portfolio.education.degree}</h2>
            <p>{portfolio.education.institution}</p>
            <small>{portfolio.education.location}</small>
          </article>
          <article className="interests-card">
            <p className="section-index">Off the clock</p>
            <h2>A carefully curated queue.</h2>
            <div className="interest-list">
              {portfolio.interests.map((interest, index) => (
                <div key={interest.title}><span>{index === 0 ? "♫" : "▶"}</span><div><h3>{interest.title}</h3><p>{interest.detail}</p></div></div>
              ))}
            </div>
            <button type="button" className="text-link" onClick={() => askAbout("What music or films would Nenad recommend to me?")}>Get a recommendation from AI <ArrowIcon /></button>
            <a className="text-link interests-card__letterboxd" href={portfolio.links.letterboxd.href} target="_blank" rel="noreferrer">Letterboxd profile <ArrowIcon /></a>
          </article>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__brand"><span>{portfolio.initials}</span><p>{portfolio.name}<small>Machine Learning / AI Engineer</small></p></div>
        <nav aria-label="Profiles and source repositories">
          <a href={portfolio.links.profile.href} target="_blank" rel="noreferrer">GitHub profile <ArrowIcon /></a>
          <a href={portfolio.links.letterboxd.href} target="_blank" rel="noreferrer">Letterboxd <ArrowIcon /></a>
          <a href={portfolio.links.frontend.href} target="_blank" rel="noreferrer">Frontend source <ArrowIcon /></a>
          <a href={portfolio.links.backend.href} target="_blank" rel="noreferrer">AI backend source <ArrowIcon /></a>
        </nav>
        <p className="site-footer__meta">Portfolio snapshot v{portfolio.snapshotVersion} · {portfolio.retrievedAt}</p>
      </footer>

      <ChatAssistant intent={chatIntent} />
    </div>
  );
}

export default App;
