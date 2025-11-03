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
      'Master Claude Code for design and prototyping with AI-powered assistance.',
    excerpt:
      'Your complete Claude Code education: 18 sequential lessons covering setup, prototyping, version control, and professional workflows. Go from zero to confident in one comprehensive course.',
    tool: 'Claude Code',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 27,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/Claude_AI_symbol.svg',
    tags: ['claude-code', 'learning-path', 'getting-started', 'course', 'comprehensive'],
    lessons: [
      // Setup Lessons (1-3)
      {
        id: 'lesson-1',
        title: 'Get Your Anthropic API Key',
        duration: 2,
        order: 1,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Claude Code needs an API key to connect to the Claude AI service. Your API key is like a secret password that tells Anthropic it\'s really you.',
            icon: 'info',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Create an Anthropic Account',
                content: [
                  'Go to console.anthropic.com in your web browser',
                  'Click "Sign up" in the top right',
                  'Create an account using your email and password',
                  'Check your email for a verification link and click it',
                ],
                icon: 'user',
              },
              {
                number: 2,
                title: 'Generate Your API Key',
                content: [
                  'Once logged in, find "API Keys" in the left menu',
                  'Click "Create Key"',
                  'Name it something like "Claude Code for Design"',
                  'Click "Create"',
                  'Copy your key immediately and save it somewhere safe (like a password manager)',
                ],
                icon: 'key',
              },
            ],
          },
          {
            type: 'image',
            alt: 'Anthropic Console API Key Screenshot',
            label: 'Anthropic Console showing where to create and copy API keys',
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Keep Your Key Secure',
            content:
              'Your API key is like a password. Never share it with anyone, post it in Slack/email/public docs, commit it to GitHub, or store it in plain text files in your projects.',
            icon: 'warning',
          },
        ],
      },
      {
        id: 'lesson-2',
        title: 'Install Node.js',
        duration: 2,
        order: 2,
        module: 'setup',
        sections: [
          {
            type: 'text',
            content: 'Node.js is software that lets you run JavaScript code on your computer. You need it to use Claude Code.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Check if You Already Have Node.js',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'On Mac',
                content: [
                  'Press Command + Space, type "Terminal", and hit Enter',
                  'Paste this and press Enter: node --version',
                  'If you see a version number, you\'re done with this section!',
                ],
                icon: 'monitor',
              },
              {
                number: 2,
                title: 'On Windows',
                content: [
                  'Click the Windows logo, type "Command Prompt", and hit Enter',
                  'Paste this and press Enter: node --version',
                  'If you see a version number, skip to the next lesson!',
                ],
                icon: 'monitor',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Install Node.js (If You Need It)',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Go to nodejs.org',
                content: 'Visit the official Node.js website',
                icon: 'download',
              },
              {
                number: 2,
                title: 'Download the "LTS" version',
                content: 'This is the stable, recommended version for production use',
                icon: 'download',
              },
              {
                number: 3,
                title: 'Run the installer and follow the instructions',
                content: 'Just click "Next" on everything - the defaults are perfect for you',
                icon: 'cog',
              },
              {
                number: 4,
                title: 'Verify the installation',
                content: 'Open Terminal/Command Prompt again and run node --version to confirm it worked',
                icon: 'check',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Ready to Continue',
            content: 'Once you see a version number, you have Node.js installed and can move on to the next step!',
            icon: 'success',
          },
        ],
      },
      {
        id: 'lesson-3',
        title: 'Install Claude Code',
        duration: 2,
        order: 3,
        module: 'setup',
        sections: [
          {
            type: 'text',
            content: 'Now that you have Node.js, installing Claude Code is one command away.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Terminal/Command Prompt',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'On Mac',
                content: 'Press Command + Space, type "Terminal", and hit Enter',
                icon: 'terminal',
              },
              {
                number: 2,
                title: 'On Windows',
                content: 'Click Windows logo, type "Command Prompt", and hit Enter',
                icon: 'terminal',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Install Claude Code',
          },
          {
            type: 'text',
            content: 'Copy and paste this command, then press Enter:',
          },
          {
            type: 'code',
            code: 'npm install -g claude-code',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'callout',
            calloutType: 'info',
            content: 'This takes 1-2 minutes. You\'ll see lots of text in the terminal—that\'s completely normal and means it\'s working!',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Verify Installation',
          },
          {
            type: 'text',
            content: 'Run this command to confirm Claude Code is installed:',
          },
          {
            type: 'code',
            code: 'claude --version',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'You should see a version number. If you do, you\'re ready to move on!',
          },
          {
            type: 'completion',
            title: 'Setup Complete!',
            items: [
              'An Anthropic account with an API key',
              'Node.js installed on your computer',
              'Claude Code installed and verified',
            ],
            message: 'You\'re ready to start building! Let\'s move on to creating your first prototype.',
          },
        ],
      },
      // First Prototype Lessons (4-8)
      {
        id: 'lesson-4',
        title: 'Start Your First Claude Code Session',
        duration: 2,
        order: 4,
        module: 'prototype',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Start Your First Claude Code Session',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Terminal',
          },
          {
            type: 'list',
            items: [
              'Mac: Command + Space → "Terminal" → Enter',
              'Windows: Windows logo → "Command Prompt" → Enter',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Launch Claude Code',
          },
          {
            type: 'text',
            content: 'Type this command and press Enter:',
          },
          {
            type: 'code',
            code: 'claude',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Paste Your API Key',
          },
          {
            type: 'text',
            content: 'Claude Code will ask for your API key. Paste the one you saved in the setup guide.',
          },
          {
            type: 'callout',
            calloutType: 'info',
            content: 'Your key won\'t appear as you type—that\'s normal for security!',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Choose a Model',
          },
          {
            type: 'text',
            content: 'Claude Code will ask which model you want. Choose Claude 3.5 Sonnet—it\'s the best balance of speed and power for designers.',
          },
        ],
      },
      {
        id: 'lesson-5',
        title: 'Create Your Project Folder',
        duration: 1,
        order: 5,
        module: 'prototype',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Create Your Project Folder',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Exit Claude Code Temporarily',
          },
          {
            type: 'text',
            content: 'Type exit and press Enter. You\'ll return to your regular Terminal.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Create a Project Folder',
          },
          {
            type: 'text',
            content: 'Run this command:',
          },
          {
            type: 'code',
            code: 'mkdir my-first-prototype',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Then navigate into it:',
          },
          {
            type: 'code',
            code: 'cd my-first-prototype',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Start Claude Code in Your Project',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'claude',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Paste your API key again. Now you\'re inside Claude Code, with your project as the working folder.',
          },
        ],
      },
      {
        id: 'lesson-6',
        title: 'Generate Your First Prototype',
        duration: 2,
        order: 6,
        module: 'prototype',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Generate Your First Prototype',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask Claude Code to Create Something',
          },
          {
            type: 'text',
            content: 'Try this simple request:',
          },
          {
            type: 'code',
            code: 'Create a React button component with a blue background and white text. Add a hover effect that makes the button slightly larger. Use Tailwind CSS for styling.',
            language: 'text',
            label: 'Claude Code',
          },
          {
            type: 'text',
            content: 'Press Enter and watch Claude Code generate code!',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Review What It Created',
          },
          {
            type: 'text',
            content: 'Claude Code will show you the files it made. Read through them to understand what happened.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask for Changes (Optional)',
          },
          {
            type: 'text',
            content: 'If you want to modify something, just ask:',
          },
          {
            type: 'code',
            code: 'Make the button green instead of blue and add rounded corners.',
            language: 'text',
            label: 'Claude Code',
          },
          {
            type: 'text',
            content: 'Claude Code will update the files immediately!',
          },
        ],
      },
      {
        id: 'lesson-7',
        title: 'See Your Prototype Live',
        duration: 2,
        order: 7,
        module: 'prototype',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'See Your Prototype Live',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Exit Claude Code',
          },
          {
            type: 'text',
            content: 'Type exit and press Enter to return to Terminal.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Initialize a React App (If Needed)',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'npx create-react-app .',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'This sets up the structure React needs to run.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Start Your Development Server',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'npm start',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Your prototype will automatically open in your browser at localhost:3000!',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Watch for Live Updates',
          },
          {
            type: 'text',
            content: 'When Claude Code makes changes, your browser automatically updates. No manual refresh needed!',
          },
        ],
      },
      {
        id: 'lesson-8',
        title: 'Get Back to Editing',
        duration: 1,
        order: 8,
        module: 'prototype',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Get Back to Editing',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Another Terminal Window',
          },
          {
            type: 'text',
            content: 'To keep editing with Claude Code while your prototype runs, open a new Terminal window:',
          },
          {
            type: 'list',
            items: [
              'Mac: Command + T (in Terminal app)',
              'Windows: Ctrl + Shift + 2 (in Command Prompt)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Navigate to Your Project',
          },
          {
            type: 'text',
            content: 'In the new Terminal, run:',
          },
          {
            type: 'code',
            code: 'cd my-first-prototype',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Start Claude Code Again',
          },
          {
            type: 'text',
            content: 'Run:',
          },
          {
            type: 'code',
            code: 'claude',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'Now you have:',
          },
          {
            type: 'list',
            items: [
              'Terminal #1: Your dev server (showing localhost:3000)',
              'Terminal #2: Claude Code (where you edit)',
              'Browser: Your live prototype updating in real-time',
            ],
          },
          {
            type: 'completion',
            title: 'Congratulations!',
            items: [
              'Created your first prototype with Claude Code',
              'Saw it live on your machine',
              'Understand the foundation of design workflows with Claude Code',
            ],
            message: 'You\'ve created your first prototype with Claude Code and seen it live on your machine. This is the foundation of everything you can do with Claude Code as a designer.',
          },
        ],
      },
      // GitHub Lessons (9-13)
      {
        id: 'lesson-9',
        title: 'Create a GitHub Account',
        duration: 1,
        order: 9,
        module: 'github',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Create a GitHub Account',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Why GitHub?',
          },
          {
            type: 'list',
            items: [
              'Backup: Your code is safe in the cloud, not just on your computer',
              'History: You can see every change you made and go back if needed',
              'Collaboration: Easy to share with developers and teammates',
              'Portfolio: Show your work and design-to-code process',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Sign Up',
          },
          {
            type: 'list',
            items: [
              'Go to github.com',
              'Click "Sign up"',
              'Create an account with your email (you can use your work or personal email)',
              'Verify your email by clicking the link they send you',
            ],
            ordered: true,
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'You\'re Ready!',
          },
          {
            type: 'text',
            content: 'GitHub account created. Let\'s connect your prototype.',
          },
        ],
      },
      {
        id: 'lesson-10',
        title: 'Create a Repository on GitHub',
        duration: 1,
        order: 10,
        module: 'github',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Create a Repository on GitHub',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Create a New Repo',
          },
          {
            type: 'list',
            items: [
              'Click the "+" icon in the top right of GitHub',
              'Select "New repository"',
              'Name it "my-first-prototype" (same as your local folder)',
              'Add a description: "Design prototype created with Claude Code"',
              'Leave other settings as default',
              'Click "Create repository"',
            ],
            ordered: true,
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Copy the Setup Instructions',
          },
          {
            type: 'text',
            content: 'GitHub will show you commands. Keep this page open—you\'ll need the commands soon!',
          },
        ],
      },
      {
        id: 'lesson-11',
        title: 'Connect Your Local Project to GitHub',
        duration: 2,
        order: 11,
        module: 'github',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Connect Your Local Project to GitHub',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Open Terminal (Not Claude Code)',
          },
          {
            type: 'text',
            content: 'You should be in your project folder. Check with:',
          },
          {
            type: 'code',
            code: 'pwd',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'text',
            content: 'You should see something like .../my-first-prototype',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Initialize Git',
          },
          {
            type: 'text',
            content: 'Run these commands one by one:',
          },
          {
            type: 'code',
            code: 'git init\ngit add .\ngit commit -m "Initial prototype created with Claude Code"',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Connect to GitHub',
          },
          {
            type: 'text',
            content: 'Copy the commands from GitHub\'s instructions. They\'ll look like:',
          },
          {
            type: 'code',
            code: 'git branch -M main\ngit remote add origin https://github.com/YOUR-USERNAME/my-first-prototype.git\ngit push -u origin main',
            language: 'bash',
            label: 'Terminal',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Check GitHub',
          },
          {
            type: 'text',
            content: 'Refresh your GitHub repo page. Your files should now be there!',
          },
        ],
      },
      {
        id: 'lesson-12',
        title: 'Save Your Changes Going Forward',
        duration: 2,
        order: 12,
        module: 'github',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Save Your Changes Going Forward',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Regular Save Workflow',
          },
          {
            type: 'text',
            content: 'Every time you make changes in Claude Code that you want to keep:',
          },
          {
            type: 'list',
            items: [
              'Exit Claude Code (type exit)',
              'Run: git add .',
              'Run: git commit -m "Description of what you changed"',
              'Run: git push',
            ],
            ordered: true,
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Write Good Commit Messages',
          },
          {
            type: 'text',
            content: 'Instead of "Updated stuff", try:',
          },
          {
            type: 'list',
            items: [
              'Changed button color from blue to green',
              'Added hover effect to navigation menu',
              'Fixed button padding on mobile',
            ],
          },
          {
            type: 'text',
            content: 'Good messages help you remember what you did and help teammates understand changes.',
          },
        ],
      },
      {
        id: 'lesson-13',
        title: 'Share Your Work & Use Claude\'s /save Command',
        duration: 1,
        order: 13,
        module: 'github',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Share Your Work & Use Claude\'s /save Command',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Pro Tip - Automatic Saving',
          },
          {
            type: 'text',
            content: 'Inside Claude Code, you can type:',
          },
          {
            type: 'code',
            code: '/save',
            language: 'bash',
            label: 'Claude Code',
          },
          {
            type: 'text',
            content: 'Claude Code will automatically handle git commands and create meaningful commit messages for you. This saves time!',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Sharing Your Work',
          },
          {
            type: 'text',
            content: 'Just send them the GitHub link, like:',
          },
          {
            type: 'code',
            code: 'https://github.com/YOUR-USERNAME/my-first-prototype',
            language: 'text',
            label: 'GitHub',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'They Can:',
          },
          {
            type: 'list',
            items: [
              'See your code and understand your design decisions',
              'Clone your project to run locally',
              'Leave comments or suggestions',
              'Collaborate on the prototype',
            ],
          },
          {
            type: 'completion',
            title: 'You\'re Now a Designer with Git Skills!',
            items: [
              'Save your work safely to the cloud',
              'Track every change you make',
              'Collaborate with developers',
              'Showcase your process on GitHub',
            ],
            message: 'You can save your work safely to the cloud, track every change you make, collaborate with developers, and showcase your process on GitHub.',
          },
        ],
      },
      // Best Practices Lessons (14-18)
      {
        id: 'lesson-14',
        title: 'How to Describe Your Design to Claude Code',
        duration: 2,
        order: 14,
        module: 'practices',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'How to Describe Your Design to Claude Code',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Be Specific, Not Vague',
          },
          {
            type: 'callout',
            calloutType: 'error',
            title: 'Not this:',
            content: 'Create a nice button',
            icon: 'error',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Do this:',
            content: 'Create a button with a #2563EB background, white text, 12px border radius, 16px padding, and a hover effect that makes it 5% larger',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Include Design Details',
          },
          {
            type: 'list',
            items: [
              'Colors: Use hex codes (#2563EB, not "blue")',
              'Sizes: Specify padding, margins, font sizes (16px, not "normal")',
              'Interactions: Describe what happens on hover, click, etc.',
              'Responsiveness: Mention if it needs to work on mobile/tablet',
              'Framework: Say "Use React and Tailwind CSS"',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Good Prompt Examples',
          },
          {
            type: 'list',
            items: [
              'Create a form with email and password fields. Use #1F2937 text, light gray background, and make it responsive.',
              'Build a product card showing: image on top, title below, price, and a \'Buy Now\' button. Make it 300px wide.',
              'Design a navigation bar with a logo on the left and 4 menu items on the right. Make it sticky (stays at top when scrolling).',
            ],
          },
        ],
      },
      {
        id: 'lesson-15',
        title: 'Testing Your Prototype',
        duration: 1,
        order: 15,
        module: 'practices',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Testing Your Prototype',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Test in Different Browsers',
          },
          {
            type: 'list',
            items: [
              'Test in Chrome, Safari, Firefox (not every browser shows things the same)',
              'In your browser, press F12 to open "Developer Tools"',
              'You can simulate phones and tablets to test responsiveness',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Check Accessibility',
          },
          {
            type: 'text',
            content: 'Ask yourself:',
          },
          {
            type: 'list',
            items: [
              'Can I use this with just my keyboard? (Tab through elements)',
              'Is the text readable? (Good contrast between text and background)',
              'Does it work on small screens? (Phone, tablet, desktop)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Test Interactions',
          },
          {
            type: 'list',
            items: [
              'Hover over buttons—does the effect work smoothly?',
              'Click buttons—do they do what you expect?',
              'Try animations—are they fast enough? Too slow?',
            ],
          },
        ],
      },
      {
        id: 'lesson-16',
        title: 'Iterating Based on Feedback',
        duration: 1,
        order: 16,
        module: 'practices',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Iterating Based on Feedback',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask for Small Changes, Not Rewrites',
          },
          {
            type: 'callout',
            calloutType: 'error',
            title: 'Don\'t:',
            content: 'I don\'t like this design, redo it',
            icon: 'error',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Do:',
            content: 'Make the button taller and add more space between the inputs',
            icon: 'check',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Use Version History',
          },
          {
            type: 'text',
            content: 'If you don\'t like a change, you can always go back to a previous version on GitHub:',
          },
          {
            type: 'list',
            items: [
              'View your commit history on GitHub',
              'Click on an old version',
              'Compare what changed',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Collaborate Effectively',
          },
          {
            type: 'list',
            items: [
              'Show your prototype to teammates early (don\'t wait for perfection)',
              'Ask specific questions: "Does this button feel clickable to you?"',
              'Document design decisions in code comments',
            ],
          },
        ],
      },
      {
        id: 'lesson-17',
        title: 'Handing Off Work to Developers',
        duration: 1,
        order: 17,
        module: 'practices',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Handing Off Work to Developers',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Prepare Your Code for Handoff',
          },
          {
            type: 'list',
            items: [
              'Push to GitHub: Make sure all your latest work is on GitHub',
              'Add comments: Explain why you made certain design choices in the code',
              'Create a README: A simple document explaining what the prototype does and how to run it',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Write a Good README',
          },
          {
            type: 'text',
            content: 'Create a file called README.md with:',
          },
          {
            type: 'list',
            items: [
              'What the prototype is for',
              'How to run it (e.g., "Run npm start to see the prototype")',
              'Design notes (e.g., "Button interactions should feel snappy")',
              'Links to design files (Figma, etc.)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Be Available for Questions',
          },
          {
            type: 'text',
            content: 'Developers will have questions about your design. Be ready to:',
          },
          {
            type: 'list',
            items: [
              'Explain why you made certain choices',
              'Show design references or inspiration',
              'Discuss trade-offs (e.g., why animation smoothness matters)',
            ],
          },
        ],
      },
      {
        id: 'lesson-18',
        title: 'Troubleshooting Common Issues',
        duration: 1,
        order: 18,
        module: 'practices',
        sections: [
          {
            type: 'heading',
            level: 'h2',
            content: 'Troubleshooting Common Issues',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Claude Code Won\'t Start',
          },
          {
            type: 'list',
            items: [
              'Check your API key (copy it again if needed)',
              'Make sure you\'ve updated Node.js: npm install -g npm',
              'Reinstall Claude Code: npm install -g claude-code@latest',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Development Server Won\'t Start',
          },
          {
            type: 'list',
            items: [
              'Press Ctrl + C to stop it',
              'Run npm start again',
              'Check if port 3000 is already in use by another program',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Git/GitHub Issues',
          },
          {
            type: 'list',
            items: [
              'Forgot to initialize git? Run git init',
              'Wrong remote? Check with git remote -v',
              'Need a fresh start? Delete the .git folder and start over',
            ],
          },
          {
            type: 'heading',
            level: 'h2',
            content: 'Key Takeaways',
          },
          {
            type: 'list',
            items: [
              'Specific is better than vague. The more detail you give Claude Code, the better the result.',
              'Test early and often. Don\'t wait until the end to see if something works.',
              'Iterate in small steps. Ask for one thing at a time, not everything at once.',
              'Document your decisions. Help future you and your teammates understand why you made choices.',
              'Use git effectively. Meaningful commit messages are your documentation.',
            ],
          },
          {
            type: 'completion',
            title: 'You\'re Ready!',
            items: [
              'How to set up Claude Code',
              'How to create prototypes',
              'How to save your work on GitHub',
              'Best practices for working with Claude Code',
            ],
            message: 'Congratulations! Start building! Create a prototype, share it with your team, and iterate. Claude Code is a tool to speed up your ideas—have fun with it!',
          },
        ],
      },
    ],
    lessonCount: 18,
    totalDuration: 27,
    content: `
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Claude Code Learning Path for Designers</h2>
      <p class="text-lg text-gray-700 mb-8">Claude Code is an AI-powered development tool that lets you build interactive prototypes, test design ideas in code, and collaborate with developers. <strong>Complete this course in 27 minutes and go from zero to confident.</strong></p>

      <h3 class="text-3xl font-bold text-gray-900 mt-12 mb-3">What You'll Learn</h3>
      <p class="text-lg text-gray-700 mb-8">This learning path is structured in 4 sequential modules that build on each other. Complete all lessons in order for the best learning experience.</p>

      <!-- Enhanced Module Flow with Visual Hierarchy - Black & White Design -->
      <div class="mb-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Module 1: Setup -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">1</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Setup</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Prepare your environment and get your API key ready</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Foundation</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 2: Prototype -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">2</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Prototype</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Create your first interactive prototype with AI</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Build</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 3: GitHub -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">3</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">GitHub</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Save and share your work with version control</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Collaborate</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 4: Best Practices -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">4</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Best Practices</h4>
              <p class="text-sm text-gray-700 flex-grow">Learn professional workflows and optimization techniques</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Master</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Info - Black & White -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-900">
          <div class="flex items-center justify-center flex-wrap gap-12">
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Modules</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Lessons</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">18</p>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-6">What's in Each Module?</h3>
      <div class="overflow-x-auto mb-12">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b-2 border-gray-900">
              <th class="text-left py-3 px-4 font-bold text-gray-900">Module</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Description</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Key Topics</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">1. Setup</td>
              <td class="py-4 px-4 text-gray-700 align-top">Prepare your environment for success</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Create an Anthropic account and get your API key</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Install Node.js on your computer</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Install and verify Claude Code</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">2. Prototype</td>
              <td class="py-4 px-4 text-gray-700 align-top">Build your first interactive project</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Launch Claude Code and start your first session</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Create a working prototype from scratch</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Test and iterate on your design</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">3. GitHub</td>
              <td class="py-4 px-4 text-gray-700 align-top">Save and collaborate on your work</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Initialize Git and create a GitHub repository</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Commit and push your prototype code</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Learn version control best practices</span></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">4. Best Practices</td>
              <td class="py-4 px-4 text-gray-700 align-top">Master professional workflows</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Write clear, specific prompts for better results</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Test across browsers and devices</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Hand off work to developers professionally</span></li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-4">Getting Started</h3>
      <p class="text-gray-700 mb-4">Choose the path that fits your needs:</p>
      <ul class="space-y-3 mb-8">
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">New to Claude Code?</strong> Start at the beginning and follow through sequentially to complete all lessons.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Already have Claude Code installed?</strong> Jump straight to "Your First Prototype" and get hands-on immediately.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Need specific help?</strong> Each module builds on the previous, but you can use them as standalone references.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Learn at your own pace</strong> — Pause between sections to practice and experiment with what you learned.</li>
      </ul>

      <div class="p-6 bg-gray-900 text-white rounded-lg">
        <h3 class="text-xl font-bold mb-2">Ready to Get Started?</h3>
        <p>Jump in and begin your Claude Code journey! Start with the first module or jump to where you need help.</p>
      </div>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'cursor-course',
    slug: 'cursor-learning-path',
    title: 'Cursor Guide for Designers',
    description: 'Master Cursor, the AI-powered code editor for designers.',
    excerpt: 'Your complete Cursor education: 12 sequential lessons covering setup, features, and advanced workflows. Unlock faster development with AI pair programming.',
    tool: 'Cursor',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 20,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cursor_logo.png',
    tags: ['cursor', 'learning-path', 'getting-started', 'course', 'ai-editor'],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Download and Install Cursor',
        duration: 2,
        order: 1,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Cursor is a modern code editor built on VS Code, with AI superpowers built right in. Getting it installed is quick and easy. By the end of this lesson, you\'ll have Cursor ready to use.',
            icon: 'download',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'System Requirements',
          },
          {
            type: 'text',
            content: 'Cursor works on Windows, macOS 10.15+, and Linux. You need at least 4 GB of RAM and 2 GB of free disk space. If you can run VS Code, you can run Cursor.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step 1: Download Cursor',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Go to cursor.com',
                content: 'Visit the official Cursor website in your web browser.',
                icon: 'download',
              },
              {
                number: 2,
                title: 'Choose Your Platform',
                content: 'Click the button for your operating system: Windows, macOS (ARM64 for Apple Silicon or x64 for Intel), or Linux.',
                icon: 'monitor',
              },
              {
                number: 3,
                title: 'Wait for Download',
                content: 'The installer will download (usually 200-300 MB). This takes 1-5 minutes depending on your internet speed.',
                icon: 'download',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step 2: Install Cursor',
          },
          {
            type: 'text',
            content: 'Once downloaded, the installation process depends on your operating system:',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'On macOS',
          },
          {
            type: 'list',
            items: [
              'Double-click the .dmg file you downloaded',
              'Drag the Cursor icon to the Applications folder',
              'Wait for the copy to complete',
              'Open Applications folder and double-click Cursor to launch',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'On Windows',
          },
          {
            type: 'list',
            items: [
              'Double-click the .exe installer file',
              'Click "Install" when the installer opens',
              'Choose your installation location (default is fine)',
              'Wait for the installation to complete',
              'Click "Launch" to open Cursor',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'On Linux',
          },
          {
            type: 'list',
            items: [
              'Make the .AppImage executable: chmod +x cursor-*.AppImage',
              'Run it: ./cursor-*.AppImage',
              'Or use your package manager if available for your distro',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step 3: Set Up Your Account',
          },
          {
            type: 'text',
            content: 'When Cursor launches for the first time, you\'ll see a welcome screen.',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Create or Sign In',
                content: 'Click "Sign up" to create a free Cursor account, or log in if you already have one.',
                icon: 'user',
              },
              {
                number: 2,
                title: 'Verify Your Email',
                content: 'Check your email inbox and click the verification link.',
                icon: 'mail',
              },
              {
                number: 3,
                title: 'Choose Your Plan',
                content: 'You\'ll automatically get a one-week Pro trial with full features. Explore everything! After the trial, the Free plan stays active.',
                icon: 'star',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Welcome to Cursor!',
            content: 'You now have Cursor installed and a one-week free trial of the Pro plan. This gives you access to all features—Tab completions, Chat, Composer, Agent mode, and more. Use this time to explore and see what\'s possible with AI-powered development.',
            icon: 'success',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Optional: Bring Over Your VS Code Settings',
          },
          {
            type: 'text',
            content: 'If you use VS Code already, you can import your settings, keybindings, and extensions:',
          },
          {
            type: 'list',
            items: [
              'Open Cursor',
              'Go to Settings (Cmd+, on Mac, Ctrl+, on Windows)',
              'Search for "Import"',
              'Follow the prompts to import from VS Code',
            ],
          },
          {
            type: 'completion',
            title: 'Installation Complete!',
            items: [
              'Cursor is installed on your computer',
              'Your account is set up and verified',
              'You have a one-week Pro trial',
              'All AI features are ready to use',
            ],
            message: 'Congratulations! You\'re ready to meet the Cursor interface and start learning AI-powered coding.',
          },
        ],
      },
      {
        id: 'lesson-2',
        title: 'Navigate the Interface',
        duration: 2,
        order: 2,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Cursor looks and feels like VS Code—because it\'s built on it. But it adds AI tools you won\'t find anywhere else. Let\'s explore where everything is.',
            icon: 'compass',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Main Layout',
          },
          {
            type: 'text',
            content: 'When you open Cursor, you\'ll see the familiar VS Code layout. The interface has these main areas:',
          },
          {
            type: 'list',
            items: [
              '**Left Sidebar**: File explorer, search, Git, and extensions',
              '**Main Editor**: Where your code lives. Open multiple files in tabs.',
              '**Right Side Panels**: Chat panel (AI assistant) and other tools',
              '**Bottom Panel**: Terminal, problems, output, and debug info',
            ],
          },
          {
            type: 'image',
            alt: 'Cursor interface layout showing sidebar, editor, chat panel, and terminal areas with labeled annotations',
            label: 'Overview of the main Cursor interface with AI-specific elements highlighted',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'AI-Specific Elements',
          },
          {
            type: 'text',
            content: 'Cursor adds special UI elements for AI features. Here\'s what\'s unique:',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'The Chat Panel (Right Side)',
          },
          {
            type: 'text',
            content: 'This is your AI assistant. Open it with Cmd+L (Mac) or Ctrl+L (Windows). Ask questions, explain errors, or get code suggestions. You can close and reopen it anytime.',
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'The Prompt Bars',
          },
          {
            type: 'text',
            content: 'Three quick ways to invoke AI:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+L (Chat)**: Ask AI a question in the Chat panel',
              '**Cmd+K (Inline Edit)**: Highlight code and press Cmd+K to edit it with natural language',
              '**Tab (Autocomplete)**: Start typing and the AI suggests the next line(s)',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Composer (Cmd+I)',
          },
          {
            type: 'text',
            content: 'This is your multi-file AI editor. It can create or modify multiple files at once. Opens as a floating window or full-screen mode. Perfect for generating entire components or features.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Essential Keyboard Shortcuts',
          },
          {
            type: 'text',
            content: 'Memorizing these will supercharge your workflow:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+L** (Mac) / **Ctrl+L** (Windows): Open Chat panel',
              '**Cmd+K** / **Ctrl+K**: Inline edit with AI (highlight code first)',
              '**Cmd+I** / **Ctrl+I**: Open Composer (floating)',
              '**Cmd+Shift+I** / **Ctrl+Shift+I**: Open Composer (full-screen)',
              '**Cmd+Enter** / **Ctrl+Enter**: Give AI your full codebase as context',
              '**Cmd+P** / **Ctrl+P**: Quick file search and navigation',
              '**Cmd+/** / **Ctrl+**: Toggle comment on selected code',
              '**Tab**: Accept autocomplete suggestion',
              '**Escape**: Reject autocomplete or close panels',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'File Explorer (Left Sidebar)',
          },
          {
            type: 'text',
            content: 'This works just like VS Code. Browse your project files, create folders and files, and drag to organize. The top button opens a folder or creates a new project.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Terminal (Bottom)',
          },
          {
            type: 'text',
            content: 'Click the Terminal tab at the bottom to open the command line. You can run commands, start a dev server, or commit to Git. Press Ctrl+K (or Cmd+K) in the terminal to ask AI to generate a command.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Opening a Project',
          },
          {
            type: 'text',
            content: 'To start working:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'File menu',
                content: 'Click File → Open Folder',
                icon: 'folder',
              },
              {
                number: 2,
                title: 'Choose your project',
                content: 'Navigate to where your code lives on your computer',
                icon: 'search',
              },
              {
                number: 3,
                title: 'Click Open',
                content: 'Cursor loads your project and shows all files in the left sidebar',
                icon: 'check',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Pro Tip',
            content: 'You can also drag a folder onto the Cursor icon in your dock (Mac) or taskbar (Windows) to open it instantly.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Interface Mastery!',
            items: [
              'You understand the main layout and panels',
              'You know where the AI tools are (Chat, Composer, prompts)',
              'You\'ve learned the essential keyboard shortcuts',
              'You can open projects and navigate files',
            ],
            message: 'You\'re now comfortable navigating Cursor. Next, we\'ll learn how to edit code with AI assistance.',
          },
        ],
      },
      {
        id: 'lesson-3',
        title: 'Edit Code with AI Assistance',
        duration: 2,
        order: 3,
        module: 'setup',
        sections: [
          {
            type: 'intro',
            content: 'Now that you\'re comfortable in Cursor, let\'s learn the basics of editing code. You\'ll use the same tools as VS Code—but with AI magic behind the scenes.',
            icon: 'code',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Creating Your First File',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Open a project folder',
                content: 'File → Open Folder, then select a project or create a new folder',
                icon: 'folder',
              },
              {
                number: 2,
                title: 'Create a new file',
                content: 'In the left sidebar, right-click in the file explorer and select "New File"',
                icon: 'file',
              },
              {
                number: 3,
                title: 'Name it',
                content: 'Type a filename like "app.js" or "component.jsx". Cursor recognizes the file type by the extension.',
                icon: 'edit',
              },
              {
                number: 4,
                title: 'Start typing',
                content: 'Start writing code. You\'ll see autocomplete suggestions appear.',
                icon: 'keyboard',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Basic Editing Features (Just Like VS Code)',
          },
          {
            type: 'text',
            content: 'Cursor inherits all of VS Code\'s powerful editing features:',
          },
          {
            type: 'list',
            items: [
              '**Multi-cursor editing**: Hold Alt and click to place multiple cursors, then type once and edit multiple lines at once',
              '**Find and Replace**: Cmd+F (Mac) or Ctrl+F (Windows) to find text, Cmd+H to find and replace',
              '**Select code blocks**: Click the icon next to a function/class to expand/collapse it',
              '**Split view**: Drag a tab to the right edge to see two files side-by-side',
              '**Multiple tabs**: Open as many files as you want. Click tabs to switch between them',
              '**Auto-save**: By default, files save automatically (look for the dot on the tab to see unsaved changes)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Git Integration (Version Control)',
          },
          {
            type: 'text',
            content: 'Cursor includes built-in Git support. Click the Git icon (branch symbol) in the left sidebar:',
          },
          {
            type: 'list',
            items: [
              'See which files changed (Source Control panel)',
              'Stage files by clicking the + button',
              'Write a commit message',
              'Click the checkmark to commit',
              'Push or pull from the command palette (Cmd+P)',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'What\'s Git?',
            content: 'Git tracks changes to your code over time. Think of it like "save history" for programming. It\'s essential for collaboration and backup.',
            icon: 'info',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Extensions (Add-ons)',
          },
          {
            type: 'text',
            content: 'Cursor uses the same VS Code extensions. Popular ones for designers include:',
          },
          {
            type: 'list',
            items: [
              '**Prettier**: Auto-formats your code to look clean',
              '**ESLint**: Catches code mistakes before they cause problems',
              '**Live Server**: Preview your code in a browser automatically',
              '**Thunder Client**: Test APIs without leaving the editor',
              '**Tailwind CSS IntelliSense**: Smart suggestions for Tailwind classes',
            ],
          },
          {
            type: 'text',
            content: 'To install extensions, click the Extensions icon (puzzle piece) on the left sidebar and search for what you need.',
          },
          {
            type: 'completion',
            title: 'Editing Fundamentals Ready!',
            items: [
              'You can create and edit files in Cursor',
              'You understand multi-cursor editing and find/replace',
              'You know how to use split view to see multiple files',
              'You\'re aware of Git for version control',
              'You can install extensions to customize your environment',
            ],
            message: 'Great! You now have the foundation to work with code. Next, we\'ll explore the AI features that make Cursor special.',
          },
        ],
      },
      {
        id: 'lesson-4',
        title: 'Use Tab Completions',
        duration: 2,
        order: 4,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Tab autocomplete is Cursor\'s most powerful feature for speed. As you type, it predicts what comes next—often multiple lines at a time. The AI learns from your code and patterns.',
            icon: 'zap',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'How Tab Autocomplete Works',
          },
          {
            type: 'text',
            content: 'Start typing code. After a few characters, a suggestion appears grayed out. This is Cursor\'s AI predicting your next line(s). Press Tab to accept it.',
          },
          {
            type: 'image',
            alt: 'Cursor Tab completion showing AI suggestion appearing as you type code',
            label: 'Tab autocomplete in action with multi-line suggestion',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Accepting and Rejecting Suggestions',
          },
          {
            type: 'list',
            items: [
              '**Tab**: Accept the entire suggestion',
              '**Escape**: Reject and dismiss the suggestion',
              '**Ctrl+→ (or Cmd+→)**: Accept just the next word',
              '**Delete**: Clear the suggestion and keep typing your own code',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Pro Tips for Better Suggestions',
          },
          {
            type: 'text',
            content: 'The better context Cursor has, the better its suggestions:',
          },
          {
            type: 'list',
            items: [
              '**Write clear comments**: If you write "// Create a button with onClick handler", Cursor will suggest the code to match',
              '**Follow naming patterns**: Consistent names help Cursor predict what you\'re building',
              '**Keep related code nearby**: Don\'t spread imports and usage far apart',
              '**Write function signatures first**: Define the function name and parameters, Cursor suggests the body',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example: React Component',
          },
          {
            type: 'text',
            content: 'Type this and watch Cursor autocomplete the component:',
          },
          {
            type: 'code',
            code: 'function Button({ label, onClick }) {',
            language: 'javascript',
            label: 'Start typing this...',
          },
          {
            type: 'text',
            content: 'Cursor will suggest the rest: return statement, Tailwind classes, etc.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Free vs Pro: Autocomplete Limits',
          },
          {
            type: 'text',
            content: 'On the Free plan, you get basic autocomplete. The Pro plan ($20/month) includes unlimited tab completions and longer context windows for smarter suggestions.',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Pro Tip',
            content: 'Tab autocomplete works best on straightforward, predictable code (components, loops, API calls). For complex logic, use Chat (Cmd+L) instead.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Autocomplete Mastered!',
            items: [
              'You understand how Tab autocomplete predicts code',
              'You can accept, reject, and control suggestions',
              'You know how to write code that gets better suggestions',
              'You\'ve seen real examples of autocomplete in action',
            ],
            message: 'Excellent! Tab completion is your speed tool. Next, let\'s meet Chat—your conversational AI assistant.',
          },
        ],
      },
      {
        id: 'lesson-5',
        title: 'Chat with AI (Cmd+L)',
        duration: 2,
        order: 5,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Chat (Cmd+L) is your AI pair programmer. Ask questions, explain errors, request code—it\'s a full conversation. Unlike autocomplete, Chat is perfect for explanations, debugging, and larger tasks.',
            icon: 'chat',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Opening Chat',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Press Cmd+L (Mac) or Ctrl+L (Windows)',
                content: 'The Chat panel opens on the right side.',
                icon: 'keyboard',
              },
              {
                number: 2,
                title: 'Type your question or request',
                content: 'Anything from "What does this function do?" to "Create a form component"',
                icon: 'edit',
              },
              {
                number: 3,
                title: 'Press Enter',
                content: 'Cursor AI responds with an answer, explanation, or code.',
                icon: 'send',
              },
            ],
          },
          {
            type: 'image',
            alt: 'Cursor Chat panel showing conversation with AI assistant',
            label: 'Complete Chat interaction from question to response',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Adding Code Context to Chat',
          },
          {
            type: 'text',
            content: 'To ask about specific code, highlight it first, then:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Highlight code in your editor',
                content: 'Select the code you want to discuss.',
                icon: 'select',
              },
              {
                number: 2,
                title: 'Press Ctrl+L (add to Chat)',
                content: 'On macOS, this is Cmd+L. That code is added to the Chat input.',
                icon: 'add',
              },
              {
                number: 3,
                title: 'Type your question',
                content: 'Now ask about that code: "Why does this error occur?" or "How can I optimize this?"',
                icon: 'edit',
              },
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Ask Mode vs Edit Mode',
          },
          {
            type: 'text',
            content: 'Chat has two modes (toggle at the top of the Chat panel):',
          },
          {
            type: 'list',
            items: [
              '**Ask Mode**: Get suggestions and answers without changing your code',
              '**Edit Mode**: Let AI modify your code directly (great for refactoring)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example Questions You Can Ask',
          },
          {
            type: 'list',
            items: [
              '"Explain this JavaScript function in simple terms"',
              '"Why am I getting this error? [paste error message]"',
              '"How do I create a React component that does [what you want]?"',
              '"What\'s the best way to style this with Tailwind?"',
              '"Refactor this code to use async/await"',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Pro Tip',
            content: 'Be specific! "Create a button" is vague. "Create a React button component with a blue background, white text, and a hover effect that scales up" gives Cursor much better direction.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Chat Fluency Achieved!',
            items: [
              'You can open Chat and ask questions',
              'You can add code context to your questions',
              'You understand Ask vs Edit mode',
              'You\'re comfortable with the Chat workflow',
            ],
            message: 'Great! Chat is your AI partner for in-depth help. Next, let\'s learn Cmd+K for quick inline edits.',
          },
        ],
      },
      {
        id: 'lesson-6',
        title: 'Make Inline Edits (Cmd+K)',
        duration: 2,
        order: 6,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Cmd+K is your quick-edit tool. Highlight code and press Cmd+K to refactor, fix, or modify it with natural language instructions. No Chat panel needed.',
            icon: 'edit',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Cmd+K Workflow',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Highlight code in your editor',
                content: 'Select the code you want to change.',
                icon: 'select',
              },
              {
                number: 2,
                title: 'Press Cmd+K (Mac) or Ctrl+K (Windows)',
                content: 'A prompt bar appears right above your code.',
                icon: 'keyboard',
              },
              {
                number: 3,
                title: 'Type your instruction',
                content: 'Tell the AI what to do: "Make it faster", "Add error handling", "Use Tailwind instead"',
                icon: 'edit',
              },
              {
                number: 4,
                title: 'Press Enter',
                content: 'Cursor edits the code inline and shows you the result.',
                icon: 'check',
              },
            ],
          },
          {
            type: 'image',
            alt: 'Cmd+K prompt bar showing inline code edit transformation',
            label: 'Cmd+K workflow: select code, prompt, and inline result',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example Edits',
          },
          {
            type: 'text',
            content: 'Here\'s what Cmd+K can do. Select the code and try:',
          },
          {
            type: 'code',
            code: 'if (user) { alert("Welcome"); }',
            language: 'javascript',
            label: 'Original code',
          },
          {
            type: 'text',
            content: 'Cmd+K → "Convert to console.log instead of alert"',
          },
          {
            type: 'code',
            code: 'if (user) { console.log("Welcome"); }',
            language: 'javascript',
            label: 'After Cmd+K',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Cmd+K vs Chat (Cmd+L): When to Use Which',
          },
          {
            type: 'text',
            content: 'Both use AI, but for different situations:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+K**: Quick changes to existing code (refactor, fix, adjust)',
              '**Chat (Cmd+L)**: Explanations, debugging, understanding code, creating new code from scratch',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Bonus: Cmd+K in Terminal',
          },
          {
            type: 'text',
            content: 'You can also use Cmd+K in the Terminal (bottom of Cursor) to generate shell commands from natural language:',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Click in the Terminal',
                content: 'Focus the terminal at the bottom of the screen.',
                icon: 'terminal',
              },
              {
                number: 2,
                title: 'Press Cmd+K (Mac) or Ctrl+K (Windows)',
                content: 'A prompt appears in the terminal.',
                icon: 'keyboard',
              },
              {
                number: 3,
                title: 'Describe what you want',
                content: '"Remove all node_modules folders" or "Restart the dev server"',
                icon: 'edit',
              },
              {
                number: 4,
                title: 'Press Enter',
                content: 'Cursor generates and runs the command.',
                icon: 'check',
              },
            ],
          },
          {
            type: 'callout',
            calloutType: 'warning',
            title: 'Review Terminal Commands',
            content: 'Always review terminal commands before pressing Enter. The AI might misunderstand, and bad terminal commands can cause problems.',
            icon: 'warning',
          },
          {
            type: 'completion',
            title: 'Inline Editing Mastered!',
            items: [
              'You can select code and use Cmd+K to edit it',
              'You understand the difference between Cmd+K and Chat',
              'You know how to use Cmd+K in the terminal',
              'You\'re confident with quick, targeted edits',
            ],
            message: 'Perfect! Cmd+K is your speed tool for edits. Next, meet Composer—the power tool for generating entire features.',
          },
        ],
      },
      {
        id: 'lesson-7',
        title: 'Build with Composer',
        duration: 2,
        order: 7,
        module: 'prototype',
        sections: [
          {
            type: 'intro',
            content: 'Composer is Cursor\'s superpower. While Tab handles single suggestions and Chat handles questions, Composer creates entire features—multiple files at once. This is where you build fast.',
            icon: 'sparkles',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Opening Composer',
          },
          {
            type: 'text',
            content: 'Two ways to open Composer:',
          },
          {
            type: 'list',
            items: [
              '**Cmd+I** (floating window): Smaller, dockable window while you work',
              '**Cmd+Shift+I** (full screen): Dedicated workspace, better for complex tasks',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Normal vs Agent Mode',
          },
          {
            type: 'text',
            content: 'Composer has two modes:',
          },
          {
            type: 'list',
            items: [
              '**Normal Mode**: You guide each step. You see the changes and approve them.',
              '**Agent Mode**: AI is autonomous. It gathers context, makes decisions, and iterates. Perfect for complex builds.',
            ],
          },
          {
            type: 'text',
            content: 'Toggle Agent Mode at the top of the Composer panel.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Adding Context to Composer',
          },
          {
            type: 'text',
            content: 'Help Composer understand your project by adding context:',
          },
          {
            type: 'list',
            items: [
              '**@filename**: Reference specific files (e.g., "@app.jsx" to include that file in context)',
              '**#filename**: Add entire files to Composer workspace',
              '**/** menu: Add all open editors, Git changes, PR info, etc.',
              '**Cmd+Enter**: Add your entire codebase to context (powerful!)',
            ],
          },
          {
            type: 'image',
            alt: 'Composer interface showing @-mentions and context references for multi-file generation',
            label: 'Composer with context added for generating related files',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example: Create a React Component with Composer',
          },
          {
            type: 'text',
            content: 'Try this prompt in Composer:',
          },
          {
            type: 'code',
            code: 'Create a React card component with image, title, description, and a clickable button. Use Tailwind CSS for styling. Make it responsive. Save as Card.jsx',
            language: 'text',
            label: 'Composer prompt',
          },
          {
            type: 'text',
            content: 'Composer generates the complete component file, ready to use.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'YOLO Mode: Autonomous Iteration',
          },
          {
            type: 'text',
            content: 'Advanced feature: Enable YOLO Mode in settings. It lets Agent Mode:',
          },
          {
            type: 'list',
            items: [
              'Automatically run tests',
              'Build your code',
              'Fix errors and iterate until everything passes',
              'All without asking you each step',
            ],
          },
          {
            type: 'text',
            content: 'Perfect for rapid prototyping where you just want a working feature ASAP.',
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Pro Tip',
            content: 'Composer works best when you give it context about your project structure and dependencies. More context = better results.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Composer Power Unlocked!',
            items: [
              'You can open Composer in floating or full-screen mode',
              'You understand Normal vs Agent mode',
              'You know how to add context with @-mentions and #-files',
              'You\'ve created multi-file code with Composer',
            ],
            message: 'Excellent! You\'re now an AI developer. Next, we\'ll focus on design-to-code—converting designs into working React components.',
          },
        ],
      },
      {
        id: 'lesson-8',
        title: 'Convert Designs to Components',
        duration: 2,
        order: 8,
        module: 'design-to-code',
        sections: [
          {
            type: 'intro',
            content: 'This is where designers shine. Take a design from Figma (or any source), upload it to Cursor, and watch it transform into working React code. No manual translation needed.',
            icon: 'palette',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'The Design-to-Code Workflow',
          },
          {
            type: 'text',
            content: 'The process is simple:',
          },
          {
            type: 'list',
            items: [
              'Export your design as a screenshot (PNG, JPG)',
              'Open Chat in Cursor (Cmd+L)',
              'Upload the image',
              'Describe what you want (or let Cursor analyze it)',
              'Get working React code with Tailwind styling',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Step-by-Step: Figma Design to React',
          },
          {
            type: 'steps',
            steps: [
              {
                number: 1,
                title: 'Screenshot your design',
                content: 'In Figma, select the component/frame you want to convert. Take a clean screenshot without overlays or UI chrome.',
                icon: 'camera',
              },
              {
                number: 2,
                title: 'Open Chat (Cmd+L)',
                content: 'Open the Chat panel on the right side of Cursor.',
                icon: 'chat',
              },
              {
                number: 3,
                title: 'Upload image',
                content: 'Click the attachment icon or drag the screenshot into Chat.',
                icon: 'paperclip',
              },
              {
                number: 4,
                title: 'Describe or ask',
                content: 'Write: "Convert this design to a React component using Tailwind CSS. Make it responsive and match the design exactly."',
                icon: 'edit',
              },
              {
                number: 5,
                title: 'Get code',
                content: 'Cursor generates React code. Copy it or apply it directly to your project.',
                icon: 'code',
              },
            ],
          },
          {
            type: 'image',
            alt: 'Figma design side-by-side with generated React component in Cursor',
            label: 'Design-to-code conversion showing Figma design transformed to React',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Iterative Refinement',
          },
          {
            type: 'text',
            content: 'The first version rarely perfect. Refine it:',
          },
          {
            type: 'list',
            items: [
              'Say "Make the button red instead of blue"',
              'Ask "Can you add an icon to the left of the text?"',
              'Request "Adjust spacing to match the design more closely"',
              'Each time, Cursor updates the code',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Pro Tips for Better Conversions',
          },
          {
            type: 'list',
            items: [
              '**Clear backgrounds**: Screenshot on a clean background for better AI understanding',
              '**High resolution**: Use clear, high-quality images',
              '**One component per screenshot**: Don\'t mix multiple designs in one image',
              '**Describe your stack**: Tell Cursor what framework/version you\'re using',
              '**Provide context**: Reference existing design tokens or style files in your project',
              '**Use Composer for multi-component**: Use Composer (Cmd+I) to generate a whole page with multiple components',
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Designer Superpower',
            content: 'You just converted a design to working code in minutes instead of hours. This is what AI development looks like for designers.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Design-to-Code Ninja!',
            items: [
              'You can convert Figma designs to React components',
              'You understand the iterative refinement process',
              'You know how to provide good context and descriptions',
              'You\'ve experienced the design-to-code workflow',
            ],
            message: 'Amazing! You now bridge design and code. Next, let\'s go deeper into frontend development with React and Tailwind.',
          },
        ],
      },
      {
        id: 'lesson-9',
        title: 'Build Frontend with React and Tailwind',
        duration: 2,
        order: 9,
        module: 'design-to-code',
        sections: [
          {
            type: 'intro',
            content: 'React and Tailwind are your power tools for modern web design. Cursor understands both deeply and can generate production-ready components with responsive design.',
            icon: 'rocket',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'React Fundamentals (For Designers)',
          },
          {
            type: 'text',
            content: 'React is JavaScript for building interactive user interfaces. Think of it like components in a design system:',
          },
          {
            type: 'list',
            items: [
              '**Components**: Reusable pieces (Button, Card, Header, etc.)',
              '**Props**: Data you pass to components (like component parameters)',
              '**State**: Data that changes and triggers UI updates',
              '**Events**: Click, hover, submit—interactive behaviors',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Example: Create a React Component with Cursor',
          },
          {
            type: 'text',
            content: 'Use Chat or Composer to generate:',
          },
          {
            type: 'code',
            code: 'Create a React button component with label prop, onClick handler, and styling with Tailwind CSS. Make it blue by default, with red variant. Include hover effects.',
            language: 'text',
            label: 'Your request to Cursor',
          },
          {
            type: 'text',
            content: 'Cursor generates working code immediately. No need to memorize React syntax.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Tailwind CSS: Utility-First Styling',
          },
          {
            type: 'text',
            content: 'Tailwind is CSS made easy for designers. Instead of writing custom CSS, use class names:',
          },
          {
            type: 'code',
            code: '<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">\n  Click me\n</button>',
            language: 'jsx',
            label: 'Tailwind classes for styling',
          },
          {
            type: 'text',
            content: 'bg-blue-500 = blue background, text-white = white text, px-4 = horizontal padding, hover:bg-blue-600 = darker on hover.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: '"Vibe Coding": Describe, Don\'t Code',
          },
          {
            type: 'text',
            content: 'The beauty of AI development: describe what you want, not how to code it.',
          },
          {
            type: 'list',
            items: [
              'Bad: "Use flexbox with justify-content center"',
              'Good: "Center items horizontally"',
              'Better: "Create a responsive grid of cards that show 3 columns on desktop, 2 on tablet, 1 on mobile"',
            ],
          },
          {
            type: 'text',
            content: 'Cursor translates your intent into Tailwind classes automatically.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Responsive Design (Mobile-First)',
          },
          {
            type: 'text',
            content: 'Build for mobile first, then enhance for bigger screens. Tailwind makes this easy:',
          },
          {
            type: 'code',
            code: '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n  {/* Cards go here */}\n</div>',
            language: 'jsx',
            label: 'Responsive grid: 1 column base, 2 on medium, 3 on large',
          },
          {
            type: 'image',
            alt: 'Example React component with Tailwind styling showing responsive breakpoints',
            label: '.cursorrules file with design system tokens and Tailwind preferences',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Accessibility: Important!',
          },
          {
            type: 'text',
            content: 'Cursor can generate accessible code. Just ask:',
          },
          {
            type: 'list',
            items: [
              '"Make sure this component is accessible (WCAG)"',
              '"Add proper alt text to images"',
              '"Ensure keyboard navigation works"',
              'Cursor adds aria labels, semantic HTML, and proper contrast',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Design System in .cursorrules',
            content: 'Create a .cursorrules file with your design tokens (colors, spacing, fonts). Cursor uses this to generate code that matches your brand automatically.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'React & Tailwind Mastered!',
            items: [
              'You understand React components and props',
              'You know Tailwind utility classes for styling',
              'You can generate responsive, accessible components',
              'You\'re comfortable with "vibe coding"',
            ],
            message: 'Great! You can now build responsive, production-ready frontends with AI. Next, let\'s customize Cursor for your specific needs.',
          },
        ],
      },
      {
        id: 'lesson-10',
        title: 'Customize Your Workspace',
        duration: 2,
        order: 10,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'Cursor is yours to customize. Set it up exactly how you work. Personalization makes you faster and happier.',
            icon: 'settings',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Editor Settings',
          },
          {
            type: 'text',
            content: 'Customize the look and feel:',
          },
          {
            type: 'list',
            items: [
              '**Theme**: Dark, light, or custom (Settings → Theme)',
              '**Font**: Change font family and size',
              '**Keybindings**: Remap keys to match your muscle memory',
              '**Tabs vs Spaces**: Choose your indentation style',
              '**Auto-save**: Enable/disable automatic saving',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Extensions: Power Up Your Editor',
          },
          {
            type: 'text',
            content: 'Extensions add capabilities. Click the Extensions icon (puzzle) in the left sidebar:',
          },
          {
            type: 'list',
            items: [
              '**Prettier**: Auto-format code to be clean and consistent',
              '**ESLint**: Catch code errors and style issues',
              '**Tailwind CSS IntelliSense**: Smart Tailwind class suggestions',
              '**Thunder Client**: Test APIs without leaving Cursor',
              '**Live Server**: Preview changes in browser in real-time',
              '**GitHub Copilot** (optional): Add GitHub\'s Copilot alongside Cursor\'s AI',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: '.cursorrules: Train Your AI',
          },
          {
            type: 'text',
            content: 'Create a .cursorrules file in your project root with instructions for the AI:',
          },
          {
            type: 'code',
            code: '# Design System\nUse Tailwind CSS for all styling. Primary color: blue-600. Secondary: gray-900.\n\n# Components\nAll components go in /components directory. Use PascalCase for names.\n\n# Testing\nWrite tests for all components using Vitest.\n\n# Best Practices\n- Use functional components with hooks\n- Keep components under 200 lines\n- Add proper error handling\n- Make components responsive\n- Include accessibility (WCAG AA)',
            language: 'text',
            label: '.cursorrules example',
          },
          {
            type: 'text',
            content: 'Cursor reads this file and uses it to guide code generation. Whenever it generates code, it follows your rules.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Rules for AI: Chat Settings',
          },
          {
            type: 'text',
            content: 'Go to Settings → Features → Chat & Composer → Rules for AI. Add custom instructions:',
          },
          {
            type: 'list',
            items: [
              '"Always add comments to complex code"',
              '"Prefer modern React hooks over class components"',
              '"Include TypeScript types"',
              '"Make accessibility a priority"',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Terminal Integration',
          },
          {
            type: 'text',
            content: 'The terminal at the bottom of Cursor is powerful:',
          },
          {
            type: 'list',
            items: [
              'Use Cmd+K to generate shell commands',
              'Run npm scripts, git commands, builds',
              'See output in real-time',
              'Stay in Cursor, no need to switch apps',
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'Pro Tip',
            content: 'Import settings from VS Code if you have them. Cursor will preserve your themes, extensions, and keybindings.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Workspace Customized!',
            items: [
              'You\'ve customized the editor to match your style',
              'You\'ve installed key extensions',
              'You\'ve created a .cursorrules file for your project',
              'You understand Rules for AI in settings',
            ],
            message: 'Perfect! Cursor is now set up exactly how you work. Next, let\'s explore advanced AI features.',
          },
        ],
      },
      {
        id: 'lesson-11',
        title: 'Master Advanced Features',
        duration: 2,
        order: 11,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'You\'ve learned the basics. Now, advanced features that take you to expert level: codebase indexing, multi-model AI, context management, and team collaboration.',
            icon: 'crown',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Codebase Indexing: AI Knows Your Code',
          },
          {
            type: 'text',
            content: 'When you open a project, Cursor automatically indexes it. The AI scans every file and creates a semantic understanding of your codebase. This is why it can suggest relevant code from anywhere in your project.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: '@-Mentions: Direct Context',
          },
          {
            type: 'text',
            content: 'In Chat or Composer, use @-mentions to reference specific files or symbols:',
          },
          {
            type: 'list',
            items: [
              '**@filename.jsx**: Reference a specific file',
              '**@functionName**: Reference a specific function',
              '**@className**: Reference a class',
              'Type @ and see all available options',
            ],
          },
          {
            type: 'image',
            alt: '@-mentions context menu showing available files and symbols in codebase',
            label: '@-mentions in Chat showing codebase references',
          },
          {
            type: 'text',
            content: 'This tells the AI exactly what to consider when generating code.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Multi-Model AI: Choose Your Brain',
          },
          {
            type: 'text',
            content: 'Cursor supports multiple AI models. Switch between them in the Chat panel:',
          },
          {
            type: 'list',
            items: [
              '**Claude 3.5 Sonnet** (Anthropic): Best for analysis and refactoring',
              '**GPT-4o** (OpenAI): Great for creative code generation',
              '**Gemini** (Google): Good for general tasks',
              '**xAI models**: Latest experimental models',
            ],
          },
          {
            type: 'text',
            content: 'Different models excel at different tasks. Feel free to try different ones for different work.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Privacy Mode: Your Code Stays Private',
          },
          {
            type: 'text',
            content: 'Pro feature ($20/month): Enable Privacy Mode in Settings. Your code is never:',
          },
          {
            type: 'list',
            items: [
              'Sent to AI providers for training',
              'Logged or stored on servers',
              'Used to improve AI models',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Context Management: Work Smarter',
          },
          {
            type: 'text',
            content: 'AI works better with relevant context. Strategies:',
          },
          {
            type: 'list',
            items: [
              '**Close tabs**: Only open files you\'re actively using',
              '**Use @-mentions**: Reference specific files instead of context-dumping',
              '**Provide .cursorrules**: Let your project guidelines guide the AI',
              '**Use Cmd+Enter for full context**: When you truly need codebase-wide understanding',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Bugbot: AI Code Review',
          },
          {
            type: 'text',
            content: 'Advanced feature: Bugbot automatically reviews your GitHub PRs and suggests improvements:',
          },
          {
            type: 'list',
            items: [
              'Detects bugs and logic errors',
              'Suggests security fixes',
              'Recommends performance improvements',
              '​One-click "Fix in Cursor" to apply suggestions',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Team Features (Cursor Teams/Enterprise)',
          },
          {
            type: 'text',
            content: 'For teams ($40/user/month):',
          },
          {
            type: 'list',
            items: [
              'Shared .cursorrules across team',
              'Centralized billing and usage tracking',
              'SSO authentication',
              'Team-wide privacy settings',
              'Collaboration features',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            title: 'Pro Tip',
            content: 'Always review AI-generated code before using it. AI is fast, but human judgment catches edge cases and security issues.',
            icon: 'info',
          },
          {
            type: 'completion',
            title: 'Advanced Features Unlocked!',
            items: [
              'You understand codebase indexing and how AI knows your code',
              'You can use @-mentions for precise context',
              'You know how to switch between multiple AI models',
              'You\'re aware of privacy features and team collaboration',
            ],
            message: 'Excellent! You\'re now using Cursor like an expert. The final lesson covers best practices and team workflows.',
          },
        ],
      },
      {
        id: 'lesson-12',
        title: 'Best Practices and Team Workflows',
        duration: 2,
        order: 12,
        module: 'practices',
        sections: [
          {
            type: 'intro',
            content: 'You\'ve learned the tools. Now, the philosophy: how to work WITH AI, not just use it. This is about sustainable, high-quality development.',
            icon: 'lightbulb',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Write Effective Prompts',
          },
          {
            type: 'text',
            content: 'Good prompts = better code. Structure:',
          },
          {
            type: 'list',
            items: [
              '**What**: What do you want? Be specific.',
              '**Context**: What technology/framework? Any constraints?',
              '**Details**: Colors, layout, behavior—the specifics matter.',
              '**Format**: Where should the code go? (component file, inline, etc.)',
            ],
          },
          {
            type: 'heading',
            level: 'h4',
            content: 'Example of a Great Prompt',
          },
          {
            type: 'code',
            code: 'Create a React modal component that:\n- Shows a title and description\n- Has a Close button and a primary action button\n- Uses Tailwind CSS with blue primary button\n- Includes fade-in animation (use framer-motion if available)\n- Is accessible (keyboard support, aria-labels)\n- Saves as Modal.jsx in /components directory',
            language: 'text',
            label: 'Specific, detailed prompt',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Review AI Code Always',
          },
          {
            type: 'text',
            content: 'Never blindly accept AI-generated code:',
          },
          {
            type: 'list',
            items: [
              'Read the code. Understand what it does.',
              'Test it. Does it work as expected?',
              'Check for security: no hardcoded secrets, no SQL injection risks',
              'Performance: Is it efficient? Will it scale?',
              'Accessibility: Can keyboard users navigate? Do images have alt text?',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Test-Driven Development (TDD)',
          },
          {
            type: 'text',
            content: 'Write tests first, let AI implement:',
          },
          {
            type: 'list',
            items: [
              'Write test cases (what your code should do)',
              'Ask Cursor: "Write code that passes these tests"',
              'AI generates implementation',
              'Tests pass? You\'re done. Tests fail? Iterate.',
            ],
          },
          {
            type: 'text',
            content: 'This forces clarity and prevents AI mistakes.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Version Control: Git for Safety',
          },
          {
            type: 'text',
            content: 'Use Git to track changes:',
          },
          {
            type: 'list',
            items: [
              'Commit after each feature, not continuous',
              'Write clear commit messages ("Add Modal component" not "stuff")',
              'Push to GitHub regularly (backup and team visibility)',
              'Use branches for new features (don\'t work on main)',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Treat AI as a Pair Programmer',
          },
          {
            type: 'text',
            content: 'Best workflow: iterative dialogue',
          },
          {
            type: 'list',
            items: [
              'You: "Create a form with name and email fields"',
              'AI: Generates form',
              'You: "Add validation for email format"',
              'AI: Updates code',
              'You: "Make it mobile-responsive"',
              'AI: Refines the code',
            ],
          },
          {
            type: 'text',
            content: 'You\'re the driver. AI is the assistant. Never let AI make decisions without your direction.',
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Team Workflows',
          },
          {
            type: 'text',
            content: 'For teams using Cursor:',
          },
          {
            type: 'list',
            items: [
              'Share .cursorrules file (design system, code standards)',
              'PR reviews: Have humans and Bugbot review PRs',
              'Code pairing: Use Cursor together for better decisions',
              'Documentation: Let AI generate docs, humans refine them',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'When NOT to Use AI',
          },
          {
            type: 'text',
            content: 'AI isn\'t always the right tool:',
          },
          {
            type: 'list',
            items: [
              'Complex algorithms: AI struggles with novel logic. Think first.',
              'Security-critical code: Always hand-review before deployment',
              'Novel patterns: If you\'re pioneering something, guide AI more carefully',
              'Learning: Sometimes, you should code manually to learn',
            ],
          },
          {
            type: 'heading',
            level: 'h3',
            content: 'Continuous Learning',
          },
          {
            type: 'text',
            content: 'Stay updated:',
          },
          {
            type: 'list',
            items: [
              'Check Cursor changelog (cursor.com/changelog)',
              'Try new features when released',
              'Experiment with different models and prompts',
              'Share learnings with your team',
            ],
          },
          {
            type: 'callout',
            calloutType: 'success',
            title: 'You\'re Ready!',
            content: 'You\'ve mastered Cursor. You understand the tools, the workflows, and the mindset. Now go build something amazing.',
            icon: 'success',
          },
          {
            type: 'completion',
            title: 'Cursor Mastery Complete!',
            items: [
              'You write effective, specific prompts',
              'You review and test all AI-generated code',
              'You use TDD and Git for quality and safety',
              'You treat AI as a partner, not a replacement',
              'You understand team workflows and best practices',
            ],
            message: 'Congratulations! You\'ve completed the Cursor Learning Path. You\'re now equipped to be a productive, responsible AI developer. Keep experimenting, stay curious, and build amazing things.',
          },
        ],
      },
    ],
    content: `
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Cursor Learning Path for Designers</h2>
      <p class="text-lg text-gray-700 mb-8">Cursor is the AI-powered code editor that lets you prototype, code, and collaborate with AI as your pair programmer. <strong>Complete this guide in 24 minutes and go from zero to confident building with AI.</strong></p>

      <h3 class="text-3xl font-bold text-gray-900 mt-12 mb-3">What You'll Learn</h3>
      <p class="text-lg text-gray-700 mb-8">This learning path is structured in 4 sequential modules that build on each other. Complete all lessons in order for the best learning experience.</p>

      <!-- Enhanced Module Flow with Visual Hierarchy - Black & White Design -->
      <div class="mb-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Module 1: Setup -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">1</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Setup</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Download, install, and explore Cursor</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Foundation</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 2: Prototype -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">2</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">AI Features</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Master Tab, Chat, Cmd+K, and Composer</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Build</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 3: Design-to-Code -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">3</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Design-to-Code</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Convert designs to React with Tailwind</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Create</div>
              </div>
            </div>
            <div class="hidden lg:flex absolute -right-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.5rem; height: 1.5rem;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Module 4: Advanced -->
          <div class="group relative">
            <div class="flex flex-col h-full p-6 bg-white border-2 border-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold text-lg mb-6 mx-auto">4</div>
              <h4 class="text-lg font-bold text-gray-900 mb-3 text-center">Advanced</h4>
              <p class="text-sm text-gray-700 flex-grow text-center">Master customization and best practices</p>
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-xs font-semibold uppercase tracking-wide text-gray-900 border border-gray-900 px-3 py-1 rounded text-center block">Master</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Info - Black & White -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-900">
          <div class="flex items-center justify-center flex-wrap gap-12">
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Modules</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Lessons</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-600">Duration</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">24 min</p>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-6">What's in Each Module?</h3>
      <div class="overflow-x-auto mb-12">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b-2 border-gray-900">
              <th class="text-left py-3 px-4 font-bold text-gray-900">Module</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Description</th>
              <th class="text-left py-3 px-4 font-bold text-gray-900">Key Topics</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">1. Setup</td>
              <td class="py-4 px-4 text-gray-700 align-top">Get Cursor installed and explore the interface</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Download and install Cursor for your OS</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Navigate the VS Code-based interface</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Learn basic code editing and Git</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">2. AI Features</td>
              <td class="py-4 px-4 text-gray-700 align-top">Master Cursor's four core AI tools</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Tab completions for instant code suggestions</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Chat (Cmd+L) for conversational help</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Cmd+K for inline editing and Composer for multi-file generation</span></li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">3. Design-to-Code</td>
              <td class="py-4 px-4 text-gray-700 align-top">Convert designs to working code</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Transform Figma designs to React components</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Build responsive frontends with React and Tailwind</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Rapid prototyping and design iteration</span></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="py-4 px-4 text-gray-900 font-semibold align-top">4. Advanced</td>
              <td class="py-4 px-4 text-gray-700 align-top">Leverage advanced Cursor capabilities</td>
              <td class="py-4 px-4 text-gray-700 align-top">
                <ul class="space-y-1">
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Customize with extensions and .cursorrules</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Codebase indexing and @-mentions for smart context</span></li>
                  <li class="flex items-start gap-2"><span class="text-gray-400 flex-shrink-0">•</span> <span>Best practices for sustainable AI development</span></li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 mt-12 mb-4">Getting Started</h3>
      <p class="text-gray-700 mb-4">Choose the path that fits your needs:</p>
      <ul class="space-y-3 mb-8">
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">New to Cursor?</strong> Start from the beginning and follow sequentially. You'll be building with AI in less than 30 minutes.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Already have Cursor installed?</strong> Jump to Module 2 (AI Features) and start using Tab, Chat, and Composer right away.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Want to design-to-code?</strong> Skip to Module 3 (Design-to-Code) to convert Figma designs to React components immediately.</li>
        <li class="p-4 bg-gray-50 rounded-lg text-gray-700"><strong class="text-gray-900">Build at your own pace</strong> — Each lesson takes 2 minutes. Pause between modules to practice and experiment.</li>
      </ul>

      <div class="p-6 bg-gray-900 text-white rounded-lg">
        <h3 class="text-xl font-bold mb-2">Ready to Get Started?</h3>
        <p>Jump in and begin your Cursor journey! Download Cursor, open the first lesson, and start building with AI.</p>
      </div>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'copilot-course',
    slug: 'github-copilot-learning-path',
    title: 'GitHub Copilot Guide for Designers',
    description: 'Learn GitHub Copilot, the AI pair programmer for developers.',
    excerpt: 'Your complete GitHub Copilot guide: 10 lessons covering installation, code suggestions, chat features, and enterprise workflows.',
    tool: 'GitHub Copilot',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 18,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/Microsoft_365_Copilot_Icon_one-color.svg',
    tags: ['copilot', 'learning-path', 'github', 'course', 'ai-programming'],
    lessons: [
      { id: 'lesson-1', title: 'Install GitHub Copilot', duration: 2, order: 1, content: '<h2>Install GitHub Copilot</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Your First Code Suggestion', duration: 2, order: 2, content: '<h2>Your First Code Suggestion</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Code Comments to Code', duration: 2, order: 3,
        module: 'setup', content: '<h2>Code Comments to Code</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'GitHub Copilot Chat', duration: 2, order: 4,
        module: 'prototype', content: '<h2>GitHub Copilot Chat</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Testing with Copilot', duration: 2, order: 5,
        module: 'prototype', content: '<h2>Testing with Copilot</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Documentation Generation', duration: 2, order: 6,
        module: 'prototype', content: '<h2>Documentation Generation</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Enterprise Copilot', duration: 2, order: 7,
        module: 'prototype', content: '<h2>Enterprise Copilot</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Tips and Tricks', duration: 2, order: 8,
        module: 'prototype', content: '<h2>Tips and Tricks</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'Ethical AI Development', duration: 1, order: 9, content: '<h2>Ethical AI Development</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Next Steps and Resources', duration: 1, order: 10, content: '<h2>Next Steps and Resources</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>GitHub Copilot Learning Path</h2><p>Become proficient with GitHub Copilot, your AI pair programmer. Master code suggestions and AI-assisted development.</p>',
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'replit-course',
    slug: 'replit-ai-learning-path',
    title: 'Replit AI Guide for Designers',
    description: 'Master Replit AI for collaborative coding with AI assistance.',
    excerpt: 'Your complete Replit AI guide: 8 lessons covering platform basics, AI features, collaboration, and deployment.',
    tool: 'Replit AI',
    useCase: 'Learning Path',
    skillLevel: 'Intermediate',
    designDomain: 'UX Design',
    readTime: 15,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/New_Replit_Logo.svg',
    tags: ['replit', 'learning-path', 'cloud-coding', 'course', 'collaboration'],
    lessons: [
      { id: 'lesson-1', title: 'Getting Started with Replit', duration: 2, order: 1, content: '<h2>Getting Started with Replit</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Create Your First Repl', duration: 2, order: 2, content: '<h2>Create Your First Repl</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Replit AI Features', duration: 2, order: 3,
        module: 'setup', content: '<h2>Replit AI Features</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'Real-Time Collaboration', duration: 2, order: 4,
        module: 'prototype', content: '<h2>Real-Time Collaboration</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Database Integration', duration: 2, order: 5,
        module: 'prototype', content: '<h2>Database Integration</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Deploying Your Project', duration: 2, order: 6,
        module: 'prototype', content: '<h2>Deploying Your Project</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Advanced Workflows', duration: 1, order: 7,
        module: 'prototype', content: '<h2>Advanced Workflows</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Best Practices and Tips', duration: 0, order: 8,
        module: 'prototype', content: '<h2>Best Practices and Tips</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>Replit AI Learning Path</h2><p>Discover the power of Replit AI for collaborative cloud-based development. Master team coding and deployment.</p>',
    relatedPatterns: ['Contextual Assistance', 'Collaborative AI'],
  },
  {
    id: 'v0-course',
    slug: 'v0-by-vercel-learning-path',
    title: 'V0 by Vercel Guide for Designers',
    description: 'Learn V0 by Vercel, the AI tool for generating React components.',
    excerpt: 'Your complete V0 guide: 10 lessons covering component generation, design-to-code, and production workflows.',
    tool: 'V0 by Vercel',
    useCase: 'Learning Path',
    skillLevel: 'Intermediate',
    designDomain: 'UX Design',
    readTime: 16,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: 'https://lobehub.com/icons/v0',
    tags: ['v0', 'learning-path', 'design-to-code', 'course', 'react-components'],
    lessons: [
      { id: 'lesson-1', title: 'Introduction to V0', duration: 2, order: 1, content: '<h2>Introduction to V0</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Generate Your First Component', duration: 2, order: 2, content: '<h2>Generate Your First Component</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Design-to-Code Workflow', duration: 2, order: 3,
        module: 'setup', content: '<h2>Design-to-Code Workflow</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'Editing Generated Components', duration: 2, order: 4,
        module: 'prototype', content: '<h2>Editing Generated Components</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Styling and Customization', duration: 2, order: 5,
        module: 'prototype', content: '<h2>Styling and Customization</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Building Complex UIs', duration: 2, order: 6,
        module: 'prototype', content: '<h2>Building Complex UIs</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Integration with Next.js', duration: 2, order: 7,
        module: 'prototype', content: '<h2>Integration with Next.js</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Deployment to Production', duration: 1, order: 8,
        module: 'prototype', content: '<h2>Deployment to Production</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'Performance Optimization', duration: 1, order: 9, content: '<h2>Performance Optimization</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Advanced Techniques', duration: 0, order: 10, content: '<h2>Advanced Techniques</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>V0 by Vercel Learning Path</h2><p>Master V0 for AI-generated React components. Transform designs into production-ready code with ease.</p>',
    relatedPatterns: ['Augmented Creation', 'Contextual Assistance'],
  },
  {
    id: 'github-course',
    slug: 'github-learning-path',
    title: 'GitHub Guide for Designers',
    description: 'Master GitHub for version control and collaboration.',
    excerpt: 'Your complete GitHub guide: 12 lessons covering repositories, version control, collaboration, branching, and design workflows.',
    tool: 'GitHub',
    useCase: 'Learning Path',
    skillLevel: 'Beginner',
    designDomain: 'UX Design',
    readTime: 20,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: 'https://commons.wikimedia.org/wiki/Special:FilePath/GitHub_Invertocat_Logo.svg',
    tags: ['github', 'learning-path', 'version-control', 'course', 'collaboration'],
    lessons: [
      { id: 'lesson-1', title: 'GitHub Basics and Setup', duration: 2, order: 1, content: '<h2>GitHub Basics and Setup</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Create Your First Repository', duration: 2, order: 2, content: '<h2>Create Your First Repository</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Understanding Git Basics', duration: 2, order: 3,
        module: 'setup', content: '<h2>Understanding Git Basics</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'Commits, Pulls, and Pushes', duration: 2, order: 4,
        module: 'prototype', content: '<h2>Commits, Pulls, and Pushes</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Branching Strategies', duration: 2, order: 5,
        module: 'prototype', content: '<h2>Branching Strategies</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Pull Requests and Code Review', duration: 2, order: 6,
        module: 'prototype', content: '<h2>Pull Requests and Code Review</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Merging and Conflict Resolution', duration: 2, order: 7,
        module: 'prototype', content: '<h2>Merging and Conflict Resolution</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Collaboration Best Practices', duration: 2, order: 8,
        module: 'prototype', content: '<h2>Collaboration Best Practices</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'GitHub Pages and Documentation', duration: 2, order: 9, content: '<h2>GitHub Pages and Documentation</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Project Management Tools', duration: 1, order: 10, content: '<h2>Project Management Tools</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-11', title: 'Automation and CI/CD Basics', duration: 1, order: 11, content: '<h2>Automation and CI/CD Basics</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-12', title: 'GitHub Workflows for Design Teams', duration: 1, order: 12, content: '<h2>GitHub Workflows for Design Teams</h2><p>Lesson content coming soon...</p>' },
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
