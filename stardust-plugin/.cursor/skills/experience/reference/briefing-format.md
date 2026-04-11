# Briefing Format

Briefings are human-authored structured documents that capture business intent. The agent helps draft them through conversation but the designer owns the content.

## Page Briefing Schema

```markdown
---
page: [Page Name]
path: /[url-path]
type: landing|product|about|contact|blog|custom
---

# Intent
[1-3 sentences: What is this page FOR? What should a visitor feel/do after seeing it?]

# Audience
[Who visits this page? Demographics, mindset, how they arrived (search, social, direct)]

# Key Messages
1. [Primary message — the one thing they must take away]
2. [Supporting message]
3. [Supporting message]

# Calls to Action
- Primary: [Main action — verb + object, e.g. "Explore Products"]
- Secondary: [Alternative action, e.g. "Browse Recipes"]

# Tone
[How should the voice adapt for this specific page? Reference brand voice but specify adjustments.]
```

## Site Briefing Schema

For multi-page sites, `stardust/briefings/_site.md` captures cross-cutting concerns:

```markdown
---
site: [Site Name]
pages: [homepage, products, about, contact]
---

# Purpose
[What is this website FOR as a whole?]

# Navigation
- [Primary nav items in order]
- [Footer nav structure if different]

# Shared Messaging
[Tagline, value proposition, or messaging that appears across pages]

# Content Hierarchy
[Which page is most important? How do pages relate to each other?]
```

Page briefings inherit context from the site briefing. They don't need to repeat shared information.

## Rules

1. The agent NEVER generates a briefing autonomously. It can help draft through conversation, but the designer must review and approve the content.
2. All briefing sections are optional except `Intent`. A minimal briefing is just the YAML frontmatter + Intent.
3. Briefings use plain language, not marketing jargon. "Make them want to buy" is better than "Drive conversion through compelling value articulation."
4. One briefing per page. The filename matches the page: `homepage.md`, `products.md`, `about.md`.
