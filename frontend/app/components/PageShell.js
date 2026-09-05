import Navbar from './Navbar';
import Footer from './Footer';
export default function PageShell({ title, intro, children }) {
  return <><Navbar /><main className="main-content container review-page"><h1>{title}</h1>{intro && <p className="review-intro">{intro}</p>}{children}</main><Footer /></>;
}
