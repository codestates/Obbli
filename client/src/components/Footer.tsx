function Footer () {
  if (window.location.pathname === '/') return null;

  return (
    <div className="footerWrap">
        <p>Copyright © 2021 team pen-pal.</p>
        <address>Contact webmaster for more information. 070-1234-5678</address>
    </div>
  )
}

export default Footer