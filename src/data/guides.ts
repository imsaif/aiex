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
      { id: 'lesson-1', title: 'Install and Setup Cursor', duration: 2, order: 1, content: '<h2>Install and Setup Cursor</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-2', title: 'Navigate the Interface', duration: 2, order: 2, content: '<h2>Navigate the Interface</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-3', title: 'Basic Code Editing', duration: 2, order: 3,
        module: 'setup', content: '<h2>Basic Code Editing</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-4', title: 'AI Code Completions', duration: 2, order: 4,
        module: 'prototype', content: '<h2>AI Code Completions</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-5', title: 'Cursor AI Chat', duration: 2, order: 5,
        module: 'prototype', content: '<h2>Cursor AI Chat</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-6', title: 'Code Refactoring with AI', duration: 2, order: 6,
        module: 'prototype', content: '<h2>Code Refactoring with AI</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-7', title: 'Debugging Tools', duration: 2, order: 7,
        module: 'prototype', content: '<h2>Debugging Tools</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-8', title: 'Extensions and Customization', duration: 2, order: 8,
        module: 'prototype', content: '<h2>Extensions and Customization</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-9', title: 'Working with Design Files', duration: 2, order: 9, content: '<h2>Working with Design Files</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-10', title: 'Team Collaboration', duration: 2, order: 10, content: '<h2>Team Collaboration</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-11', title: 'Advanced AI Features', duration: 2, order: 11, content: '<h2>Advanced AI Features</h2><p>Lesson content coming soon...</p>' },
      { id: 'lesson-12', title: 'Best Practices and Tips', duration: 0, order: 12, content: '<h2>Best Practices and Tips</h2><p>Lesson content coming soon...</p>' },
    ],
    content: '<h2>Cursor Learning Path</h2><p>Master the most powerful AI-assisted code editor built on VSCode. Learn from setup to advanced workflows.</p>',
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
