import './PageHeader.css';

/**
 * PageHeader — reusable page-level hero banner
 *
 * Props:
 *  - title       (string, required)  — main heading
 *  - subtitle    (string)            — secondary line below title
 *  - icon        (string)            — emoji shown above title (large)
 *  - breadcrumb  (ReactNode)         — slot for breadcrumb content
 *  - stats       (Array<string>)     — small stat chips shown below subtitle
 *  - accentColor (string)            — overrides the default navy gradient
 *  - children    (ReactNode)         — extra content rendered below subtitle
 */
export default function PageHeader({
  title,
  subtitle,
  icon,
  breadcrumb,
  stats = [],
  accentColor,
  children,
}) {
  const style = accentColor
    ? { background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)` }
    : {};

  return (
    <div className={`page-header ${accentColor ? 'page-header--colored' : ''}`} style={style}>
      {breadcrumb && (
        <div className="container page-header__breadcrumb">{breadcrumb}</div>
      )}

      <div className="container page-header__body">
        {icon && <div className="page-header__icon">{icon}</div>}

        <h1 className="page-header__title">{title}</h1>

        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}

        {stats.length > 0 && (
          <div className="page-header__stats">
            {stats.map((s, i) => (
              <span key={i} className="page-header__stat">{s}</span>
            ))}
          </div>
        )}

        {children && <div className="page-header__extra">{children}</div>}
      </div>
    </div>
  );
}
