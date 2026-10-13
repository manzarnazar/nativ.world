<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sm xhtml">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap — eStay</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f5f7fa;
            color: #1a1a2e;
            min-height: 100vh;
          }

          header {
            background: #1a73e8;
            color: #fff;
            padding: 24px 32px;
          }
          header h1 { font-size: 1.5rem; font-weight: 700; }
          header p  { font-size: 0.875rem; opacity: 0.85; margin-top: 4px; }

          .stats {
            display: flex;
            gap: 16px;
            padding: 20px 32px;
            background: #fff;
            border-bottom: 1px solid #e2e8f0;
            flex-wrap: wrap;
          }
          .stat {
            background: #f0f4ff;
            border-radius: 8px;
            padding: 10px 18px;
            font-size: 0.82rem;
            color: #1a73e8;
            font-weight: 600;
          }
          .stat span { color: #555; font-weight: 400; margin-left: 4px; }

          .container { padding: 24px 32px; max-width: 1400px; margin: 0 auto; }

          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0,0,0,.08);
            font-size: 0.875rem;
          }
          thead tr { background: #1a73e8; color: #fff; }
          thead th { padding: 13px 16px; text-align: left; font-weight: 600; white-space: nowrap; }
          tbody tr { border-bottom: 1px solid #f0f4ff; }
          tbody tr:last-child { border-bottom: none; }
          tbody tr:hover { background: #f8faff; }
          tbody td { padding: 11px 16px; vertical-align: middle; }

          a { color: #1a73e8; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }

          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 99px;
            font-size: 0.75rem;
            font-weight: 600;
            white-space: nowrap;
          }
          .freq-daily   { background: #dcfce7; color: #166534; }
          .freq-weekly  { background: #dbeafe; color: #1e40af; }
          .freq-monthly { background: #fef9c3; color: #854d0e; }
          .freq-yearly  { background: #fee2e2; color: #991b1b; }

          .priority { font-weight: 700; color: #1a73e8; }

          .lang-list { display: flex; gap: 4px; flex-wrap: wrap; }
          .lang-tag {
            background: #e0e7ff;
            color: #3730a3;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>eStay — XML Sitemap</h1>
        </header>

        <div class="stats">
          <div class="stat"><xsl:value-of select="count(sm:urlset/sm:url)"/><span>total URLs</span></div>
          <div class="stat"><xsl:value-of select="count(sm:urlset/sm:url[sm:changefreq='daily'])"/><span>daily</span></div>
          <div class="stat"><xsl:value-of select="count(sm:urlset/sm:url[sm:changefreq='weekly'])"/><span>weekly</span></div>
          <div class="stat"><xsl:value-of select="count(sm:urlset/sm:url[sm:changefreq='monthly'])"/><span>monthly</span></div>
          <div class="stat"><xsl:value-of select="count(sm:urlset/sm:url[sm:changefreq='yearly'])"/><span>yearly</span></div>
        </div>

        <div class="container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Frequency</th>
                <th>Priority</th>
                <th>Alternates</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sm:urlset/sm:url">
                <tr>
                  <td><xsl:value-of select="position()"/></td>
                  <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                  <td>
                    <span>
                      <xsl:attribute name="class">badge freq-<xsl:value-of select="sm:changefreq"/></xsl:attribute>
                      <xsl:value-of select="sm:changefreq"/>
                    </span>
                  </td>
                  <td class="priority"><xsl:value-of select="sm:priority"/></td>
                  <td>
                    <div class="lang-list">
                      <xsl:for-each select="xhtml:link[@rel='alternate']">
                        <span class="lang-tag"><xsl:value-of select="@hreflang"/></span>
                      </xsl:for-each>
                    </div>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
