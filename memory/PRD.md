# Kirti Killedar Artist Portfolio Website - PRD

**Project:** Personal Artist Website for Kirti Killedar (Singer & Actress)  
**Last Updated:** December 2024  
**Status:** Frontend Complete with Mock Data

---

## Original Problem Statement

Build a website for Kirti Killedar, an ace singer and budding actress, with:
- Clean, elegant personal website
- Charulata-era Bengali aesthetic mixed with modern editorial design
- Calm, intelligent, quietly confident tone
- Soft minimalism with strong typography
- Target audience: creative collaborators, directors, producers, and audiences

---

## Design Aesthetic

**Color Palette:**
- Vintage cream (#f5f1e8) - main background
- Vintage paper (#e8dcc4) - section backgrounds
- Warm brown (#3d2817) - primary text
- Sepia dark (#4a3728) - secondary text
- Vintage gold (#b8935e) - accent color
- Antique white (#faebd7) - highlights

**Typography:**
- Display: Cormorant Garamond (elegant serif)
- Body: Crimson Text (readable serif)
- Tracking: Wide letter spacing for headings
- Hierarchy: Large display type, generous whitespace

**Visual Style:**
- Vintage photograph frames and borders
- Sepia-toned and grayscale images (30-35%)
- Decorative vintage ornaments (diamonds, lines)
- Generous whitespace and breathing room
- Subtle texture overlay for aged paper effect
- Corner accents on images (vintage photo aesthetic)

---

## Architecture

**Frontend:** React with React Router  
**Styling:** Tailwind CSS with custom vintage palette  
**Components:** Shadcn UI (minimal usage)  
**Fonts:** Google Fonts (Cormorant Garamond, Crimson Text)  
**Images:** Unsplash (curated elegant portraits)  

**Backend (Not Yet Implemented):** FastAPI + MongoDB planned

---

## User Personas

1. **Film Directors & Producers**
   - Looking for talented actress with depth
   - Need to understand her artistic sensibility
   - Want to see portfolio and performance samples

2. **Music Event Organizers**
   - Seeking classical/contemporary singers
   - Need professional presentation
   - Looking for booking contact info

3. **Creative Collaborators**
   - Fellow artists seeking partnerships
   - Interested in her artistic philosophy
   - Want authentic connection

4. **Audience & Fans**
   - Discovering her work
   - Following her artistic journey
   - Connecting through writing/thoughts

---

## Implemented Features (December 2024)

### ✅ Home Page
- **Hero Section:** Large elegant portrait, "Kirti" headline, tagline
- **Introduction:** Personal paragraph about artistic sensibility
- **Selected Work:** 3 featured projects with images
- **Gallery Preview:** 4 artistic photographs
- **Writing/Thoughts:** Essay excerpts
- **Contact Section:** CTA with decorative ornaments

### ✅ About Page
- **Personal Introduction:** Emotional honesty and curiosity
- **Background Section:** Origin story, musical training, influences
- **Approach Section:** Working philosophy (listen, observe, truth)
- **Influences Section:** Cinema (Satyajit Ray), Literature, Theatre, Human behavior
- **Skills/Areas of Practice:** Structured list
- **Portrait & Quote:** Large image with inspirational quote

### ✅ Work Page (WITH MEDIA PLAYERS)
- **Project Grid:** 2-column layout with hover effects
- **Media Indicators:** Music 🎵 and Video 🎬 icons on project cards
- **Project Cards:** Title, type, year, description, sepia images
- **Expandable Detail Modal:** 
  - Project summary
  - **Audio Player:** Custom vintage-styled player with play/pause, seek bar, time display, mute controls
  - **Video Player:** YouTube/external video embed with vintage thumbnail overlay
  - Creative process description
  - Behind-the-scenes notes
  - Full-screen vintage-framed view
  - Close button with smooth exit

### ✅ Gallery Page
- **Category Filter:** All, Portraits, Moments, Work Stills, Behind the Scenes
- **Minimal Grid:** 3-column layout with generous gaps
- **Sepia-toned Images:** Vintage aesthetic (35% grayscale)
- **Lightbox View:** Full-screen with vintage frame and ornaments
- **Contemplative Design:** Calm, spacious, elegant

### ✅ Writing Page
- **Blog-style Articles:** Expandable content
- **Personal Essays:** Reflections on art and creativity
- **Newsletter Signup:** Email subscription form (mock)
- **Elegant Typography:** Large readable text

### ✅ Contact Page
- **Two-column Layout:**
  - Left: Contact info, social links, "Open To" list, quote
  - Right: Contact form (name, email, message)
- **Warm & Welcoming:** Personal messaging
- **Professional Form:** Clean inputs with vintage styling
- **Success State:** Thank you message after submission (mock)

### ✅ Global Features
- **Navigation:** Fixed header with active state indicators
- **Footer:** Brand info, quick links, social, copyright
- **Smooth Transitions:** 300-700ms ease animations
- **Hover Effects:** Minimal, tasteful interactions
- **Responsive Design:** Mobile-first approach
- **Accessibility:** Focus states, semantic HTML
- **Vintage Texture:** Subtle grain overlay on all pages

---

## Mock Data Structure

All content currently uses mock data from `/app/frontend/src/data/mockData.js`:
- Site metadata (name, tagline, bio)
- About content (full bio, skills, philosophy)
- Work projects (4 projects with details)
- Gallery images (8 images with categories)
- Writing articles (3 essays with excerpts)
- Contact information
- Social media links

---

## Technical Implementation Details

### Design Refinements Added:
1. **Smooth page transitions** - fadeIn animations
2. **Minimal hover effects** - subtle scale and shadow changes
3. **Balanced typography hierarchy** - display/body/caption levels
4. **Soft shadow depths** - vintage-shadow utilities
5. **Generous white space** - 20px+ gaps throughout
6. **Timeless design** - no trendy gradients or bright colors

### Key Components:
- `Navigation.jsx` - Fixed header with responsive menu
- `Footer.jsx` - Vintage-styled footer
- `AudioPlayer.jsx` - Custom audio player with vintage styling
- `VideoPlayer.jsx` - Video player with thumbnail and ReactPlayer integration
- `Home.jsx` - Multi-section landing page
- `About.jsx` - Personal narrative layout
- `Work.jsx` - Portfolio with modal details and media players
- `Gallery.jsx` - Filterable image grid with lightbox
- `Writing.jsx` - Blog-style articles
- `Contact.jsx` - Two-column contact page

---

## Next Action Items (Prioritized)

### P0 - High Priority
- [ ] Build backend API (FastAPI)
  - Contact form submission endpoint
  - Email notification system
  - Newsletter subscription storage
- [ ] Database setup (MongoDB)
  - Projects collection
  - Gallery images collection
  - Blog posts collection
  - Contact submissions collection
- [ ] Content Management
  - Admin interface for updating content
  - Image upload functionality
  - WYSIWYG editor for writing

### P1 - Medium Priority
- [ ] Media Integration
  - Audio player for music samples
  - Video player for performance reels
  - YouTube/Spotify embeds
- [ ] Advanced Features
  - Search functionality
  - Project filtering by type/year
  - Related projects suggestions
- [ ] SEO & Performance
  - Meta tags optimization
  - Open Graph images
  - Image lazy loading
  - Performance monitoring

### P2 - Nice to Have
- [ ] Newsletter integration (Mailchiap/ConvertKit)
- [ ] Analytics (Google Analytics)
- [ ] Blog RSS feed
- [ ] Testimonials section
- [ ] Press/Media coverage page
- [ ] Calendar/Events integration
- [ ] Multi-language support

---

## Business Enhancement Suggestions

1. **Email Newsletter** - Build engaged audience of directors/producers/fans
2. **Media Player Integration** - Showcase actual music samples and performance videos
3. **Booking Calendar** - Direct availability viewing for event organizers
4. **Press Kit Download** - PDF with bio, photos, and technical specs
5. **Testimonials** - Social proof from directors/collaborators

---

## API Contracts (For Future Backend)

### Contact Form
```
POST /api/contact
Body: { name, email, message }
Response: { success, message }
```

### Newsletter Subscribe
```
POST /api/newsletter/subscribe
Body: { email }
Response: { success, message }
```

### Get Projects
```
GET /api/projects
Query: ?type=singing|acting
Response: { projects: [...] }
```

### Get Gallery
```
GET /api/gallery
Query: ?category=portraits|moments|work|behind
Response: { images: [...] }
```

### Get Blog Posts
```
GET /api/blog
Response: { posts: [...] }
```

---

## Design Guidelines Adherence

✅ Charulata-era vintage elegance  
✅ Soft minimalism with strong typography  
✅ Warm vintage colors (cream, brown, gold)  
✅ Sepia-toned photography  
✅ Generous whitespace  
✅ Calm, intelligent, confident tone  
✅ Mobile-first responsive design  
✅ Smooth subtle animations  
✅ Timeless aesthetic (not trendy)  
✅ Artist portfolio feel (not commercial)  

---

## Version History

**v1.0 - December 2024**
- Initial frontend build with mock data
- All 6 pages implemented
- Vintage Charulata aesthetic applied
- Responsive design complete
- Smooth transitions and hover effects added


**v2.0 - Jan/Feb 2026 - Production Migration & Feature Batch**
- Migrated file storage from Emergent Object Store → Cloudinary (images + videos)
- Migrated database from local MongoDB → MongoDB Atlas
- Removed `emergentintegrations` package and fixed Google API dep conflicts for Render
- Removed local filesystem writes (`StaticFiles` mount) — Render read-only compatible
- Prepared `render.yaml` (backend) + `vercel.json` (frontend) for deployment
- Added Hero Image LQIP via `ProgressiveImage.jsx` component
- Added Spotify, Facebook, YouTube social links (backend model + admin + Footer + Contact)
- Added Gallery video upload support (Cloudinary `resource_type=video`, `<video>` playback)
- Removed "Influences" section from About page
- Fixed Footer contact email (contact@kirtikilledar.com)
- Fixed duplicate CORSMiddleware registration in server.py
- Fixed About.jsx JSX syntax regression blocking Vercel build
- ProgressiveImage: camelCase `fetchPriority` to silence React DOM warning

**Verified via testing_agent_v3_fork (iteration_4.json) on Feb 2026:**
- Backend: 5/5 executable tests pass, 1 skipped (synthetic mp4 limitation)
- Frontend: All flows (Home LQIP, About, Contact, Footer socials, Gallery, Admin login) verified

**Open items / Backlog:**
- Upload a real mp4 via admin Gallery to validate `<video>` playback end-to-end (data-level, not code-level)
- Refine past vs upcoming events logic (P2)
- Optional blog/writing section (P3)
