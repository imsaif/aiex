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

  it('renders one row per skill with name, trigger, and Used-by', () => {
    renderDirectory();
    expect(screen.getByText('aiux-human-in-the-loop')).toBeInTheDocument();
    expect(screen.getByText('Use when a UI shows too much at once.')).toBeInTheDocument();
    expect(screen.getByText('Obscure Tool')).toBeInTheDocument();
  });

  it('filters rows by category chip', () => {
    renderDirectory();
    fireEvent.click(screen.getByRole('button', { name: 'User Experience' }));
    expect(screen.queryByText('aiux-human-in-the-loop')).not.toBeInTheDocument();
    expect(screen.getByText('aiux-progressive-disclosure')).toBeInTheDocument();
  });

  it('marks the active category chip with aria-pressed and a bold cue', () => {
    renderDirectory();
    const allChip = screen.getByRole('button', { name: 'All' });
    const userExperienceChip = screen.getByRole('button', { name: 'User Experience' });
    expect(allChip).toHaveAttribute('aria-pressed', 'true');
    expect(userExperienceChip).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(userExperienceChip);
    expect(allChip).toHaveAttribute('aria-pressed', 'false');
    expect(userExperienceChip).toHaveAttribute('aria-pressed', 'true');
    expect(userExperienceChip.className).toContain('font-semibold');
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
