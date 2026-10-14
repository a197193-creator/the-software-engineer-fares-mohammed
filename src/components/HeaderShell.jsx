// One header shell; the gateway supplies its skip action, the portfolio its navigation.
export default function HeaderShell({ children, className = "" }) {
  return <header className={className}>{children}</header>;
}
