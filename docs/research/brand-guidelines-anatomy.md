# Brand Guidelines Anatomy

What a comprehensive brand guidelines document contains, based on the Vitamix case study.

Source: https://my.corebook.io/vitamixguidelines (scraped via Playwright 2026-04-10)
Screenshots: /tmp/vitamix-*.png

## Vitamix Guidelines Structure

### Brand Overview
- **Philosophy/Mission**: Core belief statement. Vitamix: "We believe in the power of intentionality. We champion those who live deliberately."
- **Positioning**: Beyond product category. "More than a blender. It is a culinary instrument for mindful living."
- **Contact**: Owner of the brand guidelines (for questions)

### Visual Style Guide

#### Brand Logo
- **Primary logo**: The definitive version
- **Anatomy**: Component breakdown of the logo
- **Spacing**: Clear space rules (equal to diameter of one vortex element)
- **Color usage**: Full color (preferred), white on dark, black for B&W, white+grey alternative
- **Partnerships**: Co-branding rules (evenly spaced, separated by 1pt vertical rule)
- **Common errors**: Do/Don't examples (low contrast, distorted, tilted, wrong color, effects, obscured)

#### Secondary Mark (Vortex)
- Supplemental graphic, not logo replacement
- Requires creative team approval
- Anatomy, spacing, color variants, tone-on-tone usage rules

#### Colors
- **Primary palette** (4 colors):
  - Vitamix Red: Pantone 186C, #C8102E
  - Vitamix Gray: Pantone 429C, #A2AAAD
  - Vitamix Navy: Pantone 432C, #333F48
  - Vitamix White: #FFFFFF
- **Secondary palette** (6 colors): Neutral Cool #DCE0E7, Neutral Warm #F6ECE4, Mustard #DDB247, Ginger #CD7E59, Blueberry #A2B2BD, Pistachio #7B997C
- **Website palette**: Neutral backgrounds (#F5F5F5, #E0E1E3, #A2AAAD, #333F48), functional colors (Offer text #5E7D61, Announcement #8C1356, Links #1B68B4)
- **Usage examples**: Real-world application photos

#### Typography
- **Header**: Sentinel (Book, Medium, Bold) — for titles, promo messaging, product headings
- **Subheader**: Sentinel Book — short form copy support
- **Body copy**: Gotham Book or Gotham Narrow Book
- **Eyebrow text**: GOTHAM MEDIUM — all caps, above main heading
- **Button text**: Gotham Narrow Book
- **Rules**: Dollar signs half-size + top-aligned, "off" always lowercase, superscript TM/R symbols
- **Full character sets**: Displayed for each weight
- **Examples**: Email header and digital banner applications

#### Photo & Video
- **External/Studio**: Primarily in-studio for optimal lighting and accuracy. Guidelines downloadable for partners
- **General rules**: Don't over-prop, well-lit, product prominently featured, talent center frame, show real whole-food ingredients, two-camera setup for demo videos
- **Social content**: Shot on company iPhone via TikTok/CapCut/Instagram. Fluid not choppy, clear of machine, free space for text, cognizant of platform safety zones

### Voice + Tone Guide

#### Voice (Never Changes)
- **This**: Sophisticated, Informed, Witty, Discerning, Confident, Considered and to the point
- **Not this**: Stuffy, Clinical/overly technical, Jokey!, Snobby, Arrogant, Verbose
- **Character**: "The elevated experience-seeker" — pride without arrogance, explores beyond smoothies, understands cooking as meaningful
- **Sound rules**: NO excessive exclamation marks, NO overly technical, NO silly/playful
- **Examples**:
  - Bad: "Finally, introducing a blender that will chop, blend, puree and make all your neighbors jealous!"
  - Good: "It has arrived: the crown jewel of the countertop."
  - Bad: "You can rest assured with our 10-year warranty covering parts, labor and even shipping."
  - Good: "Your Vitamix comes with a warranty you'll probably never need."

#### Tone (Adapts by Context)
- Voice is who you are (permanent), tone is how you say it (contextual)
- Adapts to message, audience, and channel

#### Writing Goals & Principles
- **To Educate**: Communicate premium position using clear, simple language
- **To Engage**: Form lasting relationships, speak to where customers are today
- **To Inspire**: Show what's possible, positive life impact

#### Clever vs. Clear
- When to be witty vs. when to be direct
- Channel-specific tone guidance

#### Style Tips & Grammar
- Specific punctuation, capitalization, formatting rules
- Product naming conventions

### Social Media Playbook
- **Mission**: Why they're on social
- **Engagement**: How they interact with community
- **Content Pillars**: Recipes, Why Vitamix, Power of Products, Vitamix Inspiration
- **Platforms**: Channel-specific guidance
- **Sample Content**: Real examples per platform

### Target Personas
- **The Essentialist**: Mindful living, deliberate choices, quality over excess
  - Values: Quality, Durability, Intentionality, Simplicity
  - Stats: 46% prioritize tidy home, 7% impulse buy, 66% prefer experiences over things, 75% feel grounded by simple living
  - "Quality Begets Quality" — refuse to settle, pour resources into what matters

---

## Key Dimensions for Pipeline Extraction

A brand guidelines input (URL, PDF, or interactive session) needs to produce structured data across these dimensions:

| Dimension | What to Extract | Maps To |
|-----------|----------------|---------|
| **Logo** | SVG/PNG, clear space rules, color variants | `icons/`, header block |
| **Color Palette** | Primary + secondary + web hex values, Pantone codes | CSS custom properties in `styles.css` |
| **Typography** | Font families, weights, hierarchy (heading/subheading/body/eyebrow/button), sizing | `fonts.css`, `styles.css` type scale, Google Fonts or self-hosted |
| **Photography Style** | Lighting, composition, subject matter, do/don't | Image generation prompts, ai-image-generator style prefix |
| **Voice** | Personality traits, do/don't, examples | `.impeccable.md` brand personality, content generation prompts |
| **Tone** | Channel/context adaptation rules | Per-page content generation guidance |
| **Writing Goals** | Educate/Engage/Inspire balance | Briefing structure, copy generation |
| **Content Pillars** | Topic categories and their purpose | Site architecture, page planning |
| **Target Personas** | Who they are, what they value, their context | `.impeccable.md` audience, copy targeting |

## Mapping to Existing Skills

| Dimension | Primary Skill | Secondary Skill |
|-----------|--------------|-----------------|
| Overall extraction | `brand-extractor` → BrandProfile | `/impeccable teach` → `.impeccable.md` |
| Colors | `brand-css-generator` → CSS tokens | `/colorize` for refinement |
| Typography | `brand-css-generator` → font selection | `/typeset` for refinement |
| Photography | None — gap in current pipeline | `ai-image-generator` uses style prefix |
| Voice/Tone | `/impeccable teach` captures this | BrandProfile.tone[] captures tone words |
| Layout/Spacing | `brand-css-generator` → spacing scale | `/shape` for per-component planning |
| Personas | `/impeccable teach` captures audience | BrandProfile.audience for targeting |

## Gaps Identified

1. **Photography style extraction** — No skill currently extracts photo/video guidelines into a structured format usable by image generators
2. **Logo handling** — No automated extraction/optimization of logo assets for EDS (needs SVG in `icons/`, optimized PNG for header)
3. **Voice examples** — Brand voice do/don't examples aren't currently structured for use in content generation prompts
4. **Content pillar mapping** — No skill maps content pillars to site architecture automatically
5. **Tone adaptation rules** — Channel-specific tone rules aren't captured in any structured format
