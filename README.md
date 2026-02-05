# Dzenn

**Not your ordinary linktree** - A nonchalant link-in-bio that hits different. No cap, just vibes.

## Ongoing

- [ ] Support multiple link 
- [ ] Add rich components (YouTube, Twitter/X, blog posts, Spotify)
- [ ] More card design variations (glassmorphism, neumorphism, etc)
- [ ] Custom domain support
- [ ] Advanced analytics (geographic data, referrers)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better Auth
- **File Upload:** Cloudinary
- **State Management:** Zustand + TanStack Query
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Charts:** Recharts
- **Drag & Drop:** @dnd-kit

## Project Structure

```
dzenn/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes (login, signup)
│   ├── editor/            # Editor routes (protected)
│   ├── [username]/        # Public profile pages
│   └── api/               # API routes
├── components/            # React components
│   ├── landing/           # Landing page components
│   ├── preview/           # Profile preview components
│   ├── control-panel/     # Editor control panel
│   └── ui/                # UI component library (shadcn/ui)
├── lib/                   # Utility functions and services
│   ├── stores/            # Zustand stores
│   └── utils.ts           # Helper functions
├── server/                # Server actions and queries
│   ├── user/              # User-related actions
│   └── infrastructure/    # Analytics, tracking
├── prisma/                # Prisma schema and migrations
└── public/                # Static assets
```

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](./LICENSE) file for details.

---

Made with ✨ by [BroKarim](https://github.com/BroKarim)
