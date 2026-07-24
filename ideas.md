# LaMi Command Center — Design Ground Truth

This project is a REPLICATION/EXECUTION of a fully-specified design brief provided by the user
(see /home/ubuntu/upload/pasted_content.txt). The brief is the ground-truth spec and overrides
all other stylistic guidance. No alternative design directions are explored.

## Chosen Approach (per client brief)
- **Theme**: "Quiet Luxury Concierge" — a warm-cream, teal-and-gold private-office aesthetic for a
  Dubai lifestyle-management client. The system reports to the client; she never asks.

## Enforced Design System
- Colors: primary teal #145A52, dark teal #0E3F3A, gold accent #B8912E (completion/accent ONLY),
  background warm cream #F7F5F1 (never pure white), card #FFFFFF, text #1A1A1A / #6B7280,
  gold tint bg #FBF6E8, teal tint bg #EEF7F5, utility green #7B9E87.
- Typography: Cormorant Garamond (Display italic 36, H1 28, H2 22, H3 18) + Inter (body 14 lh1.6,
  caption 12/500, button 14/600). NO other sizes.
- Cards: white, radius 16px, shadow 0 2px 16px rgba(14,63,58,.08), padding 18px, no harsh borders,
  4px left accent strip by status (gold=awaiting, teal=in-progress, #7B9E87=bill, grey=done).
- Header: 64px #0E3F3A, gold LM badge, flag-emoji language switcher (PT/EN/HE) with gold ring,
  1px gold bottom border, blur on scroll.
- Motion: Framer Motion everywhere — staggered page load, tab slide transitions, case detail
  slide-in from right, completion fold-away with gold flash, decision morph-to-checkmark.
- Trilingual PT/EN/HE with full RTL mirroring for Hebrew.
- PWA: manifest theme #0E3F3A, LM icons, service worker cache-first assets / network-first API.
