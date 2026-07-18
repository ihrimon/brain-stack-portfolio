/**
 * Renders a schema.org JSON-LD payload as a `<script type="application/ld+json">`.
 * The one place this project serializes structured data — every page uses
 * this instead of hand-building a script tag, so escaping/consistency lives
 * in exactly one spot.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` is escaped to < so a Sheets-sourced string field (a blog
      // title or project name an editor doesn't fully control) can't
      // prematurely close this </script> tag and inject markup.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
