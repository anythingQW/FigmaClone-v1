import { Shape, ShapeType } from '@figma-clone/shared';
import { ShapeFactory } from './ShapeFactory';
export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'mobile' | 'presentation' | 'wireframe' | 'social';
  gradient: string;
}
export const TEMPLATE_CATALOG: TemplateInfo[] = [
  { id: 'landing', name: 'Landing Page', description: 'Hero section with nav, CTA, and feature cards for desktop.', category: 'web', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'dashboard', name: 'Dashboard', description: 'Analytics dashboard with metric cards, charts, and sidebar.', category: 'web', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'pricing', name: 'Pricing Page', description: 'Three-tier pricing cards with highlighted recommended plan.', category: 'web', gradient: 'from-amber-500 to-orange-600' },
  { id: 'mobile-app', name: 'Mobile App', description: 'iPhone 15 frame with bottom tabs, navbar, and content.', category: 'mobile', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'mobile-login', name: 'Login Screen', description: 'Mobile login form with social auth buttons and branding.', category: 'mobile', gradient: 'from-violet-500 to-fuchsia-600' },
  { id: 'slide-deck', name: 'Slide Deck', description: '16:9 presentation slide with title, subtitle, and visual.', category: 'presentation', gradient: 'from-rose-500 to-pink-600' },
  { id: 'wireframe-web', name: 'Web Wireframe', description: 'Lo-fi desktop wireframe with placeholder blocks.', category: 'wireframe', gradient: 'from-zinc-400 to-zinc-600' },
  { id: 'social-post', name: 'Social Media Post', description: '1080x1080 Instagram-style card with text overlay.', category: 'social', gradient: 'from-pink-500 to-red-600' },
  { id: 'card-components', name: 'Card Components', description: 'Library of reusable card patterns and UI atoms.', category: 'wireframe', gradient: 'from-sky-500 to-indigo-600' },
  { id: 'onboarding', name: 'Onboarding Flow', description: 'Multi-step mobile onboarding with illustration areas.', category: 'mobile', gradient: 'from-lime-500 to-green-600' },
];
export class Templates {
  public static load(templateId: string): Shape[] {
    switch (templateId) {
      case 'landing': return this.loadLandingPage();
      case 'dashboard': return this.loadDashboard();
      case 'pricing': return this.loadPricing();
      case 'mobile-app': return this.loadMobileApp();
      case 'mobile-login': return this.loadMobileLogin();
      case 'slide-deck': return this.loadSlideDeck();
      case 'wireframe-web': return this.loadWebWireframe();
      case 'social-post': return this.loadSocialPost();
      case 'card-components': return this.loadCardComponents();
      case 'onboarding': return this.loadOnboarding();
      default: return [];
    }
  }
  public static loadLandingPage(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const frame = ShapeFactory.createFrame({ x: 80, y: 60, width: 1280, height: 800, zIndex: z++ });
    frame.name = 'Landing — Desktop 1280';
    frame.fill = { color: '#09090b', opacity: 1 };
    s.push(frame);
    const nav = ShapeFactory.createRectangle({ x: 80, y: 60, width: 1280, height: 56, zIndex: z++ });
    nav.name = 'Navbar';
    nav.fill = { color: '#09090b', opacity: 0.95 };
    nav.stroke = { color: '#27272a', width: 1, opacity: 0.6 };
    nav.cornerRadius = 0;
    s.push(nav);
    const logo = ShapeFactory.createText({ x: 120, y: 78, width: 120, height: 20, zIndex: z++ });
    logo.name = 'Logo';
    logo.content = '⌘ Acme Inc';
    logo.fontSize = 14;
    logo.fontWeight = '700';
    s.push(logo);
    const navLinks = ShapeFactory.createText({ x: 700, y: 78, width: 300, height: 20, zIndex: z++ });
    navLinks.name = 'Nav Links';
    navLinks.content = 'Features    Pricing    Docs    Blog';
    navLinks.fontSize = 12;
    navLinks.fontWeight = '400';
    navLinks.textAlign = 'center';
    s.push(navLinks);
    const signInBtn = ShapeFactory.createRectangle({ x: 1200, y: 72, width: 80, height: 32, zIndex: z++ });
    signInBtn.name = 'Sign In Button';
    signInBtn.fill = { color: '#6366f1', opacity: 1 };
    signInBtn.cornerRadius = 8;
    s.push(signInBtn);
    const signInText = ShapeFactory.createText({ x: 1200, y: 80, width: 80, height: 16, zIndex: z++ });
    signInText.name = 'Sign In Text';
    signInText.content = 'Sign In';
    signInText.fontSize = 11;
    signInText.fontWeight = '600';
    signInText.textAlign = 'center';
    s.push(signInText);
    const heroGlow = ShapeFactory.createEllipse({ x: 420, y: 120, width: 520, height: 300, zIndex: z++ });
    heroGlow.name = 'Hero Glow';
    heroGlow.fill = { color: '#4f46e5', opacity: 0.08 };
    heroGlow.stroke = { color: 'transparent', width: 0, opacity: 0 };
    s.push(heroGlow);
    const heroTitle = ShapeFactory.createText({ x: 280, y: 220, width: 800, height: 50, zIndex: z++ });
    heroTitle.name = 'Hero Title';
    heroTitle.content = 'Ship beautiful products faster';
    heroTitle.fontSize = 42;
    heroTitle.fontWeight = '800';
    heroTitle.textAlign = 'center';
    s.push(heroTitle);
    const heroSub = ShapeFactory.createText({ x: 340, y: 290, width: 680, height: 40, zIndex: z++ });
    heroSub.name = 'Hero Subtitle';
    heroSub.content = 'The modern design platform for teams who build at scale.';
    heroSub.fontSize = 16;
    heroSub.fontWeight = '400';
    heroSub.textAlign = 'center';
    heroSub.fill = { color: '#a1a1aa', opacity: 1 };
    s.push(heroSub);
    const ctaBtn = ShapeFactory.createRectangle({ x: 540, y: 360, width: 160, height: 44, zIndex: z++ });
    ctaBtn.name = 'CTA Primary';
    ctaBtn.fill = { color: '#6366f1', opacity: 1 };
    ctaBtn.cornerRadius = 22;
    s.push(ctaBtn);
    const ctaText = ShapeFactory.createText({ x: 540, y: 374, width: 160, height: 16, zIndex: z++ });
    ctaText.name = 'CTA Text';
    ctaText.content = 'Get Started Free';
    ctaText.fontSize = 13;
    ctaText.fontWeight = '600';
    ctaText.textAlign = 'center';
    s.push(ctaText);
    const ctaSecondary = ShapeFactory.createRectangle({ x: 720, y: 360, width: 120, height: 44, zIndex: z++ });
    ctaSecondary.name = 'CTA Secondary';
    ctaSecondary.fill = { color: 'transparent', opacity: 0 };
    ctaSecondary.stroke = { color: '#3f3f46', width: 1, opacity: 1 };
    ctaSecondary.cornerRadius = 22;
    s.push(ctaSecondary);
    const ctaSecText = ShapeFactory.createText({ x: 720, y: 374, width: 120, height: 16, zIndex: z++ });
    ctaSecText.name = 'CTA Secondary Text';
    ctaSecText.content = 'Learn More';
    ctaSecText.fontSize = 13;
    ctaSecText.fontWeight = '500';
    ctaSecText.textAlign = 'center';
    ctaSecText.fill = { color: '#a1a1aa', opacity: 1 };
    s.push(ctaSecText);
    for (let i = 0; i < 3; i++) {
      const card = ShapeFactory.createRectangle({ x: 180 + i * 340, y: 480, width: 300, height: 200, zIndex: z++ });
      card.name = `Feature Card ${i + 1}`;
      card.fill = { color: '#18181b', opacity: 0.5 };
      card.stroke = { color: '#27272a', width: 1, opacity: 0.8 };
      card.cornerRadius = 16;
      s.push(card);
      const icon = ShapeFactory.createEllipse({ x: 210 + i * 340, y: 510, width: 40, height: 40, zIndex: z++ });
      icon.name = `Icon ${i + 1}`;
      icon.fill = { color: ['#6366f1', '#a855f7', '#14b8a6'][i], opacity: 0.15 };
      s.push(icon);
      const title = ShapeFactory.createText({ x: 210 + i * 340, y: 570, width: 240, height: 20, zIndex: z++ });
      title.name = `Feature Title ${i + 1}`;
      title.content = ['Real-time Collab', 'Vector Engine', 'Cloud Deploy'][i];
      title.fontSize = 15;
      title.fontWeight = '600';
      s.push(title);
      const desc = ShapeFactory.createText({ x: 210 + i * 340, y: 600, width: 240, height: 30, zIndex: z++ });
      desc.name = `Feature Desc ${i + 1}`;
      desc.content = ['Work with your team in real-time.', 'Crisp vectors at any scale.', 'Instant publishing to production.'][i];
      desc.fontSize = 12;
      desc.fontWeight = '400';
      desc.fill = { color: '#71717a', opacity: 1 };
      s.push(desc);
    }
    return s;
  }
  public static loadDashboard(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const frame = ShapeFactory.createFrame({ x: 80, y: 60, width: 1280, height: 800, zIndex: z++ });
    frame.name = 'Dashboard — Desktop';
    frame.fill = { color: '#09090b', opacity: 1 };
    s.push(frame);
    const sidebar = ShapeFactory.createRectangle({ x: 80, y: 60, width: 220, height: 800, zIndex: z++ });
    sidebar.name = 'Sidebar';
    sidebar.fill = { color: '#0c0c0e', opacity: 1 };
    sidebar.stroke = { color: '#1f1f23', width: 1, opacity: 1 };
    sidebar.cornerRadius = 0;
    s.push(sidebar);
    const sidebarLogo = ShapeFactory.createText({ x: 110, y: 90, width: 160, height: 20, zIndex: z++ });
    sidebarLogo.name = 'Sidebar Logo';
    sidebarLogo.content = '◆ Dashboard';
    sidebarLogo.fontSize = 14;
    sidebarLogo.fontWeight = '700';
    s.push(sidebarLogo);
    const menuItems = ['Overview', 'Analytics', 'Customers', 'Products', 'Settings'];
    menuItems.forEach((item, i) => {
      const menuBg = ShapeFactory.createRectangle({ x: 92, y: 140 + i * 38, width: 196, height: 32, zIndex: z++ });
      menuBg.name = `Menu ${item}`;
      menuBg.fill = { color: i === 0 ? '#1f1f23' : 'transparent', opacity: i === 0 ? 1 : 0 };
      menuBg.cornerRadius = 8;
      menuBg.stroke = { color: 'transparent', width: 0, opacity: 0 };
      s.push(menuBg);
      const menuText = ShapeFactory.createText({ x: 110, y: 146 + i * 38, width: 160, height: 16, zIndex: z++ });
      menuText.name = `Menu Text ${item}`;
      menuText.content = item;
      menuText.fontSize = 12;
      menuText.fontWeight = i === 0 ? '600' : '400';
      menuText.fill = { color: i === 0 ? '#e4e4e7' : '#71717a', opacity: 1 };
      s.push(menuText);
    });
    const topBar = ShapeFactory.createRectangle({ x: 300, y: 60, width: 1060, height: 56, zIndex: z++ });
    topBar.name = 'Top Bar';
    topBar.fill = { color: '#09090b', opacity: 0.9 };
    topBar.stroke = { color: '#1f1f23', width: 1, opacity: 1 };
    topBar.cornerRadius = 0;
    s.push(topBar);
    const pageTitle = ShapeFactory.createText({ x: 330, y: 78, width: 200, height: 20, zIndex: z++ });
    pageTitle.name = 'Page Title';
    pageTitle.content = 'Overview';
    pageTitle.fontSize = 16;
    pageTitle.fontWeight = '700';
    s.push(pageTitle);
    const metrics = [
      { label: 'Revenue', value: '$45,231', color: '#22c55e' },
      { label: 'Users', value: '12,340', color: '#6366f1' },
      { label: 'Orders', value: '1,203', color: '#f59e0b' },
      { label: 'Churn', value: '2.4%', color: '#ef4444' },
    ];
    metrics.forEach((m, i) => {
      const card = ShapeFactory.createRectangle({ x: 330 + i * 240, y: 140, width: 220, height: 110, zIndex: z++ });
      card.name = `Metric ${m.label}`;
      card.fill = { color: '#18181b', opacity: 0.6 };
      card.stroke = { color: '#27272a', width: 1, opacity: 0.8 };
      card.cornerRadius = 12;
      s.push(card);
      const label = ShapeFactory.createText({ x: 350 + i * 240, y: 165, width: 180, height: 14, zIndex: z++ });
      label.name = `Label ${m.label}`;
      label.content = m.label;
      label.fontSize = 11;
      label.fontWeight = '500';
      label.fill = { color: '#71717a', opacity: 1 };
      s.push(label);
      const value = ShapeFactory.createText({ x: 350 + i * 240, y: 195, width: 180, height: 24, zIndex: z++ });
      value.name = `Value ${m.label}`;
      value.content = m.value;
      value.fontSize = 24;
      value.fontWeight = '800';
      s.push(value);
    });
    const chartArea = ShapeFactory.createRectangle({ x: 330, y: 280, width: 700, height: 360, zIndex: z++ });
    chartArea.name = 'Chart Area';
    chartArea.fill = { color: '#18181b', opacity: 0.4 };
    chartArea.stroke = { color: '#27272a', width: 1, opacity: 0.6 };
    chartArea.cornerRadius = 16;
    s.push(chartArea);
    const chartTitle = ShapeFactory.createText({ x: 360, y: 310, width: 200, height: 16, zIndex: z++ });
    chartTitle.name = 'Chart Title';
    chartTitle.content = 'Revenue Over Time';
    chartTitle.fontSize = 14;
    chartTitle.fontWeight = '600';
    s.push(chartTitle);
    return s;
  }
  public static loadPricing(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const frame = ShapeFactory.createFrame({ x: 80, y: 60, width: 1100, height: 700, zIndex: z++ });
    frame.name = 'Pricing Page';
    frame.fill = { color: '#09090b', opacity: 1 };
    s.push(frame);
    const title = ShapeFactory.createText({ x: 80, y: 100, width: 1100, height: 40, zIndex: z++ });
    title.name = 'Pricing Title';
    title.content = 'Simple, transparent pricing';
    title.fontSize = 36;
    title.fontWeight = '800';
    title.textAlign = 'center';
    s.push(title);
    const subtitle = ShapeFactory.createText({ x: 280, y: 150, width: 700, height: 20, zIndex: z++ });
    subtitle.name = 'Pricing Subtitle';
    subtitle.content = 'Choose the plan that works for your team. Cancel anytime.';
    subtitle.fontSize = 14;
    subtitle.fontWeight = '400';
    subtitle.textAlign = 'center';
    subtitle.fill = { color: '#71717a', opacity: 1 };
    s.push(subtitle);
    const plans = [
      { name: 'Starter', price: '$9', desc: 'For individuals', highlight: false, color: '#3f3f46' },
      { name: 'Pro', price: '$29', desc: 'For growing teams', highlight: true, color: '#6366f1' },
      { name: 'Enterprise', price: '$99', desc: 'For large orgs', highlight: false, color: '#3f3f46' },
    ];
    plans.forEach((plan, i) => {
      const card = ShapeFactory.createRectangle({ x: 150 + i * 310, y: 220, width: 280, height: 400, zIndex: z++ });
      card.name = `Plan ${plan.name}`;
      card.fill = { color: plan.highlight ? '#1e1b4b' : '#18181b', opacity: plan.highlight ? 0.5 : 0.4 };
      card.stroke = { color: plan.color, width: plan.highlight ? 2 : 1, opacity: plan.highlight ? 0.8 : 0.5 };
      card.cornerRadius = 20;
      s.push(card);
      const planName = ShapeFactory.createText({ x: 180 + i * 310, y: 260, width: 220, height: 20, zIndex: z++ });
      planName.content = plan.name;
      planName.fontSize = 14;
      planName.fontWeight = '600';
      planName.fill = { color: plan.highlight ? '#a5b4fc' : '#a1a1aa', opacity: 1 };
      s.push(planName);
      const price = ShapeFactory.createText({ x: 180 + i * 310, y: 300, width: 220, height: 30, zIndex: z++ });
      price.content = `${plan.price}/mo`;
      price.fontSize = 32;
      price.fontWeight = '800';
      s.push(price);
      const desc = ShapeFactory.createText({ x: 180 + i * 310, y: 345, width: 220, height: 16, zIndex: z++ });
      desc.content = plan.desc;
      desc.fontSize = 12;
      desc.fontWeight = '400';
      desc.fill = { color: '#71717a', opacity: 1 };
      s.push(desc);
      const btn = ShapeFactory.createRectangle({ x: 180 + i * 310, y: 540, width: 220, height: 40, zIndex: z++ });
      btn.name = `CTA ${plan.name}`;
      btn.fill = { color: plan.highlight ? '#6366f1' : 'transparent', opacity: plan.highlight ? 1 : 0 };
      btn.stroke = { color: plan.highlight ? 'transparent' : '#3f3f46', width: plan.highlight ? 0 : 1, opacity: 1 };
      btn.cornerRadius = 10;
      s.push(btn);
      const btnText = ShapeFactory.createText({ x: 180 + i * 310, y: 552, width: 220, height: 16, zIndex: z++ });
      btnText.content = plan.highlight ? 'Start Free Trial' : 'Get Started';
      btnText.fontSize = 12;
      btnText.fontWeight = '600';
      btnText.textAlign = 'center';
      s.push(btnText);
    });
    return s;
  }
  public static loadMobileApp(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const phone = ShapeFactory.createFrame({ x: 120, y: 60, width: 375, height: 812, zIndex: z++ });
    phone.name = 'iPhone 15 Pro';
    phone.fill = { color: '#09090b', opacity: 1 };
    s.push(phone);
    const statusBar = ShapeFactory.createRectangle({ x: 120, y: 60, width: 375, height: 44, zIndex: z++ });
    statusBar.name = 'Status Bar';
    statusBar.fill = { color: '#09090b', opacity: 1 };
    statusBar.cornerRadius = 0;
    statusBar.stroke = { color: 'transparent', width: 0, opacity: 0 };
    s.push(statusBar);
    const navbar = ShapeFactory.createRectangle({ x: 120, y: 104, width: 375, height: 48, zIndex: z++ });
    navbar.name = 'Navigation Bar';
    navbar.fill = { color: '#09090b', opacity: 0.95 };
    navbar.stroke = { color: '#1f1f23', width: 1, opacity: 1 };
    navbar.cornerRadius = 0;
    s.push(navbar);
    const navTitle = ShapeFactory.createText({ x: 120, y: 118, width: 375, height: 20, zIndex: z++ });
    navTitle.content = 'Explore';
    navTitle.fontSize = 16;
    navTitle.fontWeight = '700';
    navTitle.textAlign = 'center';
    s.push(navTitle);
    const searchBar = ShapeFactory.createRectangle({ x: 140, y: 170, width: 335, height: 40, zIndex: z++ });
    searchBar.name = 'Search Bar';
    searchBar.fill = { color: '#18181b', opacity: 0.8 };
    searchBar.stroke = { color: '#27272a', width: 1, opacity: 1 };
    searchBar.cornerRadius = 12;
    s.push(searchBar);
    const searchText = ShapeFactory.createText({ x: 160, y: 182, width: 200, height: 16, zIndex: z++ });
    searchText.content = '🔍 Search anything...';
    searchText.fontSize = 13;
    searchText.fontWeight = '400';
    searchText.fill = { color: '#52525b', opacity: 1 };
    s.push(searchText);
    for (let i = 0; i < 3; i++) {
      const card = ShapeFactory.createRectangle({ x: 140, y: 240 + i * 150, width: 335, height: 130, zIndex: z++ });
      card.name = `Content Card ${i + 1}`;
      card.fill = { color: '#18181b', opacity: 0.5 };
      card.stroke = { color: '#27272a', width: 1, opacity: 0.6 };
      card.cornerRadius = 16;
      s.push(card);
      const thumb = ShapeFactory.createRectangle({ x: 155, y: 255 + i * 150, width: 100, height: 100, zIndex: z++ });
      thumb.name = `Thumbnail ${i + 1}`;
      thumb.fill = { color: ['#312e81', '#064e3b', '#7c2d12'][i], opacity: 0.4 };
      thumb.cornerRadius = 12;
      s.push(thumb);
    }
    const tabBar = ShapeFactory.createRectangle({ x: 120, y: 822, width: 375, height: 50, zIndex: z++ });
    tabBar.name = 'Tab Bar';
    tabBar.fill = { color: '#0c0c0e', opacity: 0.95 };
    tabBar.stroke = { color: '#1f1f23', width: 1, opacity: 1 };
    tabBar.cornerRadius = 0;
    s.push(tabBar);
    const tabs = ['Home', 'Search', 'Add', 'Inbox', 'Profile'];
    tabs.forEach((tab, i) => {
      const t = ShapeFactory.createText({ x: 130 + i * 72, y: 836, width: 60, height: 14, zIndex: z++ });
      t.content = tab;
      t.fontSize = 9;
      t.fontWeight = i === 0 ? '600' : '400';
      t.textAlign = 'center';
      t.fill = { color: i === 0 ? '#6366f1' : '#52525b', opacity: 1 };
      s.push(t);
    });
    return s;
  }
  public static loadMobileLogin(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const phone = ShapeFactory.createFrame({ x: 120, y: 60, width: 375, height: 812, zIndex: z++ });
    phone.name = 'Login Screen';
    phone.fill = { color: '#09090b', opacity: 1 };
    s.push(phone);
    const logoCircle = ShapeFactory.createEllipse({ x: 260, y: 160, width: 56, height: 56, zIndex: z++ });
    logoCircle.name = 'App Logo';
    logoCircle.fill = { color: '#6366f1', opacity: 1 };
    s.push(logoCircle);
    const welcome = ShapeFactory.createText({ x: 170, y: 250, width: 275, height: 24, zIndex: z++ });
    welcome.content = 'Welcome back';
    welcome.fontSize = 24;
    welcome.fontWeight = '800';
    welcome.textAlign = 'center';
    s.push(welcome);
    const subWelcome = ShapeFactory.createText({ x: 170, y: 285, width: 275, height: 16, zIndex: z++ });
    subWelcome.content = 'Sign in to continue';
    subWelcome.fontSize = 13;
    subWelcome.fontWeight = '400';
    subWelcome.textAlign = 'center';
    subWelcome.fill = { color: '#71717a', opacity: 1 };
    s.push(subWelcome);
    const emailInput = ShapeFactory.createRectangle({ x: 150, y: 340, width: 315, height: 48, zIndex: z++ });
    emailInput.name = 'Email Input';
    emailInput.fill = { color: '#18181b', opacity: 0.8 };
    emailInput.stroke = { color: '#27272a', width: 1, opacity: 1 };
    emailInput.cornerRadius = 12;
    s.push(emailInput);
    const emailPlaceholder = ShapeFactory.createText({ x: 170, y: 354, width: 200, height: 16, zIndex: z++ });
    emailPlaceholder.content = 'Email address';
    emailPlaceholder.fontSize = 13;
    emailPlaceholder.fill = { color: '#52525b', opacity: 1 };
    s.push(emailPlaceholder);
    const passInput = ShapeFactory.createRectangle({ x: 150, y: 400, width: 315, height: 48, zIndex: z++ });
    passInput.name = 'Password Input';
    passInput.fill = { color: '#18181b', opacity: 0.8 };
    passInput.stroke = { color: '#27272a', width: 1, opacity: 1 };
    passInput.cornerRadius = 12;
    s.push(passInput);
    const passPlaceholder = ShapeFactory.createText({ x: 170, y: 414, width: 200, height: 16, zIndex: z++ });
    passPlaceholder.content = 'Password';
    passPlaceholder.fontSize = 13;
    passPlaceholder.fill = { color: '#52525b', opacity: 1 };
    s.push(passPlaceholder);
    const loginBtn = ShapeFactory.createRectangle({ x: 150, y: 480, width: 315, height: 48, zIndex: z++ });
    loginBtn.name = 'Login Button';
    loginBtn.fill = { color: '#6366f1', opacity: 1 };
    loginBtn.cornerRadius = 12;
    s.push(loginBtn);
    const loginText = ShapeFactory.createText({ x: 150, y: 494, width: 315, height: 16, zIndex: z++ });
    loginText.content = 'Sign In';
    loginText.fontSize = 14;
    loginText.fontWeight = '600';
    loginText.textAlign = 'center';
    s.push(loginText);
    const divider = ShapeFactory.createText({ x: 150, y: 560, width: 315, height: 14, zIndex: z++ });
    divider.content = '──── or continue with ────';
    divider.fontSize = 11;
    divider.textAlign = 'center';
    divider.fill = { color: '#52525b', opacity: 1 };
    s.push(divider);
    const socialBtns = ['Google', 'Apple', 'GitHub'];
    socialBtns.forEach((name, i) => {
      const btn = ShapeFactory.createRectangle({ x: 150 + i * 110, y: 600, width: 95, height: 44, zIndex: z++ });
      btn.name = `${name} Button`;
      btn.fill = { color: '#18181b', opacity: 0.6 };
      btn.stroke = { color: '#27272a', width: 1, opacity: 1 };
      btn.cornerRadius = 10;
      s.push(btn);
      const btnLabel = ShapeFactory.createText({ x: 150 + i * 110, y: 614, width: 95, height: 14, zIndex: z++ });
      btnLabel.content = name;
      btnLabel.fontSize = 11;
      btnLabel.fontWeight = '500';
      btnLabel.textAlign = 'center';
      s.push(btnLabel);
    });
    return s;
  }
  public static loadSlideDeck(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const slide = ShapeFactory.createFrame({ x: 80, y: 60, width: 1280, height: 720, zIndex: z++ });
    slide.name = 'Slide 16:9';
    slide.fill = { color: '#09090b', opacity: 1 };
    s.push(slide);
    const accentBar = ShapeFactory.createRectangle({ x: 80, y: 60, width: 6, height: 720, zIndex: z++ });
    accentBar.name = 'Accent Bar';
    accentBar.fill = { color: '#6366f1', opacity: 1 };
    accentBar.cornerRadius = 0;
    s.push(accentBar);
    const slideTitle = ShapeFactory.createText({ x: 160, y: 200, width: 600, height: 60, zIndex: z++ });
    slideTitle.content = 'Quarterly Business Review';
    slideTitle.fontSize = 48;
    slideTitle.fontWeight = '800';
    s.push(slideTitle);
    const slideSubtitle = ShapeFactory.createText({ x: 160, y: 280, width: 600, height: 30, zIndex: z++ });
    slideSubtitle.content = 'Q3 2024 · Performance & Strategy';
    slideSubtitle.fontSize = 18;
    slideSubtitle.fontWeight = '400';
    slideSubtitle.fill = { color: '#6366f1', opacity: 1 };
    s.push(slideSubtitle);
    const authorLine = ShapeFactory.createText({ x: 160, y: 660, width: 400, height: 14, zIndex: z++ });
    authorLine.content = 'Presented by Design Team · December 2024';
    authorLine.fontSize = 12;
    authorLine.fontWeight = '400';
    authorLine.fill = { color: '#52525b', opacity: 1 };
    s.push(authorLine);
    const graphicCircle = ShapeFactory.createEllipse({ x: 950, y: 250, width: 300, height: 300, zIndex: z++ });
    graphicCircle.name = 'Decorative Circle';
    graphicCircle.fill = { color: '#312e81', opacity: 0.2 };
    graphicCircle.stroke = { color: '#4f46e5', width: 2, opacity: 0.3 };
    s.push(graphicCircle);
    return s;
  }
  public static loadWebWireframe(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const frame = ShapeFactory.createFrame({ x: 80, y: 60, width: 1024, height: 768, zIndex: z++ });
    frame.name = 'Web Wireframe';
    frame.fill = { color: '#18181b', opacity: 1 };
    s.push(frame);
    const nav = ShapeFactory.createRectangle({ x: 80, y: 60, width: 1024, height: 48, zIndex: z++ });
    nav.name = 'WF Navbar';
    nav.fill = { color: '#27272a', opacity: 0.5 };
    nav.cornerRadius = 0;
    nav.stroke = { color: '#3f3f46', width: 1, opacity: 0.5 };
    s.push(nav);
    const heroBlock = ShapeFactory.createRectangle({ x: 180, y: 150, width: 824, height: 200, zIndex: z++ });
    heroBlock.name = 'WF Hero Block';
    heroBlock.fill = { color: '#27272a', opacity: 0.3 };
    heroBlock.stroke = { color: '#3f3f46', width: 1, opacity: 0.4, dashPattern: [6, 4] };
    heroBlock.cornerRadius = 8;
    s.push(heroBlock);
    for (let i = 0; i < 3; i++) {
      const block = ShapeFactory.createRectangle({ x: 180 + i * 280, y: 400, width: 250, height: 300, zIndex: z++ });
      block.name = `WF Column ${i + 1}`;
      block.fill = { color: '#27272a', opacity: 0.2 };
      block.stroke = { color: '#3f3f46', width: 1, opacity: 0.3, dashPattern: [6, 4] };
      block.cornerRadius = 8;
      s.push(block);
    }
    return s;
  }
  public static loadSocialPost(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const post = ShapeFactory.createFrame({ x: 120, y: 60, width: 540, height: 540, zIndex: z++ });
    post.name = 'Instagram Post 1080×1080';
    post.fill = { color: '#09090b', opacity: 1 };
    s.push(post);
    const bgGlow = ShapeFactory.createEllipse({ x: 200, y: 100, width: 380, height: 380, zIndex: z++ });
    bgGlow.name = 'Background Glow';
    bgGlow.fill = { color: '#4f46e5', opacity: 0.08 };
    bgGlow.stroke = { color: 'transparent', width: 0, opacity: 0 };
    s.push(bgGlow);
    const headline = ShapeFactory.createText({ x: 170, y: 200, width: 440, height: 40, zIndex: z++ });
    headline.content = 'Design Tips 2024';
    headline.fontSize = 36;
    headline.fontWeight = '800';
    headline.textAlign = 'center';
    s.push(headline);
    const tagline = ShapeFactory.createText({ x: 200, y: 260, width: 380, height: 20, zIndex: z++ });
    tagline.content = '5 principles every designer should know';
    tagline.fontSize = 14;
    tagline.fontWeight = '400';
    tagline.textAlign = 'center';
    tagline.fill = { color: '#a1a1aa', opacity: 1 };
    s.push(tagline);
    const badge = ShapeFactory.createRectangle({ x: 310, y: 320, width: 160, height: 36, zIndex: z++ });
    badge.name = 'CTA Badge';
    badge.fill = { color: '#6366f1', opacity: 1 };
    badge.cornerRadius = 18;
    s.push(badge);
    const badgeText = ShapeFactory.createText({ x: 310, y: 330, width: 160, height: 14, zIndex: z++ });
    badgeText.content = 'Read More →';
    badgeText.fontSize = 12;
    badgeText.fontWeight = '600';
    badgeText.textAlign = 'center';
    s.push(badgeText);
    const handle = ShapeFactory.createText({ x: 120, y: 560, width: 540, height: 16, zIndex: z++ });
    handle.content = '@yourbrand';
    handle.fontSize = 12;
    handle.fontWeight = '500';
    handle.textAlign = 'center';
    handle.fill = { color: '#52525b', opacity: 1 };
    s.push(handle);
    return s;
  }
  public static loadCardComponents(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const frame = ShapeFactory.createFrame({ x: 80, y: 60, width: 900, height: 600, zIndex: z++ });
    frame.name = 'Component Library';
    frame.fill = { color: '#0c0c0e', opacity: 1 };
    s.push(frame);
    const sectionTitle = ShapeFactory.createText({ x: 110, y: 90, width: 200, height: 20, zIndex: z++ });
    sectionTitle.content = 'Card Components';
    sectionTitle.fontSize = 18;
    sectionTitle.fontWeight = '700';
    s.push(sectionTitle);
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const card = ShapeFactory.createRectangle({ x: 110 + col * 270, y: 140 + row * 230, width: 240, height: 200, zIndex: z++ });
        card.name = `Card ${row * 3 + col + 1}`;
        card.fill = { color: '#18181b', opacity: 0.5 };
        card.stroke = { color: '#27272a', width: 1, opacity: 0.7 };
        card.cornerRadius = 16;
        s.push(card);
        const imgArea = ShapeFactory.createRectangle({ x: 120 + col * 270, y: 150 + row * 230, width: 220, height: 100, zIndex: z++ });
        imgArea.name = `Image Area ${row * 3 + col + 1}`;
        imgArea.fill = { color: ['#312e81', '#064e3b', '#7c2d12', '#4a1d96', '#1e3a5f', '#3f0e0e'][row * 3 + col], opacity: 0.3 };
        imgArea.cornerRadius = 12;
        s.push(imgArea);
        const cardTitle = ShapeFactory.createText({ x: 125 + col * 270, y: 266 + row * 230, width: 210, height: 14, zIndex: z++ });
        cardTitle.content = ['User Profile', 'Activity Feed', 'Settings', 'Notifications', 'Analytics', 'Team View'][row * 3 + col];
        cardTitle.fontSize = 13;
        cardTitle.fontWeight = '600';
        s.push(cardTitle);
        const cardDesc = ShapeFactory.createText({ x: 125 + col * 270, y: 286 + row * 230, width: 210, height: 14, zIndex: z++ });
        cardDesc.content = 'Component variant';
        cardDesc.fontSize = 10;
        cardDesc.fontWeight = '400';
        cardDesc.fill = { color: '#52525b', opacity: 1 };
        s.push(cardDesc);
      }
    }
    return s;
  }
  public static loadOnboarding(): Shape[] {
    const s: Shape[] = [];
    let z = 0;
    const screens = [
      { title: 'Welcome', subtitle: 'Your creative journey starts here', color: '#6366f1' },
      { title: 'Collaborate', subtitle: 'Work together in real-time', color: '#a855f7' },
      { title: 'Launch', subtitle: 'Ship your designs instantly', color: '#14b8a6' },
    ];
    screens.forEach((screen, i) => {
      const phone = ShapeFactory.createFrame({ x: 80 + i * 420, y: 60, width: 375, height: 812, zIndex: z++ });
      phone.name = `Onboarding Step ${i + 1}`;
      phone.fill = { color: '#09090b', opacity: 1 };
      s.push(phone);
      const illustration = ShapeFactory.createEllipse({ x: 180 + i * 420, y: 200, width: 200, height: 200, zIndex: z++ });
      illustration.name = `Illustration ${i + 1}`;
      illustration.fill = { color: screen.color, opacity: 0.1 };
      illustration.stroke = { color: screen.color, width: 2, opacity: 0.3 };
      s.push(illustration);
      const innerCircle = ShapeFactory.createEllipse({ x: 220 + i * 420, y: 240, width: 120, height: 120, zIndex: z++ });
      innerCircle.name = `Inner Circle ${i + 1}`;
      innerCircle.fill = { color: screen.color, opacity: 0.2 };
      s.push(innerCircle);
      const title = ShapeFactory.createText({ x: 130 + i * 420, y: 460, width: 275, height: 28, zIndex: z++ });
      title.content = screen.title;
      title.fontSize = 26;
      title.fontWeight = '800';
      title.textAlign = 'center';
      s.push(title);
      const sub = ShapeFactory.createText({ x: 130 + i * 420, y: 500, width: 275, height: 16, zIndex: z++ });
      sub.content = screen.subtitle;
      sub.fontSize = 14;
      sub.fontWeight = '400';
      sub.textAlign = 'center';
      sub.fill = { color: '#71717a', opacity: 1 };
      s.push(sub);
      const dots = ShapeFactory.createText({ x: 130 + i * 420, y: 700, width: 275, height: 14, zIndex: z++ });
      dots.content = ['● ○ ○', '○ ● ○', '○ ○ ●'][i];
      dots.fontSize = 10;
      dots.textAlign = 'center';
      dots.fill = { color: screen.color, opacity: 1 };
      s.push(dots);
      const nextBtn = ShapeFactory.createRectangle({ x: 160 + i * 420, y: 740, width: 255, height: 48, zIndex: z++ });
      nextBtn.name = `Next Button ${i + 1}`;
      nextBtn.fill = { color: screen.color, opacity: 1 };
      nextBtn.cornerRadius = 14;
      s.push(nextBtn);
      const nextText = ShapeFactory.createText({ x: 160 + i * 420, y: 754, width: 255, height: 16, zIndex: z++ });
      nextText.content = i < 2 ? 'Continue' : 'Get Started';
      nextText.fontSize = 14;
      nextText.fontWeight = '600';
      nextText.textAlign = 'center';
      s.push(nextText);
    });
    return s;
  }
}
