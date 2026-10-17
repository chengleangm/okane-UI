import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './globals.css';
import './portal.css';
export const metadata:Metadata={title:{default:'OKANE Digital — Find creators for your business',template:'%s | OKANE Digital'},description:'Browse creators by category, explore their work, and request a quote for your small business with OKANE Digital.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Navbar/>{children}<Footer/></body></html>}
