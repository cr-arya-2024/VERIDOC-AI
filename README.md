VERIDOC-AI
VERIDOC-AI is an AI‑powered web app that validates and analyzes documents (PDFs, images, and text) using LLMs, giving you structured insights, red‑flag detection, and multilingual support in an easy dashboard.

🔗 Live app: https://veridoc-ai-gamma.vercel.app/
​

Features
AI‑powered document understanding (summaries, key points, Q&A).

Support for multiple document types (PDF, images, text).

Red‑flag and inconsistency detection for sensitive documents.

Multilingual UI and responses using an integrated i18n system.

Modern, responsive Next.js UI with animated hero section.

Production‑ready deployment on Vercel.

Tech Stack
Framework: Next.js (App Router, TypeScript).

Styling: CSS / Tailwind (as configured in postcss.config.mjs and global styles).
​

Language: TypeScript for frontend and backend routes.
​

Internationalization: Built‑in i18n configuration with middleware (i18n.json, middleware.ts).
​

Deployment: Vercel (auto deployments from GitHub).
​

Project Structure
Key folders and files:

app/ – Next.js App Router pages, layouts, API routes, and UI components.
​

public/ – Static assets such as images, icons, and hero graphics.
​

i18n/ – Translation resources and language files.
​

i18n.json / i18n.lock – Core i18n configuration and lockfile.
​

middleware.ts – Locale detection and routing middleware.
​

test-api.js – Simple script for testing API endpoints locally.
​

lint_*.txt – Lint reports for tracking code‑quality improvements.
​

Getting Started
1. Prerequisites
Node.js (LTS recommended).

pnpm, npm, yarn, or bun installed globally.

API keys for the AI/LLM provider you use (configure in environment variables).

2. Clone the repository
bash
git clone https://github.com/cr-arya-2024/VERIDOC-AI.git
cd VERIDOC-AI
3. Install dependencies
bash
# choose one
npm install
# or
yarn install
# or
pnpm install
# or
bun install
4. Environment variables
Create a .env.local file in the project root and add your keys:

bash
cp .env.example .env.local   # if you create an example file
Then fill in variables such as:

bash
AI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
(Adjust to match your actual config.)

5. Run the dev server
bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 in your browser.

Usage
Upload a document from the home page.

Select the analysis type (summary, verification, red‑flag detection, Q&A).

View structured results and insights in the dashboard.

Switch language from the UI (handled via i18n middleware and translation files).
​

You can modify the main UI and logic primarily in app/page.tsx and related components.
​

Internationalization (i18n)
VERIDOC-AI ships with i18n support:

Locale configuration in i18n.json.
​

Translations stored in i18n/ and synced with lingo.dev (lingo_help.txt, lingo_log.txt).
​

Middleware in middleware.ts to handle locale‑based routing.
​

To add a new language:

Add the language in i18n.json.

Create translation files under i18n/.

Redeploy to Vercel.

Scripts
Common scripts defined in package.json:
​

dev – Start the development server.

build – Create an optimized production build.

start – Start the production server.

lint – Run linting and generate reports (see lint_*.txt).
​

Any extra scripts you add for testing or utilities.

Deployment
The project is configured for seamless deployment on Vercel.
​

Push to main to trigger an automatic deployment.
​

Check deployment status under the Deployments tab in GitHub or in the Vercel dashboard.
​

You can also deploy manually by importing the GitHub repo into Vercel.

Roadmap / Ideas
Add role‑based auth and user accounts.

Support more file types and larger documents via streaming.

Add history view for past document analyses.

Improve visualizations for red‑flags and risk scores.

Contributing
Contributions, bug reports, and feature requests are welcome.

Fork the repo.

Create a feature branch.

Open a pull request with a clear description.

License
Specify your license here (e.g., MIT). If you have not chosen one yet, consider adding an LICENSE file (MIT, Apache‑2.0, etc.).