// The site's legal notices.
//
// ── What these are, and what they are not ────────────────────────────────────
//
// These are plain-language notices describing how this site actually behaves,
// written against the repository rather than adapted from a template. Every
// factual claim in them is checkable here: the forms compose a `mailto:` and
// send nothing to a server (`src/components/InquiryForm.tsx`), no cookie or
// storage key is ever written (`src/components/CtaAnalytics.tsx`, and nothing
// else in `src/` touches `localStorage`, `sessionStorage`, or `document.cookie`),
// and the video stage embeds through `youtube-nocookie.com` only after a click
// (`src/components/WatchStage.tsx`).
//
// They have not been reviewed by counsel. That is why nothing here states a
// governing law, a forum, a registered entity, or a data-controller identity:
// Sagitta Labs is an umbrella brand rather than an incorporated entity
// (`identityHierarchy` in `site.ts`), so there is no entity to name and naming
// one would be an invention. Those clauses are listed as outstanding in
// `openQuestions` below and are surfaced to the reader rather than hidden.

/** A block of a notice: an optional sub-heading, prose, and an optional list. */
export interface LegalBlock {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalNotice {
  /** Anchor and `#fragment` used in the index. */
  id: string;
  title: string;
  /** One line, shown in the index at the top of the page. */
  summary: string;
  /** Date this text took effect, YYYY-MM-DD. */
  effectiveFrom: string;
  blocks: LegalBlock[];
}

const EFFECTIVE = "2026-08-02";

export const legalNotices: LegalNotice[] = [
  {
    id: "terms",
    title: "Terms of use",
    summary: "Terms governing use of sagitta.systems and its published material.",
    effectiveFrom: EFFECTIVE,
    blocks: [
      {
        paragraphs: [
          "sagitta.systems is the public record of Sagitta Systems, the development identity behind Sagitta's continuity, allocation, and capital infrastructure, operating within the Sagitta Labs umbrella. It is published for information. Using the site means accepting the terms on this page.",
        ],
      },
      {
        heading: "What you may do",
        paragraphs: [
          "Read, link to, quote, and cite anything published here, with attribution to Sagitta Systems and a link to the page you took it from. Press and media material carries its own conditions, stated in the Press Room and the Media Library, and those conditions govern that material.",
        ],
      },
      {
        heading: "What you may not do",
        list: [
          "Present material published here as your own, or remove attribution from it.",
          "Alter a figure, date, operating state, or quotation and continue to attribute it to Sagitta.",
          "Republish a page or document in substantial part in place of linking to it.",
          "Use the site's material to imply an endorsement, partnership, engagement, or customer relationship that does not exist.",
          "Collect from the site by automated means at a rate that degrades it for other readers, or attempt to reach any part of it that is not published.",
        ],
      },
      {
        heading: "What the site does not promise",
        paragraphs: [
          "Material here is published as at the date each item carries. Operating states change, roadmap positions move, and figures are either dated snapshots or standing values read from the operating surface itself — a figure without a date is one the product keeps current, not one we forgot to date. Nothing on this site is an offer, a commitment to deliver, a guarantee of availability, or a contract.",
          "The site is provided as it stands. Sagitta Systems does not warrant that it will be uninterrupted or error-free, and is not liable for loss arising from reliance on material published here, to the extent the law permits that limitation.",
        ],
      },
      {
        heading: "Other destinations",
        paragraphs: [
          "This site links to other Sagitta surfaces on their own subdomains and to third-party hosts including GitBook, YouTube, X, LinkedIn, and Paragraph. Each has its own terms and its own privacy practice, and none of them is governed by this page.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "These terms may change. The version in effect is the one published here, carrying the date shown against it.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy notice",
    summary:
      "How Sagitta Systems handles information submitted through this site. What the site measures is stated in full below, and is published rather than pending.",
    effectiveFrom: EFFECTIVE,
    blocks: [
      {
        paragraphs: [
          "This notice covers sagitta.systems. Other Sagitta surfaces — the product hosts on their own subdomains — publish their own notices, and this one does not speak for them.",
        ],
      },
      {
        heading: "What the site collects",
        paragraphs: [
          "There is no account, no login, and no reader profile. The site records which calls to action are taken and which routes they are taken from, and counts page views; that measurement is set out in full in \"What this site measures\" further down this page. It sets no cookie, assigns no identifier, and writes nothing to your browser's storage, so those records cannot be assembled into a session or attributed to a person.",
        ],
      },
      {
        heading: "Forms and correspondence",
        paragraphs: [
          "The contact, careers, and inquiry forms on this site do not submit anything to a server. Pressing the button composes an addressed message in your own mail client, which you then choose to send or not send. Nothing you type reaches Sagitta unless you send that message.",
          "When you do write to us, we hold your message and contact details for as long as needed to answer it and to keep a record of the exchange, and we use them for nothing else. We do not sell them, and we do not add you to a mailing list you did not ask for.",
        ],
      },
      {
        heading: "Hosting",
        paragraphs: [
          "This site is a set of static files. The host serving them may keep ordinary request logs — IP address, user agent, time, and path — for security and reliability, under its own retention policy. Sagitta Systems does not use those logs to build reader profiles or to identify individual readers.",
        ],
      },
      {
        heading: "Third parties",
        paragraphs: [
          "No analytics script, advertising network, or social tracking pixel is loaded on this site. Video posters are stored locally, so no request reaches YouTube before you press play; the embed is created on that click and uses the privacy-enhanced youtube-nocookie.com host. Once you press play, YouTube receives the request and its own privacy policy applies to it.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "Do Not Track and Global Privacy Control are honoured as instructions: a browser sending either signal is not measured at all. To ask for a copy, a correction, or the deletion of anything you have sent us by email, write to the address at the foot of this page and we will act on it.",
        ],
      },
      {
        heading: "Children",
        paragraphs: [
          "This site is aimed at institutional and professional readers. It is not directed at children, and no material here is designed to collect information from them.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookie notice",
    summary: "Cookie use on sagitta.systems.",
    effectiveFrom: EFFECTIVE,
    blocks: [
      {
        paragraphs: [
          "This site sets no cookies. Not for analytics, not for advertising, not for preferences, and not for measurement. It also writes nothing to local storage or session storage and derives no device or browser fingerprint. That is why you were never shown a cookie banner: there is nothing to consent to.",
          "The one exception is a choice you make. If you press play on a video, an embed is created at that moment on the privacy-enhanced youtube-nocookie.com host, and YouTube may then set storage of its own under its terms rather than ours. Until that click, no request leaves this site for a third-party host.",
          "If this ever changes — if some future feature genuinely needs a cookie — this notice changes first, and the change carries a date.",
        ],
      },
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    summary: "Nothing published on this site is financial, investment, legal, or tax advice.",
    effectiveFrom: EFFECTIVE,
    blocks: [
      {
        paragraphs: [
          "Nothing published on sagitta.systems is financial, investment, legal, or tax advice, and nothing here is a recommendation to buy, sell, or hold any asset. Nothing on this site is an offer or a solicitation of an offer to buy or sell any security or financial instrument, in any jurisdiction where such an offer would be unlawful.",
        ],
      },
      {
        heading: "On the systems described here",
        list: [
          "Digital assets are volatile and can lose their entire value. Smart contracts can fail, and so can the infrastructure they depend on.",
          "A system described as being on a testnet is on a testnet. Testnet deployments carry no real value and are not production systems.",
          "Operating states — Operating, Public Test, In Development, Research Horizon — describe a system as at the date shown against it, and change.",
          "Sample outputs, including the sample Defense Review report, are specimens produced on illustrative input. They are not customer results and do not describe any real engagement.",
          "Architecture briefs describe a specified design. A specified control surface or rail is not a delivered integration.",
        ],
      },
      {
        heading: "Forward-looking statements",
        paragraphs: [
          "Roadmap positions, planned capabilities, and anything else describing intent are statements of current intention, not commitments. They are subject to change without notice, and no reader should make a decision on the assumption that a planned item will ship, or ship in the form described.",
        ],
      },
      {
        heading: "Independent advice",
        paragraphs: [
          "Any decision about capital, risk, or the security of a protocol you operate is yours, and should be taken with advice appropriate to your circumstances and jurisdiction. Sagitta Systems accepts no liability for decisions taken on the basis of material published here.",
        ],
      },
    ],
  },
  {
    id: "trademarks",
    title: "Trademarks and brand use",
    summary: "Use of the Sagitta name and marks.",
    effectiveFrom: EFFECTIVE,
    blocks: [
      {
        paragraphs: [
          "\"Sagitta\", \"Sagitta Labs\", \"Sagitta Systems\", the names of the systems — including the Autonomous Allocation Agent, the Sagitta Continuity Engine, Sagitta Protocol, Sagitta Defense, Sagitta Radar, Sagitta Banking, Sagitta Wallet, and Selun — and the Sagitta marks and wordmarks are ours. Copyright in the text, reports, diagrams, and imagery published on this site belongs to Sagitta Systems unless something states otherwise.",
        ],
      },
      {
        heading: "Editorial and referential use",
        paragraphs: [
          "Journalists, researchers, and anyone writing about Sagitta may use the name and the marks to refer to us. The Press Room and the Media Library hold the approved logo files, the correct spellings, and the descriptions we would like used; taking them from there is easier than recreating them and keeps the record consistent.",
        ],
      },
      {
        heading: "What we ask you not to do",
        list: [
          "Alter, recolour, stretch, or recompose a Sagitta mark, or use it as part of another mark.",
          "Use the name or marks in a way that implies endorsement, partnership, certification, or a customer relationship that does not exist.",
          "Use the name or a mark in your own product name, company name, domain name, social account name, or application identity.",
          "Attach the name to a token, ticker, exchange listing, or fundraise, or represent any such thing as issued, endorsed, or audited by Sagitta.",
          "Use the marks in a way that suggests a system is operating, audited, or delivered when the record here says otherwise.",
        ],
      },
      {
        heading: "If you are unsure",
        paragraphs: [
          "Ask. Brand questions reach the same address as any other legal enquiry, and a short question answered before publication is easier for everyone than a correction after it.",
        ],
      },
    ],
  },
];

/**
 * Clauses a normal legal pack contains and these notices deliberately do not.
 *
 * Rendered on the page. Each one depends on a fact that does not exist yet, and
 * the site's rule is that a missing fact is stated rather than filled in.
 */
export const openQuestions: { title: string; note: string }[] = [
  {
    title: "Governing law and forum",
    note: "Sagitta Labs is an umbrella brand rather than an incorporated entity, so there is no company, jurisdiction of incorporation, or registered address to state. These notices will name a governing law and a forum once there is an entity to name them for.",
  },
  {
    title: "Data controller and registered address",
    note: "For the same reason, no controller identity or postal address is published. The contact address below reaches the people who would answer either way.",
  },
  {
    title: "Legal review",
    note: "These notices were written against how this site actually behaves and have not been reviewed by counsel. They describe practice accurately; they are not a substitute for a reviewed legal pack, and they will be replaced by one.",
  },
];
