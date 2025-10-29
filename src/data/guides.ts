import { Guide, GuideFilter } from '@/types';

/**
 * Complete Claude Code Learning Path Course for Designers
 * Combines all lessons from Setup, First Prototype, GitHub, and Best Practices
 * into one comprehensive learning experience with 18 sequential lessons.
 */
export const guides: Guide[] = [
  {
    id: 'claude-code-course',
    slug: 'claude-code-learning-path',
    title: "Claude Code Guide for Designers",
    description:
      'Complete course for designers learning Claude Code. Master everything from initial setup through advanced best practices with 18 comprehensive lessons.',
    excerpt:
      'Your complete Claude Code education: 18 sequential lessons covering setup, prototyping, version control, and professional workflows. Go from zero to confident in one comprehensive course.',
    tool: 'Claude Code',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 27,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/claude-code-ux.jpg',
    tags: ['claude-code', 'learning-path', 'getting-started', 'course', 'comprehensive'],
    lessons: [
      // Setup Lessons (1-3)
      {
        id: 'lesson-1',
        title: 'Get Your Anthropic API Key',
        duration: 2,
        order: 1,
        content: `<h2>Lesson 1: Get Your Anthropic API Key</h2>
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
</ul>`,
      },
      {
        id: 'lesson-2',
        title: 'Install Node.js',
        duration: 2,
        order: 2,
        content: `<h2>Lesson 2: Install Node.js</h2>
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
  <li>If you see a version number, skip to the next lesson!</li>
</ol>

<h3>2.2 Install Node.js (If You Need It)</h3>
<ol>
  <li>Go to <strong>nodejs.org</strong></li>
  <li>Download the <strong>"LTS"</strong> version (this is the stable, recommended version)</li>
  <li>Run the installer and follow the instructions (just click "Next" on everything)</li>
  <li>Open Terminal/Command Prompt again and run <code>node --version</code> to confirm</li>
</ol>`,
      },
      {
        id: 'lesson-3',
        title: 'Install Claude Code',
        duration: 2,
        order: 3,
        content: `<h2>Lesson 3: Install Claude Code</h2>
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

<h2>Setup Complete!</h2>
<p>You now have:</p>
<ul>
  <li>✓ An Anthropic account with an API key</li>
  <li>✓ Node.js installed</li>
  <li>✓ Claude Code installed and verified</li>
</ul>`,
      },
      // First Prototype Lessons (4-8)
      {
        id: 'lesson-4',
        title: 'Start Your First Claude Code Session',
        duration: 2,
        order: 4,
        content: `<h2>Lesson 4: Start Your First Claude Code Session</h2>

<h3>4.1 Open Terminal</h3>
<p><strong>Mac:</strong> Command + Space → "Terminal" → Enter</p>
<p><strong>Windows:</strong> Windows logo → "Command Prompt" → Enter</p>

<h3>4.2 Launch Claude Code</h3>
<p>Type this command and press Enter:</p>
<p><code>claude</code></p>

<h3>4.3 Paste Your API Key</h3>
<p>Claude Code will ask for your API key. Paste the one you saved in the setup guide.</p>
<p><strong>Note:</strong> Your key won't appear as you type—that's normal for security!</p>

<h3>4.4 Choose a Model</h3>
<p>Claude Code will ask which model you want. Choose <strong>Claude 3.5 Sonnet</strong>—it's the best balance of speed and power for designers.</p>`,
      },
      {
        id: 'lesson-5',
        title: 'Create Your Project Folder',
        duration: 1,
        order: 5,
        content: `<h2>Lesson 5: Create Your Project Folder</h2>

<h3>5.1 Exit Claude Code Temporarily</h3>
<p>Type <code>exit</code> and press Enter. You'll return to your regular Terminal.</p>

<h3>5.2 Create a Project Folder</h3>
<p>Run this command:</p>
<p><code>mkdir my-first-prototype</code></p>
<p>Then navigate into it:</p>
<p><code>cd my-first-prototype</code></p>

<h3>5.3 Start Claude Code in Your Project</h3>
<p>Run:</p>
<p><code>claude</code></p>
<p>Paste your API key again. Now you're inside Claude Code, with your project as the working folder.</p>`,
      },
      {
        id: 'lesson-6',
        title: 'Generate Your First Prototype',
        duration: 2,
        order: 6,
        content: `<h2>Lesson 6: Generate Your First Prototype</h2>

<h3>6.1 Ask Claude Code to Create Something</h3>
<p>Try this simple request:</p>
<p><code>Create a React button component with a blue background and white text. Add a hover effect that makes the button slightly larger. Use Tailwind CSS for styling.</code></p>
<p>Press Enter and watch Claude Code generate code!</p>

<h3>6.2 Review What It Created</h3>
<p>Claude Code will show you the files it made. Read through them to understand what happened.</p>

<h3>6.3 Ask for Changes (Optional)</h3>
<p>If you want to modify something, just ask:</p>
<p><code>Make the button green instead of blue and add rounded corners.</code></p>
<p>Claude Code will update the files immediately!</p>`,
      },
      {
        id: 'lesson-7',
        title: 'See Your Prototype Live',
        duration: 2,
        order: 7,
        content: `<h2>Lesson 7: See Your Prototype Live</h2>

<h3>7.1 Exit Claude Code</h3>
<p>Type <code>exit</code> and press Enter to return to Terminal.</p>

<h3>7.2 Initialize a React App (If Needed)</h3>
<p>Run:</p>
<p><code>npx create-react-app .</code></p>
<p>This sets up the structure React needs to run.</p>

<h3>7.3 Start Your Development Server</h3>
<p>Run:</p>
<p><code>npm start</code></p>
<p>Your prototype will automatically open in your browser at <strong>localhost:3000</strong>!</p>

<h3>7.4 Watch for Live Updates</h3>
<p>When Claude Code makes changes, your browser automatically updates. No manual refresh needed!</p>`,
      },
      {
        id: 'lesson-8',
        title: 'Get Back to Editing',
        duration: 1,
        order: 8,
        content: `<h2>Lesson 8: Get Back to Editing</h2>

<h3>8.1 Open Another Terminal Window</h3>
<p>To keep editing with Claude Code while your prototype runs, open a new Terminal window:</p>
<ul>
  <li><strong>Mac:</strong> Command + T (in Terminal app)</li>
  <li><strong>Windows:</strong> Ctrl + Shift + 2 (in Command Prompt)</li>
</ul>

<h3>8.2 Navigate to Your Project</h3>
<p>In the new Terminal, run:</p>
<p><code>cd my-first-prototype</code></p>

<h3>8.3 Start Claude Code Again</h3>
<p>Run:</p>
<p><code>claude</code></p>
<p>Now you have:</p>
<ul>
  <li><strong>Terminal #1:</strong> Your dev server (showing localhost:3000)</li>
  <li><strong>Terminal #2:</strong> Claude Code (where you edit)</li>
  <li><strong>Browser:</strong> Your live prototype updating in real-time</li>
</ul>

<h2>Congratulations!</h2>
<p>You've created your first prototype with Claude Code and seen it live on your machine. This is the foundation of everything you can do with Claude Code as a designer.</p>`,
      },
      // GitHub Lessons (9-13)
      {
        id: 'lesson-9',
        title: 'Create a GitHub Account',
        duration: 1,
        order: 9,
        content: `<h2>Lesson 9: Create a GitHub Account</h2>

<h3>Why GitHub?</h3>
<ul>
  <li><strong>Backup:</strong> Your code is safe in the cloud, not just on your computer</li>
  <li><strong>History:</strong> You can see every change you made and go back if needed</li>
  <li><strong>Collaboration:</strong> Easy to share with developers and teammates</li>
  <li><strong>Portfolio:</strong> Show your work and design-to-code process</li>
</ul>

<h3>9.1 Sign Up</h3>
<ol>
  <li>Go to <strong>github.com</strong></li>
  <li>Click <strong>"Sign up"</strong></li>
  <li>Create an account with your email (you can use your work or personal email)</li>
  <li>Verify your email by clicking the link they send you</li>
</ol>

<h3>9.2 You're Ready!</h3>
<p>GitHub account created. Let's connect your prototype.</p>`,
      },
      {
        id: 'lesson-10',
        title: 'Create a Repository on GitHub',
        duration: 1,
        order: 10,
        content: `<h2>Lesson 10: Create a Repository on GitHub</h2>

<h3>10.1 Create a New Repo</h3>
<ol>
  <li>Click the <strong>"+"</strong> icon in the top right of GitHub</li>
  <li>Select <strong>"New repository"</strong></li>
  <li>Name it <strong>"my-first-prototype"</strong> (same as your local folder)</li>
  <li>Add a description: <strong>"Design prototype created with Claude Code"</strong></li>
  <li>Leave other settings as default</li>
  <li>Click <strong>"Create repository"</strong></li>
</ol>

<h3>10.2 Copy the Setup Instructions</h3>
<p>GitHub will show you commands. Keep this page open—you'll need the commands soon!</p>`,
      },
      {
        id: 'lesson-11',
        title: 'Connect Your Local Project to GitHub',
        duration: 2,
        order: 11,
        content: `<h2>Lesson 11: Connect Your Local Project to GitHub</h2>

<h3>11.1 Open Terminal (Not Claude Code)</h3>
<p>You should be in your project folder. Check with:</p>
<p><code>pwd</code></p>
<p>You should see something like <code>.../my-first-prototype</code></p>

<h3>11.2 Initialize Git</h3>
<p>Run these commands one by one:</p>
<p><code>git init</code></p>
<p><code>git add .</code></p>
<p><code>git commit -m "Initial prototype created with Claude Code"</code></p>

<h3>11.3 Connect to GitHub</h3>
<p>Copy the commands from GitHub's instructions. They'll look like:</p>
<p><code>git branch -M main</code></p>
<p><code>git remote add origin https://github.com/YOUR-USERNAME/my-first-prototype.git</code></p>
<p><code>git push -u origin main</code></p>

<h3>11.4 Check GitHub</h3>
<p>Refresh your GitHub repo page. Your files should now be there!</p>`,
      },
      {
        id: 'lesson-12',
        title: 'Save Your Changes Going Forward',
        duration: 2,
        order: 12,
        content: `<h2>Lesson 12: Save Your Changes Going Forward</h2>

<h3>12.1 Regular Save Workflow</h3>
<p>Every time you make changes in Claude Code that you want to keep:</p>
<ol>
  <li>Exit Claude Code (type <code>exit</code>)</li>
  <li>Run: <code>git add .</code></li>
  <li>Run: <code>git commit -m "Description of what you changed"</code></li>
  <li>Run: <code>git push</code></li>
</ol>

<h3>12.2 Write Good Commit Messages</h3>
<p>Instead of "Updated stuff", try:</p>
<ul>
  <li>"Changed button color from blue to green"</li>
  <li>"Added hover effect to navigation menu"</li>
  <li>"Fixed button padding on mobile"</li>
</ul>
<p>Good messages help you remember what you did and help teammates understand changes.</p>`,
      },
      {
        id: 'lesson-13',
        title: 'Share Your Work & Use Claude\'s /save Command',
        duration: 1,
        order: 13,
        content: `<h2>Lesson 13: Share Your Work & Use Claude's /save Command</h2>

<h3>13.1 Pro Tip - Automatic Saving</h3>
<p>Inside Claude Code, you can type:</p>
<p><code>/save</code></p>
<p>Claude Code will automatically handle git commands and create meaningful commit messages for you. This saves time!</p>

<h3>13.2 Sharing Your Work</h3>
<p>Just send them the GitHub link, like:</p>
<p><code>https://github.com/YOUR-USERNAME/my-first-prototype</code></p>

<h3>13.3 They Can:</h3>
<ul>
  <li>See your code and understand your design decisions</li>
  <li>Clone your project to run locally</li>
  <li>Leave comments or suggestions</li>
  <li>Collaborate on the prototype</li>
</ul>

<h2>You're Now a Designer with Git Skills!</h2>
<p>You can:</p>
<ul>
  <li>✓ Save your work safely to the cloud</li>
  <li>✓ Track every change you make</li>
  <li>✓ Collaborate with developers</li>
  <li>✓ Showcase your process on GitHub</li>
</ul>`,
      },
      // Best Practices Lessons (14-18)
      {
        id: 'lesson-14',
        title: 'How to Describe Your Design to Claude Code',
        duration: 2,
        order: 14,
        content: `<h2>Lesson 14: How to Describe Your Design to Claude Code</h2>

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
</ul>`,
      },
      {
        id: 'lesson-15',
        title: 'Testing Your Prototype',
        duration: 1,
        order: 15,
        content: `<h2>Lesson 15: Testing Your Prototype</h2>

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
</ul>`,
      },
      {
        id: 'lesson-16',
        title: 'Iterating Based on Feedback',
        duration: 1,
        order: 16,
        content: `<h2>Lesson 16: Iterating Based on Feedback</h2>

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
</ul>`,
      },
      {
        id: 'lesson-17',
        title: 'Handing Off Work to Developers',
        duration: 1,
        order: 17,
        content: `<h2>Lesson 17: Handing Off Work to Developers</h2>

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
</ul>`,
      },
      {
        id: 'lesson-18',
        title: 'Troubleshooting Common Issues',
        duration: 1,
        order: 18,
        content: `<h2>Lesson 18: Troubleshooting Common Issues</h2>

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

<h2>You're Ready!</h2>
<p>You now know:</p>
<ul>
  <li>✓ How to set up Claude Code</li>
  <li>✓ How to create prototypes</li>
  <li>✓ How to save your work on GitHub</li>
  <li>✓ Best practices for working with Claude Code</li>
</ul>

<p><strong>Congratulations!</strong> Start building! Create a prototype, share it with your team, and iterate. Claude Code is a tool to speed up your ideas—have fun with it!</p>`,
      },
    ],
    lessonCount: 18,
    totalDuration: 27,
    content: `
      <h2>Welcome to Claude Code Learning Path for Designers</h2>
      <p>Claude Code is an AI-powered development tool that lets you build interactive prototypes, test design ideas in code, and collaborate with developers—all from your terminal. This comprehensive course takes you from zero to confident Claude Code user.</p>

      <h3>What You'll Learn in 18 Lessons</h3>
      <ul>
        <li>How to set up Claude Code and get your API key (Lessons 1-3)</li>
        <li>How to create and run your first prototype locally (Lessons 4-8)</li>
        <li>How to save your work safely using GitHub (Lessons 9-13)</li>
        <li>Best practices and workflows for designer-developer collaboration (Lessons 14-18)</li>
      </ul>

      <h2>Course Structure: 4 Modules, 18 Sequential Lessons</h2>
      <p>This learning path combines focused content into one comprehensive course. Work through lessons in order:</p>

      <h3>Module 1: Setup (6 minutes)</h3>
      <p><strong>Lessons 1-3:</strong> Get your API key from Anthropic, install Node.js, and have Claude Code ready to go. Start here if this is your first time.</p>

      <h3>Module 2: Your First Prototype (8 minutes)</h3>
      <p><strong>Lessons 4-8:</strong> Get hands-on. Launch Claude Code, generate your first prototype, and see it live on your machine. This is where the magic happens.</p>

      <h3>Module 3: GitHub Collaboration (7 minutes)</h3>
      <p><strong>Lessons 9-13:</strong> Don't lose your work. Learn how to save your prototypes to GitHub, collaborate with teammates, and maintain version history.</p>

      <h3>Module 4: Best Practices (6 minutes)</h3>
      <p><strong>Lessons 14-18:</strong> Level up. Master the art of describing designs to Claude Code, iterating on feedback, and handing off work to developers.</p>

      <h2>How to Use This Course</h2>
      <ul>
        <li><strong>First time using Claude Code?</strong> Start with Lesson 1 and follow through in order. Total time: ~27 minutes.</li>
        <li><strong>Already have Claude Code installed?</strong> Jump to Lesson 4 (Module 2) to create your first prototype.</li>
        <li><strong>Need help with a specific topic?</strong> Use lessons as reference. Each module builds on the previous.</li>
        <li><strong>Learn at your own pace.</strong> Pause between lessons to practice what you learned.</li>
      </ul>

      <h2>Why This Approach?</h2>
      <p>Instead of separate guides, this course provides a unified learning path. All 18 lessons flow naturally from beginner to advanced topics, giving you a complete education in Claude Code for design work.</p>

      <h2>Ready to Get Started?</h2>
      <p>Jump into Lesson 1 and begin your Claude Code journey!</p>

      <p style="margin-top: 40px; font-size: 14px; color: #666;">
        <strong>Time estimate:</strong> 27 minutes to complete all lessons + hands-on practice time
      </p>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'cursor-course',
    slug: 'cursor-learning-path',
    title: 'Cursor Guide for Designers',
    description: 'Master Cursor, the AI-powered code editor built on VSCode. Learn intelligent code editing, AI-assisted development, and productivity features for design tools.',
    excerpt: 'Your complete Cursor education: 12 sequential lessons covering setup, features, and advanced workflows. Unlock faster development with AI pair programming.',
    tool: 'Cursor',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 20,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/cursor-ux.jpg',
    tags: ['cursor', 'learning-path', 'getting-started', 'course', 'ai-editor'],
    lessons: [
      { id: 'lesson-1', title: 'Install and Setup Cursor', duration: 2, order: 1, content: '<h2>Lesson 1: Install and Setup Cursor</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Navigate the Interface', duration: 2, order: 2, content: '<h2>Lesson 2: Navigate the Interface</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Basic Code Editing', duration: 2, order: 3, content: '<h2>Lesson 3: Basic Code Editing</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'AI Code Completions', duration: 2, order: 4, content: '<h2>Lesson 4: AI Code Completions</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Cursor AI Chat', duration: 2, order: 5, content: '<h2>Lesson 5: Cursor AI Chat</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Code Refactoring with AI', duration: 2, order: 6, content: '<h2>Lesson 6: Code Refactoring with AI</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Debugging Tools', duration: 2, order: 7, content: '<h2>Lesson 7: Debugging Tools</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Extensions and Customization', duration: 2, order: 8, content: '<h2>Lesson 8: Extensions and Customization</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'Working with Design Files', duration: 2, order: 9, content: '<h2>Lesson 9: Working with Design Files</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Team Collaboration', duration: 2, order: 10, content: '<h2>Lesson 10: Team Collaboration</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-11', title: 'Advanced AI Features', duration: 2, order: 11, content: '<h2>Lesson 11: Advanced AI Features</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-12', title: 'Best Practices and Tips', duration: 0, order: 12, content: '<h2>Lesson 12: Best Practices and Tips</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>Cursor Learning Path</h2><p>Master the most powerful AI-assisted code editor built on VSCode. Learn from setup to advanced workflows.</p>',
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'copilot-course',
    slug: 'github-copilot-learning-path',
    title: 'GitHub Copilot Guide for Designers',
    description: 'Learn GitHub Copilot, the AI pair programmer powered by OpenAI. Master code suggestions, documentation, and productivity with AI-assisted development.',
    excerpt: 'Your complete GitHub Copilot guide: 10 lessons covering installation, code suggestions, chat features, and enterprise workflows.',
    tool: 'GitHub Copilot',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 18,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/copilot-ux.jpg',
    tags: ['copilot', 'learning-path', 'github', 'course', 'ai-programming'],
    lessons: [
      { id: 'lesson-1', title: 'Install GitHub Copilot', duration: 2, order: 1, content: '<h2>Lesson 1: Install GitHub Copilot</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Your First Code Suggestion', duration: 2, order: 2, content: '<h2>Lesson 2: Your First Code Suggestion</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Code Comments to Code', duration: 2, order: 3, content: '<h2>Lesson 3: Code Comments to Code</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'GitHub Copilot Chat', duration: 2, order: 4, content: '<h2>Lesson 4: GitHub Copilot Chat</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Testing with Copilot', duration: 2, order: 5, content: '<h2>Lesson 5: Testing with Copilot</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Documentation Generation', duration: 2, order: 6, content: '<h2>Lesson 6: Documentation Generation</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Enterprise Copilot', duration: 2, order: 7, content: '<h2>Lesson 7: Enterprise Copilot</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Tips and Tricks', duration: 2, order: 8, content: '<h2>Lesson 8: Tips and Tricks</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'Ethical AI Development', duration: 1, order: 9, content: '<h2>Lesson 9: Ethical AI Development</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Next Steps and Resources', duration: 1, order: 10, content: '<h2>Lesson 10: Next Steps and Resources</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>GitHub Copilot Learning Path</h2><p>Become proficient with GitHub Copilot, your AI pair programmer. Master code suggestions and AI-assisted development.</p>',
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'replit-course',
    slug: 'replit-ai-learning-path',
    title: 'Replit AI Guide for Designers',
    description: 'Master Replit AI for collaborative coding and deployment. Learn intelligent development, real-time collaboration, and cloud deployment with AI assistance.',
    excerpt: 'Your complete Replit AI guide: 8 lessons covering platform basics, AI features, collaboration, and deployment.',
    tool: 'Replit AI',
    useCase: 'Learning Path',
    skillLevel: 'Intermediate',
    designDomain: 'UX Design',
    readTime: 15,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/replit-ux.jpg',
    tags: ['replit', 'learning-path', 'cloud-coding', 'course', 'collaboration'],
    lessons: [
      { id: 'lesson-1', title: 'Getting Started with Replit', duration: 2, order: 1, content: '<h2>Lesson 1: Getting Started with Replit</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Create Your First Repl', duration: 2, order: 2, content: '<h2>Lesson 2: Create Your First Repl</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Replit AI Features', duration: 2, order: 3, content: '<h2>Lesson 3: Replit AI Features</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'Real-Time Collaboration', duration: 2, order: 4, content: '<h2>Lesson 4: Real-Time Collaboration</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Database Integration', duration: 2, order: 5, content: '<h2>Lesson 5: Database Integration</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Deploying Your Project', duration: 2, order: 6, content: '<h2>Lesson 6: Deploying Your Project</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Advanced Workflows', duration: 1, order: 7, content: '<h2>Lesson 7: Advanced Workflows</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Best Practices and Tips', duration: 0, order: 8, content: '<h2>Lesson 8: Best Practices and Tips</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>Replit AI Learning Path</h2><p>Discover the power of Replit AI for collaborative cloud-based development. Master team coding and deployment.</p>',
    relatedPatterns: ['Contextual Assistance', 'Collaborative AI'],
  },
  {
    id: 'v0-course',
    slug: 'v0-by-vercel-learning-path',
    title: 'V0 by Vercel Guide for Designers',
    description: 'Learn V0 by Vercel, the AI tool for generating React components. Master design-to-code, component editing, and modern web development with AI.',
    excerpt: 'Your complete V0 guide: 10 lessons covering component generation, design-to-code, and production workflows.',
    tool: 'V0 by Vercel',
    useCase: 'Learning Path',
    skillLevel: 'Intermediate',
    designDomain: 'UX Design',
    readTime: 16,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/v0-ux.jpg',
    tags: ['v0', 'learning-path', 'design-to-code', 'course', 'react-components'],
    lessons: [
      { id: 'lesson-1', title: 'Introduction to V0', duration: 2, order: 1, content: '<h2>Lesson 1: Introduction to V0</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Generate Your First Component', duration: 2, order: 2, content: '<h2>Lesson 2: Generate Your First Component</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Design-to-Code Workflow', duration: 2, order: 3, content: '<h2>Lesson 3: Design-to-Code Workflow</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'Editing Generated Components', duration: 2, order: 4, content: '<h2>Lesson 4: Editing Generated Components</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Styling and Customization', duration: 2, order: 5, content: '<h2>Lesson 5: Styling and Customization</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Building Complex UIs', duration: 2, order: 6, content: '<h2>Lesson 6: Building Complex UIs</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Integration with Next.js', duration: 2, order: 7, content: '<h2>Lesson 7: Integration with Next.js</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Deployment to Production', duration: 1, order: 8, content: '<h2>Lesson 8: Deployment to Production</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'Performance Optimization', duration: 1, order: 9, content: '<h2>Lesson 9: Performance Optimization</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Advanced Techniques', duration: 0, order: 10, content: '<h2>Lesson 10: Advanced Techniques</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>V0 by Vercel Learning Path</h2><p>Master V0 for AI-generated React components. Transform designs into production-ready code with ease.</p>',
    relatedPatterns: ['Augmented Creation', 'Contextual Assistance'],
  },
  {
    id: 'github-course',
    slug: 'github-learning-path',
    title: 'GitHub Guide for Designers',
    description: 'Master GitHub for collaborative design and development. Learn version control, collaboration workflows, and project management for design teams.',
    excerpt: 'Your complete GitHub guide: 12 lessons covering repositories, version control, collaboration, branching, and design workflows.',
    tool: 'GitHub',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 20,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/github-ux.jpg',
    tags: ['github', 'learning-path', 'version-control', 'course', 'collaboration'],
    lessons: [
      { id: 'lesson-1', title: 'GitHub Basics and Setup', duration: 2, order: 1, content: '<h2>Lesson 1: GitHub Basics and Setup</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Create Your First Repository', duration: 2, order: 2, content: '<h2>Lesson 2: Create Your First Repository</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Understanding Git Basics', duration: 2, order: 3, content: '<h2>Lesson 3: Understanding Git Basics</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'Commits, Pulls, and Pushes', duration: 2, order: 4, content: '<h2>Lesson 4: Commits, Pulls, and Pushes</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Branching Strategies', duration: 2, order: 5, content: '<h2>Lesson 5: Branching Strategies</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Pull Requests and Code Review', duration: 2, order: 6, content: '<h2>Lesson 6: Pull Requests and Code Review</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Merging and Conflict Resolution', duration: 2, order: 7, content: '<h2>Lesson 7: Merging and Conflict Resolution</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Collaboration Best Practices', duration: 2, order: 8, content: '<h2>Lesson 8: Collaboration Best Practices</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'GitHub Pages and Documentation', duration: 2, order: 9, content: '<h2>Lesson 9: GitHub Pages and Documentation</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Project Management Tools', duration: 1, order: 10, content: '<h2>Lesson 10: Project Management Tools</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-11', title: 'Automation and CI/CD Basics', duration: 1, order: 11, content: '<h2>Lesson 11: Automation and CI/CD Basics</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-12', title: 'GitHub Workflows for Design Teams', duration: 1, order: 12, content: '<h2>Lesson 12: GitHub Workflows for Design Teams</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>GitHub Learning Path</h2><p>Learn GitHub for design and development collaboration. Master version control, team workflows, and modern development practices.</p>',
    relatedPatterns: ['Collaborative AI', 'Contextual Assistance'],
  },
];

/**
 * Export courses array with the single comprehensive course
 */
export const courses = guides;

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
