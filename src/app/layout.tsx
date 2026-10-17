import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import './globals.css';
import './portal.css';
export const metadata:Metadata={title:{default:'OKANE Digital — Find creators for your business',template:'%s | OKANE Digital'},description:'Browse creators by category, explore their work, and request a quote for your small business with OKANE Digital.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><SiteChrome>{children}</SiteChrome></body></html>}
