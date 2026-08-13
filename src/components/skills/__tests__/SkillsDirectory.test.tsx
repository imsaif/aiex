import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SkillsDirectory, type SkillRow } from '../SkillsDirectory';

const toggle = jest.fn();
const isSaved = jest.fn().mockReturnValue(false);

jest.mock('@/hooks/useHandoffKit', () => ({
  useHandoffKit: () => ({
    isSaved,
    toggle,
    isLoading: false,
  }),
}));

const rows: SkillRow[] = [
  {
    slug: 'human-in-the-loop',
    skillName: 'aiux-human-in-the-loop',
    title: 'Human-in-the-Loop',
    category: 'Human-AI Collaboration',
    trigger: 'Use when AI output needs human review.',
    products: [{ name: 'Grammarly', logo: '/images/logos/simple-icons/grammarly.svg' }],
  },
  {
    slug: 'progressive-disclosure',
    skillName: 'aiux-progressive-disclosure',
    title: 'Progressive Disclosure',
    category: 'User Experience',
    trigger: 'Use when a UI shows too much at once.',
    products: [{ name: 'Obscure Tool' }],
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
    toggle.mockClear();
    isSaved.mockClear();
    isSaved.mockReturnValue(false);
  });

  it('saves a skill via the bookmark button without navigating', () => {
    renderDirectory();
    const saveButton = screen.getAllByRole('button', { name: 'Save to dashboard' })[0];
    fireEvent.click(saveButton);
    expect(toggle).toHaveBeenCalledWith(rows[0].slug);
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

  it('does not render a copy install action on cards', () => {
    renderDirectory();
    expect(screen.queryByRole('button', { name: /copy install/i })).not.toBeInTheDocument();
  });
});
