
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  LayoutDashboard,
  Package,
  Images,
  SlidersHorizontal,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "./Admin.css";
import ProductManager from "../components/admin/ProductManager";

type Section =
  | "overview"
  | "products"
  | "images"
  | "customisation"
  | "settings";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "images", label: "Image manager", icon: Images },
  { id: "customisation", label: "Customisation", icon: SlidersHorizontal },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] =
    useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setError(error.message);
      setUser(data.session?.user.email ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user.email ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);

    setLoginLoading(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      setUser(null);
      setActiveSection("overview");
    }
  }

  function changeSection(section: Section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  if (loading) {
    return (
      <main className="admin-loading">
        <div className="admin-loader" />
        <p>Loading MugumoNems Admin...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <div className="admin-brand">MUGUMONEMS</div>
          <p className="admin-eyebrow">PROJECTS ADMINISTRATION</p>

          <h1>Welcome back</h1>
          <p className="admin-login-description">
            Sign in to manage your product catalogue.
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="username"
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            {error && <p className="admin-error">{error}</p>}

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="admin-login-footer">
            MugumoNems Projects · Private Administration
          </p>
        </section>
      </main>
    );
  }

  const currentPage = navigation.find(
    (item) => item.id === activeSection
  );

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <button
          className="admin-mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand">MUGUMONEMS</div>
          <span>PROJECTS ADMIN</span>
          <button
            className="admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="admin-nav-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`admin-nav-item ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => changeSection(item.id)}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <span className="admin-nav-indicator" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-account">
            <div className="admin-avatar">
              {user.charAt(0).toUpperCase()}
            </div>
            <div className="admin-account-info">
              <strong>Administrator</strong>
              <span>{user}</span>
            </div>
          </div>

          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div className="admin-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{currentPage?.label}</strong>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-status-dot" />
            <span>Admin account</span>
          </div>
        </header>

        <div className="admin-content">
          {activeSection === "overview" && (
            <>
              <div className="admin-page-heading">
                <div>
                  <p className="admin-eyebrow">YOUR WORKSPACE</p>
                  <h1>Dashboard overview</h1>
                  <p>Manage your MugumoNems Projects catalogue.</p>
                </div>
                <div className="admin-date-label">
                  <ShieldCheck size={17} />
                  Private workspace
                </div>
              </div>

              <section className="admin-stats-grid">
                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Total products</span>
                    <Package size={20} />
                  </div>
                  <strong>—</strong>
                  <p>Awaiting database connection</p>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Published products</span>
                    <ArrowUpRight size={20} />
                  </div>
                  <strong>—</strong>
                  <p>Live catalogue records</p>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Product images</span>
                    <Images size={20} />
                  </div>
                  <strong>—</strong>
                  <p>Stored product photographs</p>
                </article>

                <article className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span>Draft products</span>
                    <Clock3 size={20} />
                  </div>
                  <strong>—</strong>
                  <p>Products awaiting publication</p>
                </article>
              </section>

              <section className="admin-overview-grid">
                <article className="admin-panel admin-welcome-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <p className="admin-eyebrow">GET STARTED</p>
                      <h2>Your product workspace</h2>
                    </div>
                    <Package size={22} />
                  </div>

                  <p>
                    Your administration workspace is ready. Start by
                    organising your products, product photography and
                    customisation options.
                  </p>

                  <button
                    className="admin-primary-button"
                    onClick={() => changeSection("products")}
                  >
                    <Plus size={18} />
                    Manage products
                  </button>
                </article>

                <article className="admin-panel admin-setup-panel">
                  <p className="admin-eyebrow">WORKSPACE SETUP</p>
                  <h2>What's next?</h2>

                  <div className="admin-setup-item">
                    <span className="admin-setup-number">01</span>
                    <div>
                      <strong>Product database</strong>
                      <p>Connect the catalogue to Supabase.</p>
                    </div>
                  </div>

                  <div className="admin-setup-item">
                    <span className="admin-setup-number">02</span>
                    <div>
                      <strong>Image storage</strong>
                      <p>Set up product photo uploads.</p>
                    </div>
                  </div>

                  <div className="admin-setup-item">
                    <span className="admin-setup-number">03</span>
                    <div>
                      <strong>Public catalogue</strong>
                      <p>Publish products to your website.</p>
                    </div>
                  </div>
                </article>
              </section>

              <section className="admin-panel admin-activity-panel">
                <div className="admin-panel-heading">
                  <div>
                    <p className="admin-eyebrow">WORKSPACE</p>
                    <h2>Recent activity</h2>
                  </div>
                </div>
                <div className="admin-empty-state">
                  <Clock3 size={27} />
                  <strong>No activity yet</strong>
                  <p>
                    Your product and publishing activity will appear here
                    once we connect the database.
                  </p>
                </div>
              </section>
            </>
          )}

          {activeSection === "products" && <ProductManager />}

{activeSection === "images" && (
  <section className="admin-section">
    <div className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">MEDIA LIBRARY</p>
        <h1>Image manager</h1>
        <p>Organise product photography and galleries.</p>
      </div>
    </div>
    <div className="admin-panel">
      <div className="admin-empty-state">
        <Images size={34} />
        <strong>Your image library is waiting</strong>
        <p>
          We'll connect Supabase Storage so you can upload
          multiple images and assign them to products.
        </p>
      </div>
    </div>
  </section>
)}

          {activeSection === "images" && (
            <section className="admin-section">
              <div className="admin-page-heading">
                <div>
                  <p className="admin-eyebrow">MEDIA LIBRARY</p>
                  <h1>Image manager</h1>
                  <p>Organise product photography and galleries.</p>
                </div>
              </div>
              <div className="admin-panel">
                <div className="admin-empty-state">
                  <Images size={34} />
                  <strong>Your image library is waiting</strong>
                  <p>
                    We'll connect Supabase Storage so you can upload
                    multiple images and assign them to products.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSection === "customisation" && (
            <section className="admin-section">
              <div className="admin-page-heading">
                <div>
                  <p className="admin-eyebrow">PRODUCT OPTIONS</p>
                  <h1>Customisation</h1>
                  <p>Manage the options customers can choose.</p>
                </div>
              </div>
              <div className="admin-placeholder-grid">
                {[
                  ["Colours", "Manage available product colours."],
                  ["Sizes", "Manage apparel and product sizes."],
                  ["Product options", "Configure product-specific fields."],
                ].map(([title, description]) => (
                  <article className="admin-panel" key={title}>
                    <SlidersHorizontal size={22} />
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <span className="admin-coming-soon">Setup pending</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSection === "settings" && (
            <section className="admin-section">
              <div className="admin-page-heading">
                <div>
                  <p className="admin-eyebrow">ACCOUNT</p>
                  <h1>Settings</h1>
                  <p>Administrator account information.</p>
                </div>
              </div>
              <div className="admin-panel admin-settings-card">
                <div className="admin-settings-row">
                  <div>
                    <span>Email address</span>
                    <strong>{user}</strong>
                  </div>
                  <ShieldCheck size={22} />
                </div>
                <div className="admin-settings-row">
                  <div>
                    <span>Account type</span>
                    <strong>Authenticated administrator</strong>
                  </div>
                </div>
                <button className="admin-logout-button" onClick={handleLogout}>
                  <LogOut size={17} />
                  Sign out
                </button>
              </div>
            </section>
          )}

          <footer className="admin-footer">
            <span>MUGUMONEMS PROJECTS</span>
            <span>PRIVATE ADMINISTRATION</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Admin;
