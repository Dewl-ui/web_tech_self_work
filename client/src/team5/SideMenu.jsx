import { Link, useLocation } from "react-router-dom";

const SideMenu = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      width: "220px",
      background: "#FFFFFF",
      borderRight: "1px solid #E2E5EF",
      display: "flex",
      flexDirection: "column",
      zIndex: 100,
    }}>
      {/* Brand Header */}
      <div style={{ height: "75px", borderBottom: "1px solid #E2E5EF", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px", flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, background: "#3B6FF5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "11.5px", color: "#1A1D2E" }}>Их Сургуулийн Систем</div>
          <div style={{ fontSize: "9px", color: "#8A90AB", marginTop: 2 }}>Асуултын Удирдлага</div>
        </div>
      </div>

      {/* Current Course */}
      <div style={{ margin: "10px", background: "#EEF2FE", border: "1px solid #C7D4FC", borderRadius: 10, padding: "9px 11px", flexShrink: 0 }}>
        <div style={{ fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "#3B6FF5" }}>Одоогийн хичээл</div>
        <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#1A1D2E", marginTop: 2 }}>Мэдээлэл зүй</div>
        <div style={{ fontSize: "9.5px", color: "#3B6FF5", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>CS101 ▾</div>
      </div>

      {/* Nav - scrollable */}
      <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
        <SectionLabel>Үндсэн</SectionLabel>
        <NavItem to="/team5/dashboard" icon="⊞" active={isActive("/team5/dashboard")}>Хяналтын самбар</NavItem>
        <NavItem to="/team5/courses" icon="📚" active={isActive("/team5/courses")} badge={{ text: "8", color: "green" }}>Хичээлүүд</NavItem>

        <Divider />
        <SectionLabel>Асуултын Сан</SectionLabel>

        <NavItem to="/team5/question-types" icon="🏷️" active={isActive("/team5/question-types")}>Асуултын төрөл</NavItem>
        <NavItem to="/team5/question-levels" icon="📶" active={isActive("/team5/question-levels")}>Асуултын түвшин</NavItem>
        <NavItem to="/team5/questions" icon="📋" active={isActive("/team5/questions")} badge={{ text: "82", color: "amber" }}>Асуулт жагсаалт</NavItem>
        <NavItem to="/team5/points" icon="⭐" active={isActive("/team5/points")}>Асуултын оноо</NavItem>

        <Divider />
        <NavItem to="/team5/reports" icon="📈" active={isActive("/team5/reports")}>Тайлан / Статистик</NavItem>
      </nav>

      {/* Footer */}
      <div style={{ height: 61, borderTop: "1px solid #E2E5EF", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, background: "#3B6FF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>Б</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#1A1D2E", lineHeight: 1.4 }}>
          Батбаяр Д.
          <div style={{ fontWeight: 400, color: "#8A90AB", fontSize: 10 }}>Профессор · CS</div>
        </div>
      </div>
    </aside>
  );
};

const SectionLabel = ({ children }) => (
  <div style={{ padding: "14px 14px 6px", fontSize: "8.5px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#BCC0D4" }}>
    {children}
  </div>
);

const Divider = () => (
  <div style={{ height: 1, background: "#E2E5EF", margin: "8px 14px" }} />
);

const NavItem = ({ to, icon, children, active, badge }) => (
  <Link
    to={to}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "7px 14px",
      borderRadius: 6,
      margin: "1px 7px",
      textDecoration: "none",
      background: active ? "#EEF2FE" : "transparent",
      position: "relative",
    }}
  >
    {active && (
      <div style={{ position: "absolute", left: -7, top: 5, bottom: 5, width: 3, background: "#3B6FF5", borderRadius: "0 2px 2px 0" }} />
    )}
    <span style={{ fontSize: 13, width: 16, textAlign: "center", flexShrink: 0 }}>{icon}</span>
    <span style={{ fontSize: "11.5px", color: active ? "#3B6FF5" : "#4A4F6A", fontWeight: active ? 700 : 400, flex: 1 }}>
      {children}
    </span>
    {badge && (
      <span style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "1px 5px",
        borderRadius: 10,
        fontFamily: "JetBrains Mono, monospace",
        background: badge.color === "green" ? "#DCFCE7" : "#FEF3C7",
        color: badge.color === "green" ? "#16A34A" : "#D97706",
      }}>
        {badge.text}
      </span>
    )}
  </Link>
);

export default SideMenu;