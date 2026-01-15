# Contributing to OneURL

Thank you for your interest in contributing to OneURL! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to kartik.labhshetwar@gmail.com.

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- PostgreSQL database (local or cloud)
- Git
- Basic knowledge of TypeScript, React, and Next.js

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/oneurl.git
   cd oneurl
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/KartikLabhshetwar/oneurl.git
   ```

4. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables (see [README.md](./README.md) for details)

6. **Set up the database**:
   ```bash
   bun prisma generate
   bun prisma migrate dev
   ```

7. **Start the development server**:
   ```bash
   bun run dev
   ```

## Development Workflow

### 1. Create a Branch

Always create a new branch from `main` for your work:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the code style guidelines below
- Add comments where necessary
- Update documentation if needed
- Test your changes thoroughly

### 3. Commit Your Changes

Follow the commit message guidelines (see below).

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper types or `unknown`
- Use interfaces for object shapes, types for unions/intersections
- Prefer `const` over `let`, avoid `var`

### React Components

- Use functional components with hooks
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use meaningful component and prop names

**Example:**
```tsx
// Good
export function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useProfile(userId);
  
  if (isLoading) return <Spinner />;
  return <div>{data.name}</div>;
}

// Avoid
export function Component({ id }: { id: string }) {
  // ...
}
```

### File Organization

- One component per file
- Use PascalCase for component files: `UserProfile.tsx`
- Use camelCase for utility files: `formatDate.ts`
- Group related files in folders

### Imports

- Group imports: external packages, then internal modules
- Use absolute imports with `@/` alias
- Remove unused imports

```tsx
// Good
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/hooks/use-profile";
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse`)

### Code Comments

- Don't add unnecessary comments
- Comment complex logic or business rules
- Use JSDoc for public APIs

```tsx
// Good - explains why, not what
// Skip validation for admin users to allow bulk operations
if (user.role === "admin") return;

// Avoid - obvious from code
// Set the name to the user's name
setName(user.name);
```

### Error Handling

- Always handle errors appropriately
- Provide meaningful error messages
- Use try-catch for async operations
- Validate user input

```tsx
// Good
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error("Failed to fetch data:", error);
  toastError("Failed to load data");
  throw error;
}
```

### Database Queries

- Use Prisma for all database operations
- Keep queries in service files (`lib/services/`)
- Handle database errors gracefully
- Use transactions for multi-step operations

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(settings): add avatar upload functionality

- Implement file upload with react-dropzone
- Add uploadthing integration
- Update avatar display in sidebar

Closes #123
```

```
fix(auth): handle expired session tokens

Previously, expired tokens caused app crashes.
Now properly redirects to login page.

Fixes #456
```

### Commit Best Practices

- Write clear, descriptive commit messages
- Keep commits focused (one logical change per commit)
- Use present tense ("add feature" not "added feature")
- Reference issues/PRs when applicable

## Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run linting**:
   ```bash
   bun run lint
   ```

3. **Test your changes**:
   - Test manually in the browser
   - Verify all existing functionality still works
   - Test edge cases

4. **Update documentation** if needed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings/errors
- [ ] Tests pass
```

### PR Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Keep PRs focused and reasonably sized
4. Respond to comments promptly
5. Once approved, maintainers will merge

## Project Structure

```
oneurl/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── (onboarding)/     # Onboarding flow
│   ├── [username]/       # Public profile pages
│   └── api/              # API routes
├── components/            # React components
│   ├── landing/          # Landing page components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and services
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Business logic
│   └── validations/      # Zod schemas
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

### Key Files

- `app/layout.tsx` - Root layout
- `lib/db.ts` - Database client
- `lib/auth.ts` - Authentication setup
- `prisma/schema.prisma` - Database schema

## Common Tasks

### Adding a New Feature

1. Create a feature branch
2. Add necessary database migrations (if needed)
3. Implement the feature
4. Add/update tests
5. Update documentation
6. Create PR

### Fixing a Bug

1. Reproduce the bug
2. Create a fix branch
3. Write a test that fails (if applicable)
4. Fix the bug
5. Verify the fix
6. Create PR with clear description

### Adding a New API Route

1. Create route file in `app/api/`
2. Add authentication if needed (`requireAuth`)
3. Add input validation (Zod schemas)
4. Handle errors properly
5. Return appropriate status codes
6. Update API documentation

### Adding a New UI Component

1. Create component in `components/ui/` or appropriate folder
2. Make it reusable and well-typed
3. Add proper accessibility attributes
4. Use Tailwind CSS for styling
5. Export from appropriate index file

### Database Changes

1. Update `prisma/schema.prisma`
2. Create migration: `bun prisma migrate dev --name your-migration-name`
3. Update related code
4. Test thoroughly

## Getting Help

- **Questions?** Open a discussion on GitHub
- **Found a bug?** Open an issue with details
- **Have a feature request?** Open an issue with use case
- **Need clarification?** Comment on the relevant issue/PR

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- GitHub contributors page

Thank you for contributing to OneURL! 🎉

