# AGENTS.md: Rules for AI Code Attribution

This file contains operational guidelines for AI coding assistants (e.g., Cursor, GitHub Copilot, Windsurf, Claude Dev) working within this repository.

---

## 🚨 MANDATORY INSTRUCTION: Inline Code Attribution

As an AI assistant generating, refactoring, or inserting code in this project, **you MUST automatically include inline attribution comments** for any code block or function you create, modify, or significantly rewrite.

### Attribution Standard & Format

For every function, block, or significant section of generated or modified code, add an inline comment adhering to the following structure:

1. **Language Comment Syntax:** Use the single-line or multi-line comment style native to the file type (e.g., `#` for Python/YAML, `//` for JS/TS/C++, `<!-- -->` for HTML).
2. **Tag Format:**
   - `[AI-Generated: <Model Name>]`: Use when generating new code/functions.
   - `[AI-Assisted: <Model Name>]`: Use when refactoring, debugging, or adding onto existing student code.
3. **Prompt/Intent Summary:** Briefly describe the request or intent behind the code generation.
4. **Timestamp/Date:** Include the current date (YYYY-MM-DD).

---

## Code Examples

### JavaScript / TypeScript Example
```javascript
// [AI-Assisted: Claude 3.5 Sonnet | 2026-10-21]
// Intent: Refactored fetchUserData to include try/catch error handling and async/await
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
```

### HTML / CSS Example
```html
<!-- [AI-Generated: Claude 3.5 Sonnet | 2026-10-21] -->
<!-- Intent: Accessible, responsive grid layout for project cards -->
<div class="card-grid">
  <article class="card">...</article>
</div>
```

---

## Scope & Guidelines

- **Granularity:** Place attribution comments immediately preceding the generated function, class, or logical code block.
- **Micro-edits:** Single-line fixes, variable name updates, or formatting/lint fixes do not require inline attribution comments unless explicitly asked.
- **Student Ownership:** Do not alter or remove existing human/student attribution tags or comments.