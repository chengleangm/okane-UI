import { ArrowUpRight, Camera, Compass, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CreatorDirectory } from '@/components/CreatorDirectory';

const stories = [
  { title: 'Everyday stories. Real personality.', category: 'Lifestyle', image: 'fashion', slug: 'neary-na-nary', icon: Camera },
  { title: 'A fresh perspective on your brand.', category: 'Travel', image: 'landscape', slug: 'ambrel', icon: Compass },
  { title: 'Content that brings people together.', category: 'Entertainment', image: 'friends', slug: 'michie', icon: Users },
];

export default function Home() {
  return <main id="main" className="home-page">
    <section className="shell home-directory" aria-label="Find a creator"><CreatorDirectory home /></section>
    <section className="shell story-section" aria-labelledby="story-heading">
      <div className="story-section-heading"><div><span className="market-kicker">A LITTLE INSPIRATION</span><h2 id="story-heading">More stories. More possibilities.</h2></div><Link href="/creators">Explore creators <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      <div className="story-grid">{stories.map(({ title, category, image, slug, icon: Icon }) => <Link key={slug} href={'/creators/' + slug} className="story-card"><div className="story-image"><Image src={'/images/' + image + '.jpg'} alt={category + ' sample photography'} fill sizes="(max-width:600px) 90vw, 33vw" /><span><ArrowUpRight size={20} aria-hidden="true" /></span></div><div className="story-copy"><span><Icon size={15} aria-hidden="true" />{category}</span><h3>{title}</h3><p>Discover this creator and explore their sample work.</p></div></Link>)}</div>
      <p className="market-demo-note">Illustrative photography; not verified campaign work.</p>
    </section>
    <section className="shell bottom-expertise" id="expertise" aria-label="Our expertise">
      <article className="bottom-service bottom-content">
        <div className="bottom-service-copy"><span className="expertise-tag">Expertise</span><h2>Content creation</h2><p>Real stories. Fresh perspectives.<br />Content made to connect.</p></div>
        <div className="bottom-service-photo"><Image src="/images/friends.jpg" alt="Friends sharing a moment together" fill sizes="(max-width:600px) 36vw, 40vw" /></div>
      </article>
      <article className="bottom-service bottom-activation">
        <div className="bottom-service-copy"><span className="expertise-tag">Expertise</span><h2>Activation</h2><p>The right content deserves to be seen. We distribute where your audience actually is, exactly when it counts.</p></div>
        <div className="bottom-service-photo"><Image src="/images/fashion.jpg" alt="Illustrative lifestyle and fashion portrait" fill sizes="(max-width:600px) 36vw, 40vw" /></div>
      </article>
    </section>
    <section className="shell bottom-brands" aria-labelledby="bottom-brands-heading">
      <h2 id="bottom-brands-heading">These brands got hyped</h2>
      <div className="bottom-brand-row" aria-label="Brand treatments from the supplied reference">
        {[0, 1].map(index => <div className="bottom-brand-group" key={index}><span className="reference-fides">fides<span aria-hidden="true">◕</span></span><span className="reference-seal">De<br />Buiten<br />wereld</span>{index === 0 && <><span className="reference-srhk">SRHK<span>creative connections</span></span><span className="reference-flex">seesing flex<span aria-hidden="true">✦</span></span></>}</div>)}
      </div>
      <p className="market-demo-note">Reference brand treatments only; partnerships pending confirmation.</p>
    </section>
    <section className="shell bottom-cta" aria-labelledby="bottom-cta-heading">
      <h2 id="bottom-cta-heading">Let’s Get Hyped<br />with Okane!</h2>
      <Link className="button" href="/creators">Search for your influencer <ArrowUpRight size={16} aria-hidden="true" focusable="false" /></Link>
    </section>
    <section className="home-hero shell" aria-labelledby="hero-heading">
      <h1 id="hero-heading">Get Hyped. Get<br className="hero-title-break" /> Noticed. Get Results.</h1>
      <p className="home-hero-sub">Tired of gambling on content that<br /> yields nothing?</p>
      <div className="home-hero-cards">
        <div className="home-stat home-stat-coral"><strong>10M+</strong><span>Organic views generated*</span></div>
        <Link className="home-hero-photo home-photo-first" href="/creators/neary-na-nary" aria-label="Explore Neary Na Nary"><Image src="/images/neary.jpg" alt="Lifestyle and fashion inspiration" fill sizes="(max-width:600px) 26vw, 25vw" /><span className="home-photo-icon"><ArrowUpRight size={20} aria-hidden="true" /></span></Link>
        <div className="home-stat home-stat-teal"><strong>30+</strong><span>Brands helped grow*</span></div>
        <Link className="home-hero-photo home-photo-last" href="/creators" aria-label="Explore all creators"><Image src="/images/city.jpg" alt="City life and creative inspiration" fill sizes="(max-width:600px) 26vw, 25vw" /><span className="home-photo-caption">WORTH THE HYPE.<ArrowUpRight size={20} aria-hidden="true" /></span></Link>
      </div>
      <p className="stat-note">*Reference figures from the supplied design; pending verification. Illustrative photos.</p>
    </section>
  </main>;
}
