import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// --- Mocks ---

// Mock recharts to avoid canvas/ResizeObserver issues in jsdom
vi.mock('recharts', () => ({
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => (
    <div style={{ width: 100, height: 100 }}>{children}</div>
  ),
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  CartesianGrid: () => null,
}));

// Mock Google Maps loader to prevent network calls in tests
vi.mock('@googlemaps/js-api-loader', () => {
  class MockLoader {
    constructor() {}
    load() { return Promise.resolve({}); }
  }
  return { Loader: MockLoader };
});

afterEach(cleanup);

// --- Test Suites ---

describe('Synchra App – Rendering', () => {
  it('renders the SYNCHRA brand in the sidebar', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /synchra/i })).toBeInTheDocument();
  });

  it('renders all three navigation tab buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /live flow/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zone insights/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /predictive alerts/i })).toBeInTheDocument();
  });

  it('shows the Live Flow panel by default', () => {
    render(<App />);
    expect(screen.getByText('Venue Telemetry')).toBeInTheDocument();
    expect(screen.getByText('Throughput')).toBeInTheDocument();
  });

  it('shows initial Synchra welcome message in console', () => {
    render(<App />);
    expect(screen.getByText(/Synchra core online/i)).toBeInTheDocument();
  });

  it('renders status indicators in the topbar', () => {
    render(<App />);
    expect(screen.getByText(/Safety: Nominal/i)).toBeInTheDocument();
    expect(screen.getByText(/Efficiency: 94%/i)).toBeInTheDocument();
  });
});

describe('Synchra App – Tab Navigation', () => {
  it('switches to Zone Insights panel on tab click', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /zone insights/i }));
    expect(screen.getByText('Zone Density Analysis')).toBeInTheDocument();
  });

  it('switches to Predictive Alerts panel on tab click', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /predictive alerts/i }));
    expect(screen.getByText('Active Predictive Alerts')).toBeInTheDocument();
  });

  it('switches back to Live Flow from alerts', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /predictive alerts/i }));
    await userEvent.click(screen.getByRole('button', { name: /live flow/i }));
    expect(screen.getByText('Venue Telemetry')).toBeInTheDocument();
  });

  it('sets aria-current="page" on the active tab', async () => {
    render(<App />);
    const liveBtn = screen.getByRole('button', { name: /live flow/i });
    expect(liveBtn).toHaveAttribute('aria-current', 'page');

    await userEvent.click(screen.getByRole('button', { name: /zone insights/i }));
    expect(screen.getByRole('button', { name: /zone insights/i })).toHaveAttribute('aria-current', 'page');
    expect(liveBtn).not.toHaveAttribute('aria-current');
  });
});

describe('Synchra App – Agent Console', () => {
  it('renders the console input field', () => {
    render(<App />);
    expect(screen.getByLabelText(/Type a command or question for Synchra/i)).toBeInTheDocument();
  });

  it('renders all quick action chips', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Quick action: Status of Gate A/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Quick action: Show Congestion/i })).toBeInTheDocument();
  });

  it('quick action chip populates the input field', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Quick action: Status of Gate A/i }));
    expect(screen.getByLabelText(/Type a command or question for Synchra/i)).toHaveValue('Status of Gate A');
  });

  it('sends a user message on form submit', async () => {
    render(<App />);
    const input = screen.getByLabelText(/Type a command or question/i);
    await userEvent.type(input, 'What is the current status?');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('What is the current status?')).toBeInTheDocument();
  });

  it('shows typing indicator after submitting a message', async () => {
    render(<App />);
    const input = screen.getByLabelText(/Type a command or question/i);
    await userEvent.type(input, 'status');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('status', { name: /Synchra is composing/i })).toBeInTheDocument();
  });

  it('clears the input field after sending', async () => {
    render(<App />);
    const input = screen.getByLabelText(/Type a command or question/i);
    await userEvent.type(input, 'test message');
    await userEvent.keyboard('{Enter}');
    expect(input).toHaveValue('');
  });

  it('disables input while Synchra is typing', async () => {
    render(<App />);
    const input = screen.getByLabelText(/Type a command or question/i);
    await userEvent.type(input, 'congestion');
    await userEvent.keyboard('{Enter}');
    expect(input).toBeDisabled();
  });

  it('displays Synchra response after typing delay', async () => {
    render(<App />);
    const input = screen.getByLabelText(/Type a command or question/i);
    await userEvent.type(input, 'status');
    await userEvent.keyboard('{Enter}');
    // Wait up to 4 seconds for the async response
    await waitFor(
      () => expect(screen.getByText(/Current Flow: Smooth/i)).toBeInTheDocument(),
      { timeout: 4000 }
    );
  });
});

describe('Synchra App – Accessibility', () => {
  it('has a landmark navigation element', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /Dashboard sections/i })).toBeInTheDocument();
  });

  it('has a main content landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('console log has aria-live="polite"', () => {
    render(<App />);
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
  });

  it('send button has accessible label', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /send message to synchra/i })).toBeInTheDocument();
  });
});
