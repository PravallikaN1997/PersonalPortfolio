import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <section className="closing" aria-label="End of file">
        <div className="wrap closing__inner">
          <div className="closing__lead">
            <p className="mono closing__lab">
              <span aria-hidden="true">{"//////// "}</span>END OF FILE
            </p>
            <p className="closing__big">still loading, still collecting.</p>
          </div>
          <div className="closing__copy">
            <div className="closing__text">
              <p>
                currently becoming a person with more stories, more stamps in the mental scrapbook, more muscle, and
                probably another book on the bedside table.
              </p>
              <p>thanks for visiting my little corner of the internet &#9825;</p>
            </div>
            <div className="closing__side">
              <span className="closing__kao" aria-hidden="true">
                (づ￣ ³￣)づ
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.5C6 16 3 12.8 3 9.2 3 6.6 5 4.8 7.3 4.8c1.9 0 3.5 1.2 4.7 3 1.2-1.8 2.8-3 4.7-3C19 4.8 21 6.6 21 9.2c0 3.6-3 6.8-9 11.3Z" />
                </svg>
              </span>
              <ul className="closing__links">
                <li>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 2.5h14A2.5 2.5 0 0 1 21.5 5v14a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 19V5A2.5 2.5 0 0 1 5 2.5Zm1 6.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6ZM4.8 9.8v8.4h2.4V9.8H4.8Zm4 0v8.4h2.4v-4.4c0-1.1.5-1.9 1.5-1.9 1 0 1.3.7 1.3 1.8v4.5h2.4v-5c0-2.2-1.1-3.5-2.9-3.5-1 0-1.9.5-2.3 1.2h-.1V9.8H8.8Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 4.5h14A2.5 2.5 0 0 1 21.5 7v10a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 17V7A2.5 2.5 0 0 1 5 4.5Zm-.4 2.4 7.4 5.6 7.4-5.6-.8-1H5.4l-.8 1Z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
