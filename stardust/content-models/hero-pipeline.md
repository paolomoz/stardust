# hero-pipeline

Hero block with an eyebrow, two-line headline, lede paragraph, two CTAs, and an inline 7-step pipeline diagram split across two phases.

## DA table

| hero-pipeline |                                                                                                       |
|---------------|-------------------------------------------------------------------------------------------------------|
| eyebrow       | A SLICC sibling · Claude Code plugin                                                                  |
| headline      | From brand to shipped EDS site.                                                                       |
| lede          | Seven skills, two phases, one `aem-boilerplate` project at the other end.                             |
| ctas          | **Install Stardust** (link to #install) · *View on GitHub* (link to repo)                             |
| steps         | 01 brand, 02 briefings, 03 wireframes, 04 design \| 05 eds-design, 06 eds-build, 07 eds-refine        |
| phases        | Design phase — platform-agnostic \| EDS phase — aem-boilerplate                                       |

Rules:
- `steps` cell: pipe (`|`) separates design-phase and EDS-phase groups; comma separates steps within a group.
- `phases` cell: pipe separates the two phase labels, in the same order as steps.
- CTAs authored as two separate paragraphs; `<strong>` = primary, `<em>` = secondary.
