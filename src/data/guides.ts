import { Guide, GuideFilter } from '@/types';

/**
 * Designer guides for using AI tools in design workflows
 * Each guide targets specific designer roles and skill levels
 */
export const guides: Guide[] = [
  {
    id: 'claude-code-learning-path',
    slug: 'claude-code-learning-path-for-designers',
    title: "Claude Code Learning Path for Designers",
    description:
      'Complete learning path for designers starting with Claude Code. Follow our 4-part series from setup through mastery, with focused guides on each step.',
    excerpt:
      'Your complete roadmap to using Claude Code: from getting your API key to saving work on GitHub. Choose your own pace with focused, digestible guides.',
    tool: 'Claude Code',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 5,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/claude-code-ux.jpg',
    tags: ['claude-code', 'learning-path', 'getting-started'],
    content: `
      <h2>Welcome to Claude Code for Designers</h2>
      <p>Claude Code is an AI-powered development tool that lets you build interactive prototypes, test design ideas in code, and collaborate with developers—all from your terminal. This learning path is designed to get you from zero to your first deployed prototype.</p>

      <h3>What You'll Learn</h3>
      <ul>
        <li>How to set up Claude Code in 5 minutes</li>
        <li>How to create and run your first prototype locally</li>
        <li>How to save your work safely using GitHub</li>
        <li>Best practices and workflows for designer-developer collaboration</li>
      </ul>

      <h2>Your Learning Path: 4 Focused Guides</h2>
      <p>This learning path is split into 4 bite-sized guides. You can follow them in order or jump to what you need:</p>

      <h3>Step 1: Claude Code Setup for Designers (6 min)</h3>
      <p>The foundation. Get your API key from Anthropic, install Node.js, and have Claude Code ready to go. <strong>Start here if this is your first time.</strong></p>
      <p><a href="/guides/claude-code-setup-for-designers" style="color: #2563EB; text-decoration: none; font-weight: 500;">→ Go to Setup Guide</a></p>

      <h3>Step 2: Your First Claude Code Prototype (8 min)</h3>
      <p>Get hands-on. Launch Claude Code, generate your first prototype, and see it live on your machine. This is where the magic happens.</p>
      <p><a href="/guides/your-first-claude-code-prototype" style="color: #2563EB; text-decoration: none; font-weight: 500;">→ Go to First Prototype Guide</a></p>

      <h3>Step 3: Save & Collaborate with GitHub (7 min)</h3>
      <p>Don't lose your work. Learn how to save your prototypes to GitHub, collaborate with teammates, and maintain version history.</p>
      <p><a href="/guides/claude-code-github-collaboration" style="color: #2563EB; text-decoration: none; font-weight: 500;">→ Go to GitHub Guide</a></p>

      <h3>Step 4: Claude Code Best Practices (6 min)</h3>
      <p>Level up. Master the art of describing designs to Claude Code, iterating on feedback, and handing off work to developers.</p>
      <p><a href="/guides/claude-code-best-practices-for-designers" style="color: #2563EB; text-decoration: none; font-weight: 500;">→ Go to Best Practices Guide</a></p>

      <h2>How to Use This Learning Path</h2>
      <ul>
        <li><strong>First time using Claude Code?</strong> Start with Step 1 and follow through in order. Total time: ~25 minutes.</li>
        <li><strong>Already have Claude Code installed?</strong> Jump to Step 2 to create your first prototype.</li>
        <li><strong>Need help with a specific topic?</strong> Use the guides as reference. Each one stands alone.</li>
        <li><strong>Want deeper dives?</strong> Each guide is focused but comprehensive for its topic.</li>
      </ul>

      <h2>Why This Approach?</h2>
      <p>We've learned that designers learn best when information is focused and actionable. Instead of one overwhelming 25-minute guide, we've broken Claude Code into 4 focused topics. You can read one, try it out, then move to the next—without feeling overwhelmed.</p>

      <h2>Ready to Get Started?</h2>
      <p><a href="/guides/claude-code-setup-for-designers" style="color: #2563EB; text-decoration: none; font-weight: 500; font-size: 18px;">→ Start with Setup Guide →</a></p>

      <p style="margin-top: 40px; font-size: 14px; color: #666;">
        <strong>Time estimate:</strong> 5 min to read this path, 20 min to complete all 4 guides + hands-on practice
      </p>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'claude-code-setup',
    slug: 'claude-code-setup-for-designers',
    title: 'Claude Code Setup for Designers',
    description:
      'Get your API key, install Node.js, and install Claude Code. Everything you need to start using Claude Code in 6 minutes.',
    excerpt:
      'Step-by-step setup guide: creating your Anthropic account, getting an API key, installing Node.js, and installing Claude Code.',
    tool: 'Claude Code',
    useCase: 'Setup',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 6,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/claude-code-setup.jpg',
    tags: ['claude-code', 'setup', 'api-key', 'installation', 'node-js'],
    content: `
      <h2>Part 1: Get Your Anthropic API Key</h2>
      <p>Claude Code needs an API key to connect to the Claude AI service. This key tells Anthropic that it's really you using the service.</p>

      <h3>1.1 Create an Anthropic Account</h3>
      <ol>
        <li>Go to <strong>console.anthropic.com</strong> in your web browser</li>
        <li>Click <strong>"Sign up"</strong> in the top right</li>
        <li>Create an account using your email and password</li>
        <li>Check your email for a verification link and click it</li>
      </ol>

      <h3>1.2 Generate Your API Key</h3>
      <ol>
        <li>Once logged in, find <strong>"API Keys"</strong> in the left menu</li>
        <li>Click <strong>"Create Key"</strong></li>
        <li>Name it something like <strong>"Claude Code for Design"</strong></li>
        <li>Click <strong>"Create"</strong></li>
        <li><strong>Copy your key immediately</strong> and save it somewhere safe (like a password manager)</li>
      </ol>

      <h3>1.3 Keep Your Key Secure ⚠️</h3>
      <p><strong>Important:</strong> Your API key is like a password. Never:</p>
      <ul>
        <li>Share it with anyone</li>
        <li>Post it in Slack, email, or public docs</li>
        <li>Commit it to GitHub</li>
        <li>Store it in plain text files in your projects</li>
      </ul>

      <h2>Part 2: Install Node.js</h2>
      <p>Node.js is software that lets you run JavaScript code on your computer. You need it to use Claude Code.</p>

      <h3>2.1 Check if You Already Have Node.js</h3>
      <h4>On Mac:</h4>
      <ol>
        <li>Press <strong>Command + Space</strong>, type "Terminal", and hit Enter</li>
        <li>Paste this and press Enter: <code>node --version</code></li>
        <li>If you see a version number, you're done with this section!</li>
      </ol>

      <h4>On Windows:</h4>
      <ol>
        <li>Click the Windows logo, type "Command Prompt", and hit Enter</li>
        <li>Paste this and press Enter: <code>node --version</code></li>
        <li>If you see a version number, skip to Part 3!</li>
      </ol>

      <h3>2.2 Install Node.js (If You Need It)</h3>
      <ol>
        <li>Go to <strong>nodejs.org</strong></li>
        <li>Download the <strong>"LTS"</strong> version (this is the stable, recommended version)</li>
        <li>Run the installer and follow the instructions (just click "Next" on everything)</li>
        <li>Open Terminal/Command Prompt again and run <code>node --version</code> to confirm</li>
      </ol>

      <h2>Part 3: Install Claude Code</h2>
      <p>Now that you have Node.js, installing Claude Code is one command away.</p>

      <h3>3.1 Open Terminal/Command Prompt</h3>
      <p><strong>Mac:</strong> Command + Space → "Terminal" → Enter</p>
      <p><strong>Windows:</strong> Windows logo → "Command Prompt" → Enter</p>

      <h3>3.2 Install Claude Code</h3>
      <p>Copy and paste this command, then press Enter:</p>
      <p><code>npm install -g claude-code</code></p>
      <p>This takes 1-2 minutes. You'll see lots of text—that's normal!</p>

      <h3>3.3 Verify Installation</h3>
      <p>Run this to confirm it worked:</p>
      <p><code>claude --version</code></p>
      <p>You should see a version number. If you do, <strong>you're ready to go!</strong></p>

      <h2>You Did It!</h2>
      <p>You now have:</p>
      <ul>
        <li>✓ An Anthropic account with an API key</li>
        <li>✓ Node.js installed</li>
        <li>✓ Claude Code installed and verified</li>
      </ul>

      <p style="margin-top: 30px;">
        <strong>Next step:</strong> <a href="/guides/your-first-claude-code-prototype" style="color: #2563EB; text-decoration: none; font-weight: 500;">Create Your First Prototype →</a>
      </p>
    `,
    relatedPatterns: ['Contextual Assistance'],
  },
  {
    id: 'claude-code-first-prototype',
    slug: 'your-first-claude-code-prototype',
    title: 'Your First Claude Code Prototype',
    description:
      'Generate your first prototype with Claude Code and see it live on your machine. Hands-on guide to getting from idea to working code in minutes.',
    excerpt:
      'Create a working prototype: start Claude Code, describe what you want to build, and watch it generate code in real-time. See your design live on localhost.',
    tool: 'Claude Code',
    useCase: 'Prototyping',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 8,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/claude-code-prototype.jpg',
    tags: ['claude-code', 'prototyping', 'getting-started', 'localhost', 'react'],
    content: `
      <h2>Part 1: Start Your First Claude Code Session</h2>

      <h3>1.1 Open Terminal</h3>
      <p><strong>Mac:</strong> Command + Space → "Terminal" → Enter</p>
      <p><strong>Windows:</strong> Windows logo → "Command Prompt" → Enter</p>

      <h3>1.2 Launch Claude Code</h3>
      <p>Type this command and press Enter:</p>
      <p><code>claude</code></p>

      <h3>1.3 Paste Your API Key</h3>
      <p>Claude Code will ask for your API key. Paste the one you saved in the setup guide.</p>
      <p><strong>Note:</strong> Your key won't appear as you type—that's normal for security!</p>

      <h3>1.4 Choose a Model</h3>
      <p>Claude Code will ask which model you want. Choose <strong>Claude 3.5 Sonnet</strong>—it's the best balance of speed and power for designers.</p>

      <h2>Part 2: Create Your Project Folder</h2>

      <h3>2.1 Exit Claude Code Temporarily</h3>
      <p>Type <code>exit</code> and press Enter. You'll return to your regular Terminal.</p>

      <h3>2.2 Create a Project Folder</h3>
      <p>Run this command:</p>
      <p><code>mkdir my-first-prototype</code></p>
      <p>Then navigate into it:</p>
      <p><code>cd my-first-prototype</code></p>

      <h3>2.3 Start Claude Code in Your Project</h3>
      <p>Run:</p>
      <p><code>claude</code></p>
      <p>Paste your API key again. Now you're inside Claude Code, with your project as the working folder.</p>

      <h2>Part 3: Generate Your First Prototype</h2>

      <h3>3.1 Ask Claude Code to Create Something</h3>
      <p>Try this simple request:</p>
      <p><code>Create a React button component with a blue background and white text. Add a hover effect that makes the button slightly larger. Use Tailwind CSS for styling.</code></p>
      <p>Press Enter and watch Claude Code generate code!</p>

      <h3>3.2 Review What It Created</h3>
      <p>Claude Code will show you the files it made. Read through them to understand what happened.</p>

      <h3>3.3 Ask for Changes (Optional)</h3>
      <p>If you want to modify something, just ask:</p>
      <p><code>Make the button green instead of blue and add rounded corners.</code></p>
      <p>Claude Code will update the files immediately!</p>

      <h2>Part 4: See Your Prototype Live</h2>

      <h3>4.1 Exit Claude Code</h3>
      <p>Type <code>exit</code> and press Enter to return to Terminal.</p>

      <h3>4.2 Initialize a React App (If Needed)</h3>
      <p>Run:</p>
      <p><code>npx create-react-app .</code></p>
      <p>This sets up the structure React needs to run.</p>

      <h3>4.3 Start Your Development Server</h3>
      <p>Run:</p>
      <p><code>npm start</code></p>
      <p>Your prototype will automatically open in your browser at <strong>localhost:3000</strong>!</p>

      <h3>4.4 Watch for Live Updates</h3>
      <p>When Claude Code makes changes, your browser automatically updates. No manual refresh needed!</p>

      <h2>Part 5: Get Back to Editing</h2>

      <h3>5.1 Open Another Terminal Window</h3>
      <p>To keep editing with Claude Code while your prototype runs, open a new Terminal window:</p>
      <ul>
        <li><strong>Mac:</strong> Command + T (in Terminal app)</li>
        <li><strong>Windows:</strong> Ctrl + Shift + 2 (in Command Prompt)</li>
      </ul>

      <h3>5.2 Navigate to Your Project</h3>
      <p>In the new Terminal, run:</p>
      <p><code>cd my-first-prototype</code></p>

      <h3>5.3 Start Claude Code Again</h3>
      <p>Run:</p>
      <p><code>claude</code></p>
      <p>Now you have:</p>
      <ul>
        <li><strong>Terminal #1:</strong> Your dev server (showing localhost:3000)</li>
        <li><strong>Terminal #2:</strong> Claude Code (where you edit)</li>
        <li><strong>Browser:</strong> Your live prototype updating in real-time</li>
      </ul>

      <h2>Congratulations! 🎉</h2>
      <p>You've created your first prototype with Claude Code and seen it live on your machine. This is the foundation of everything you can do with Claude Code as a designer.</p>

      <p style="margin-top: 30px;">
        <strong>Next step:</strong> <a href="/guides/claude-code-github-collaboration" style="color: #2563EB; text-decoration: none; font-weight: 500;">Learn to Save Your Work with GitHub →</a>
      </p>
    `,
    relatedPatterns: ['Augmented Creation', 'Progressive Disclosure'],
  },
  {
    id: 'claude-code-github',
    slug: 'claude-code-github-collaboration',
    title: 'Save & Collaborate: Claude Code + GitHub',
    description:
      'Save your Claude Code prototypes to GitHub, maintain version history, and collaborate with your team. Complete guide to git and GitHub for designers.',
    excerpt:
      'From your local machine to the cloud: Save your prototypes securely on GitHub, track changes, and collaborate with developers.',
    tool: 'GitHub',
    useCase: 'Collaboration',
    skillLevel: 'Beginner',
    designDomain: 'Product Design',
    readTime: 7,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/github-collaboration.jpg',
    tags: ['github', 'version-control', 'collaboration', 'git', 'claude-code'],
    content: `
      <h2>Why GitHub? (2-Minute Overview)</h2>
      <ul>
        <li><strong>Backup:</strong> Your code is safe in the cloud, not just on your computer</li>
        <li><strong>History:</strong> You can see every change you made and go back if needed</li>
        <li><strong>Collaboration:</strong> Easy to share with developers and teammates</li>
        <li><strong>Portfolio:</strong> Show your work and design-to-code process</li>
      </ul>

      <h2>Part 1: Create a GitHub Account</h2>

      <h3>1.1 Sign Up</h3>
      <ol>
        <li>Go to <strong>github.com</strong></li>
        <li>Click <strong>"Sign up"</strong></li>
        <li>Create an account with your email (you can use your work or personal email)</li>
        <li>Verify your email by clicking the link they send you</li>
      </ol>

      <h3>1.2 You're Ready!</h3>
      <p>GitHub account created. Let's connect your prototype.</p>

      <h2>Part 2: Create a Repository on GitHub</h2>

      <h3>2.1 Create a New Repo</h3>
      <ol>
        <li>Click the <strong>"+"</strong> icon in the top right of GitHub</li>
        <li>Select <strong>"New repository"</strong></li>
        <li>Name it <strong>"my-first-prototype"</strong> (same as your local folder)</li>
        <li>Add a description: <strong>"Design prototype created with Claude Code"</strong></li>
        <li>Leave other settings as default</li>
        <li>Click <strong>"Create repository"</strong></li>
      </ol>

      <h3>2.2 Copy the Setup Instructions</h3>
      <p>GitHub will show you commands. Keep this page open—you'll need the commands soon!</p>

      <h2>Part 3: Connect Your Local Project to GitHub</h2>

      <h3>3.1 Open Terminal (Not Claude Code)</h3>
      <p>You should be in your project folder. Check with:</p>
      <p><code>pwd</code></p>
      <p>You should see something like <code>.../my-first-prototype</code></p>

      <h3>3.2 Initialize Git</h3>
      <p>Run these commands one by one:</p>
      <p><code>git init</code></p>
      <p><code>git add .</code></p>
      <p><code>git commit -m "Initial prototype created with Claude Code"</code></p>

      <h3>3.3 Connect to GitHub</h3>
      <p>Copy the commands from GitHub's instructions. They'll look like:</p>
      <p><code>git branch -M main</code></p>
      <p><code>git remote add origin https://github.com/YOUR-USERNAME/my-first-prototype.git</code></p>
      <p><code>git push -u origin main</code></p>

      <h3>3.4 Check GitHub</h3>
      <p>Refresh your GitHub repo page. Your files should now be there!</p>

      <h2>Part 4: Save Your Changes Going Forward</h2>

      <h3>4.1 Regular Save Workflow</h3>
      <p>Every time you make changes in Claude Code that you want to keep:</p>
      <ol>
        <li>Exit Claude Code (type <code>exit</code>)</li>
        <li>Run: <code>git add .</code></li>
        <li>Run: <code>git commit -m "Description of what you changed"</code></li>
        <li>Run: <code>git push</code></li>
      </ol>

      <h3>4.2 Write Good Commit Messages</h3>
      <p>Instead of "Updated stuff", try:</p>
      <ul>
        <li>"Changed button color from blue to green"</li>
        <li>"Added hover effect to navigation menu"</li>
        <li>"Fixed button padding on mobile"</li>
      </ul>
      <p>Good messages help you remember what you did and help teammates understand changes.</p>

      <h2>Part 5: Pro Tip - Use Claude's /save Command</h2>

      <h3>5.1 Automatic Saving</h3>
      <p>Inside Claude Code, you can type:</p>
      <p><code>/save</code></p>
      <p>Claude Code will automatically handle git commands and create meaningful commit messages for you. This saves time!</p>

      <h2>Sharing Your Work</h2>

      <h3>Send Someone Your Repository</h3>
      <p>Just send them the GitHub link, like:</p>
      <p><code>https://github.com/YOUR-USERNAME/my-first-prototype</code></p>

      <h3>They Can:</h3>
      <ul>
        <li>See your code and understand your design decisions</li>
        <li>Clone your project to run locally</li>
        <li>Leave comments or suggestions</li>
        <li>Collaborate on the prototype</li>
      </ul>

      <h2>You're Now a Designer with Git Skills! 🚀</h2>
      <p>You can:</p>
      <ul>
        <li>✓ Save your work safely to the cloud</li>
        <li>✓ Track every change you make</li>
        <li>✓ Collaborate with developers</li>
        <li>✓ Showcase your process on GitHub</li>
      </ul>

      <p style="margin-top: 30px;">
        <strong>Next step:</strong> <a href="/guides/claude-code-best-practices-for-designers" style="color: #2563EB; text-decoration: none; font-weight: 500;">Master Best Practices →</a>
      </p>
    `,
    relatedPatterns: ['Human-in-the-Loop'],
  },
  {
    id: 'claude-code-best-practices',
    slug: 'claude-code-best-practices-for-designers',
    title: 'Claude Code Best Practices for Designers',
    description:
      'Master the art of working with Claude Code. Learn how to describe designs effectively, iterate on feedback, test prototypes, and hand off work to developers.',
    excerpt:
      'Best practices every step of the way: how to talk to Claude Code, test your designs, iterate based on feedback, and deliver work like a pro.',
    tool: 'Claude Code',
    useCase: 'Prototyping',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 6,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/best-practices.jpg',
    tags: ['claude-code', 'best-practices', 'workflow', 'tips', 'collaboration'],
    content: `
      <h2>Part 1: How to Describe Your Design to Claude Code</h2>

      <h3>Be Specific, Not Vague</h3>
      <p><strong>❌ Not this:</strong> "Create a nice button"</p>
      <p><strong>✅ Do this:</strong> "Create a button with a #2563EB background, white text, 12px border radius, 16px padding, and a hover effect that makes it 5% larger"</p>

      <h3>Include Design Details</h3>
      <ul>
        <li><strong>Colors:</strong> Use hex codes (#2563EB, not "blue")</li>
        <li><strong>Sizes:</strong> Specify padding, margins, font sizes (16px, not "normal")</li>
        <li><strong>Interactions:</strong> Describe what happens on hover, click, etc.</li>
        <li><strong>Responsiveness:</strong> Mention if it needs to work on mobile/tablet</li>
        <li><strong>Framework:</strong> Say "Use React and Tailwind CSS"</li>
      </ul>

      <h3>Good Prompt Examples</h3>
      <ul>
        <li>"Create a form with email and password fields. Use #1F2937 text, light gray background, and make it responsive."</li>
        <li>"Build a product card showing: image on top, title below, price, and a 'Buy Now' button. Make it 300px wide."</li>
        <li>"Design a navigation bar with a logo on the left and 4 menu items on the right. Make it sticky (stays at top when scrolling)."</li>
      </ul>

      <h2>Part 2: Testing Your Prototype</h2>

      <h3>Test in Different Browsers</h3>
      <ul>
        <li>Test in Chrome, Safari, Firefox (not every browser shows things the same)</li>
        <li>In your browser, press F12 to open "Developer Tools"</li>
        <li>You can simulate phones and tablets to test responsiveness</li>
      </ul>

      <h3>Check Accessibility</h3>
      <p>Ask yourself:</p>
      <ul>
        <li>Can I use this with just my keyboard? (Tab through elements)</li>
        <li>Is the text readable? (Good contrast between text and background)</li>
        <li>Does it work on small screens? (Phone, tablet, desktop)</li>
      </ul>

      <h3>Test Interactions</h3>
      <ul>
        <li>Hover over buttons—does the effect work smoothly?</li>
        <li>Click buttons—do they do what you expect?</li>
        <li>Try animations—are they fast enough? Too slow?</li>
      </ul>

      <h2>Part 3: Iterating Based on Feedback</h2>

      <h3>Ask for Small Changes, Not Rewrites</h3>
      <p><strong>❌ Don't:</strong> "I don't like this design, redo it"</p>
      <p><strong>✅ Do:</strong> "Make the button taller and add more space between the inputs"</p>

      <h3>Use Version History</h3>
      <p>If you don't like a change, you can always go back to a previous version on GitHub:</p>
      <ul>
        <li>View your commit history on GitHub</li>
        <li>Click on an old version</li>
        <li>Compare what changed</li>
      </ul>

      <h3>Collaborate Effectively</h3>
      <ul>
        <li>Show your prototype to teammates early (don't wait for perfection)</li>
        <li>Ask specific questions: "Does this button feel clickable to you?"</li>
        <li>Document design decisions in code comments</li>
      </ul>

      <h2>Part 4: Handing Off Work to Developers</h2>

      <h3>Prepare Your Code for Handoff</h3>
      <ul>
        <li><strong>Push to GitHub:</strong> Make sure all your latest work is on GitHub</li>
        <li><strong>Add comments:</strong> Explain why you made certain design choices in the code</li>
        <li><strong>Create a README:</strong> A simple document explaining what the prototype does and how to run it</li>
      </ul>

      <h3>Write a Good README</h3>
      <p>Create a file called <code>README.md</code> with:</p>
      <ul>
        <li>What the prototype is for</li>
        <li>How to run it (e.g., "Run npm start to see the prototype")</li>
        <li>Design notes (e.g., "Button interactions should feel snappy")</li>
        <li>Links to design files (Figma, etc.)</li>
      </ul>

      <h3>Be Available for Questions</h3>
      <p>Developers will have questions about your design. Be ready to:</p>
      <ul>
        <li>Explain why you made certain choices</li>
        <li>Show design references or inspiration</li>
        <li>Discuss trade-offs (e.g., why animation smoothness matters)</li>
      </ul>

      <h2>Part 5: Troubleshooting Common Issues</h2>

      <h3>Claude Code Won't Start</h3>
      <ul>
        <li>Check your API key (copy it again if needed)</li>
        <li>Make sure you've updated Node.js: <code>npm install -g npm</code></li>
        <li>Reinstall Claude Code: <code>npm install -g claude-code@latest</code></li>
      </ul>

      <h3>Development Server Won't Start</h3>
      <ul>
        <li>Press Ctrl + C to stop it</li>
        <li>Run <code>npm start</code> again</li>
        <li>Check if port 3000 is already in use by another program</li>
      </ul>

      <h3>Git/GitHub Issues</h3>
      <ul>
        <li><strong>Forgot to initialize git?</strong> Run <code>git init</code></li>
        <li><strong>Wrong remote?</strong> Check with <code>git remote -v</code></li>
        <li><strong>Need a fresh start?</strong> Delete the .git folder and start over</li>
      </ul>

      <h2>Key Takeaways</h2>
      <ul>
        <li><strong>Specific is better than vague.</strong> The more detail you give Claude Code, the better the result.</li>
        <li><strong>Test early and often.</strong> Don't wait until the end to see if something works.</li>
        <li><strong>Iterate in small steps.</strong> Ask for one thing at a time, not everything at once.</li>
        <li><strong>Document your decisions.</strong> Help future you and your teammates understand why you made choices.</li>
        <li><strong>Use git effectively.</strong> Meaningful commit messages are your documentation.</li>
      </ul>

      <h2>You're Ready! 🎉</h2>
      <p>You now know:</p>
      <ul>
        <li>✓ How to set up Claude Code</li>
        <li>✓ How to create prototypes</li>
        <li>✓ How to save your work on GitHub</li>
        <li>✓ Best practices for working with Claude Code</li>
      </ul>

      <p><strong>Next step:</strong> Start building! Create a prototype, share it with your team, and iterate. Claude Code is a tool to speed up your ideas—have fun with it!</p>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation', 'Explainable AI'],
  },
];

/**
 * Get a guide by slug
 */
export function getGuideBySlug(slug: string): Guide | null {
  return guides.find((guide) => guide.slug === slug) || null;
}

/**
 * Filter guides based on criteria
 */
export function filterGuides(filter: GuideFilter): Guide[] {
  return guides.filter((guide) => {
    // Tool filter
    if (filter.tool && guide.tool !== filter.tool) {
      return false;
    }

    // Skill level filter
    if (filter.skillLevel && guide.skillLevel !== filter.skillLevel) {
      return false;
    }

    // Design domain filter
    if (filter.designDomain && guide.designDomain !== filter.designDomain) {
      return false;
    }

    // Tags filter (match any tag)
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some((tag) => guide.tags?.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Search guides by query (title, description, tags)
 */
export function searchGuides(query: string): Guide[] {
  const lowerQuery = query.toLowerCase();

  return guides.filter((guide) => {
    return (
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.description.toLowerCase().includes(lowerQuery) ||
      guide.excerpt?.toLowerCase().includes(lowerQuery) ||
      guide.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get all unique tools from guides
 */
export function getAllTools(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.tool)));
}

/**
 * Get all unique skill levels from guides
 */
export function getAllSkillLevels(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.skillLevel)));
}

/**
 * Get all unique design domains from guides
 */
export function getAllDesignDomains(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.designDomain)));
}

/**
 * Get all guides for a specific pattern
 */
export function getGuidesForPattern(patternSlug: string): Guide[] {
  return guides.filter((guide) => guide.relatedPatterns?.includes(patternSlug));
}

/**
 * Get the previous guide in the learning path sequence
 */
export function getPreviousGuide(slug: string): Guide | null {
  const currentIndex = guides.findIndex((guide) => guide.slug === slug);
  if (currentIndex <= 0) return null;
  return guides[currentIndex - 1];
}

/**
 * Get the next guide in the learning path sequence
 */
export function getNextGuide(slug: string): Guide | null {
  const currentIndex = guides.findIndex((guide) => guide.slug === slug);
  if (currentIndex === -1 || currentIndex >= guides.length - 1) return null;
  return guides[currentIndex + 1];
}

/**
 * Get progress information for a guide in the learning path
 */
export function getGuideProgress(slug: string): { current: number; total: number; percentage: number } | null {
  const currentIndex = guides.findIndex((guide) => guide.slug === slug);
  if (currentIndex === -1) return null;

  return {
    current: currentIndex + 1,
    total: guides.length,
    percentage: ((currentIndex + 1) / guides.length) * 100,
  };
}
