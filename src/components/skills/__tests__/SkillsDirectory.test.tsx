import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SkillsDirectory, type SkillRow } from '../SkillsDirectory';

const rows: SkillRow[] = [
  {
    slug: 'human-in-the-loop',
    skillName: 'aiux-human-in-the-loop',
    title: 'Human-in-the-Loop',
    category: 'Human-AI Collaboration',
    trigger: 'Use when AI output needs human review.',
    products: [{ name: 'Grammarly', logo: '/images/logos/simple-icons/grammarly.svg' }],
    command: 'mkdir -p .claude/skills/aiux-human-in-the-loop && curl ...',
  },
  {
    slug: 'progressive-disclosure',
    skillName: 'aiux-progressive-disclosure',
    title: 'Progressive Disclosure',
    category: 'User Experience',
    trigger: 'Use when a UI shows too much at once.',
    products: [{ name: 'Obscure Tool' }],
    command: 'mkdir -p .claude/skills/aiux-progressive-disclosure && curl ...',
  },
];

function renderDirectory() {
  return render(
    <SkillsDirectory rows={rows} categories={['Human-AI Collaboration', 'User Experience']} />
  );
}

describe('SkillsDirectory', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    window.clarity = jest.fn();
  });

  it('renders one card per skill with name, trigger, and Used-by', () => {
    renderDirectory();
    expect(screen.getByText('aiux-human-in-the-loop')).toBeInTheDocument();
    expect(screen.getByText('Use when a UI shows too much at once.')).toBeInTheDocument();
    expect(screen.getByText('Obscure Tool')).toBeInTheDocument();
  });

  it('filters cards by sidebar category button', () => {
    renderDirectory();
    fireEvent.click(screen.getByRole('button', { name: 'User Experience' }));
    expect(screen.queryByText('aiux-human-in-the-loop')).not.toBeInTheDocument();
    expect(screen.getByText('aiux-progressive-disclosure')).toBeInTheDocument();
  });

  it('marks the active category button with aria-pressed and a bold cue', () => {
    renderDirectory();
    const allButton = screen.getByRole('button', { name: 'All Skills' });
    const userExperienceButton = screen.getByRole('button', { name: 'User Experience' });
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(userExperienceButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(userExperienceButton);
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
    expect(userExperienceButton).toHaveAttribute('aria-pressed', 'true');
    expect(userExperienceButton.className).toContain('font-semibold');
  });

  it('filters cards by search query across skill name, title, and trigger', () => {
    renderDirectory();
    const searchInput = screen.getByPlaceholderText('Search any skill you need');
    fireEvent.change(searchInput, { target: { value: 'progressive' } });
    expect(screen.queryByText('aiux-human-in-the-loop')).not.toBeInTheDocument();
    expect(screen.getByText('aiux-progressive-disclosure')).toBeInTheDocument();
  });

  it('copies the install command and fires the clarity event', async () => {
    renderDirectory();
    const button = screen.getAllByRole('button', { name: /copy install/i })[0];
    fireEvent.click(button);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(rows[0].command);
    await waitFor(() => expect(button).toHaveTextContent('Copied'));
    expect(window.clarity).toHaveBeenCalledWith('event', 'skill-copy');
  });

  it('reveals the command and an explanatory message for manual copy when clipboard write fails', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('denied'));
    renderDirectory();
    fireEvent.click(screen.getAllByRole('button', { name: /copy install/i })[0]);
    expect(await screen.findByText(rows[0].command)).toBeInTheDocument();
    expect(
      screen.getByText('Copy failed. Select the command below manually.')
    ).toBeInTheDocument();
  });
});
