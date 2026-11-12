import Link from 'next/link';
import { LandingCreators } from '@/components/LandingCreators';
import { LandingArtwork } from '@/components/LandingArtwork';
import './landing.css';

const copy = 'The right content deserves to be seen. We distribute where your audience actually is, exactly when it counts.';
const brands: { name: string; crop: [number, number, number, number] }[] = [
  {name:'fides',crop:[14,1700,68,29]}, {name:'De Talenten tuin',crop:[139,1685,57,58]},
  {name:'SRHK ambassadeurs',crop:[256,1699,65,33]}, {name:'seesing flex',crop:[362,1704,91,25]},
  {name:'fides',crop:[493,1700,68,29]}, {name:'De Talenten tuin',crop:[619,1685,57,58]},
];
export default function Home() {
  return <main id="main" className="landing-page">
    <section className="landing-shell landing-hero" aria-labelledby="landing-title">
      <h1 id="landing-title">Get Hyped. Get<br />Noticed. Get Results.</h1>
      <p className="landing-subtitle">Tired of gambling on content that<br />yields nothing?</p>
      <div className="landing-hero-cards">
        <div className="landing-stat landing-coral"><strong>10M+</strong><span>Organic views generated</span></div>
        <Link className="landing-hero-person" href="/creators/neary-na-nary" aria-label="Meet Neary Na Nary"><LandingArtwork crop={[161,231,195,277]} className="landing-person-art" /></Link>
        <div className="landing-stat landing-teal"><strong>30+</strong><span>Brands helped grow</span></div>
        <Link className="landing-hero-video" href="/creators" aria-label="Explore our creators"><LandingArtwork crop={[477,230,209,280]} className="landing-video-art" /></Link>
      </div>
    </section>
    <section id="how-it-works" className="landing-shell landing-process" aria-labelledby="process-title"><h2 id="process-title">From browsing to your project</h2><div className="landing-steps">{['01','02','03'].map(number => <article key={number} className="landing-step"><span>{number}</span><h3>Find a creator</h3><p>{copy}</p></article>)}</div></section>
    <LandingCreators />
    <section id="expertise" className="landing-shell landing-expertise" aria-label="Our expertise">
      <article className="landing-service landing-content"><div><span className="landing-tag">Expertise</span><h2>Content creation</h2></div><LandingArtwork crop={[420,1160,224,130]} className="landing-content-art" /></article>
      <article className="landing-service landing-activation"><div className="landing-service-copy"><span className="landing-tag">Expertise</span><h2>Activation</h2><p>{copy}</p></div><LandingArtwork crop={[407,1273,233,266]} className="landing-activation-art" /></article>
    </section>
    <section className="landing-brands" aria-labelledby="brands-title"><h2 id="brands-title">These brands got hyped</h2><div className="landing-brand-row">{brands.map((brand,index) => <LandingArtwork key={index} crop={brand.crop} label={brand.name} className="landing-brand-art" />)}</div></section>
    <section className="landing-shell landing-cta" aria-labelledby="cta-title"><h2 id="cta-title">Let&apos;s Get Hyped<br />with Okane!</h2><Link className="button" href="/creators">Search for our influencer</Link></section>
  </main>;
}
