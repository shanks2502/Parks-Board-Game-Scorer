import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, Check, Compass, MapPin, Plus, TreePine, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Player = {
  id: number;
  name: string;
};

const starterNames = ['Alex', 'Morgan', 'Riley', 'Jordan', 'Casey'];

function Home() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: starterNames[0] },
    { id: 2, name: starterNames[1] },
    { id: 3, name: starterNames[2] },
  ]);
  const [isReady, setIsReady] = useState(false);

  const updatePlayer = (id: number, name: string) => {
    setPlayers((current) =>
      current.map((player) => (player.id === id ? { ...player, name } : player)),
    );
    setIsReady(false);
  };

  const removePlayer = (id: number) => {
    if (players.length <= 2) return;
    setPlayers((current) => current.filter((player) => player.id !== id));
    setIsReady(false);
  };

  const addPlayer = () => {
    if (players.length >= 5) return;
    const nextId = Math.max(...players.map((player) => player.id), 0) + 1;
    const usedNames = new Set(players.map((player) => player.name));
    const nextName =
      starterNames.find((name) => !usedNames.has(name)) ?? `Player ${nextId}`;
    setPlayers((current) => [...current, { id: nextId, name: nextName }]);
    setIsReady(false);
  };

  const continueToScoring = () => {
    setPlayers((current) =>
      current.map((player, index) => ({
        ...player,
        name: player.name.trim() || `Player ${index + 1}`,
      })),
    );
    setIsReady(true);
  };

  const playerLabel = players.length === 1 ? 'player' : 'players';

  return (
    <main className="parks-app">
      <div className="trail-art" aria-hidden="true">
        <div className="trail-line" />
        <svg className="mountain" viewBox="0 0 240 140" aria-hidden="true">
          <path d="M-4 125 52 59l22 27 38-57 94 96" />
          <path d="m77 125 38-52 34 39 20-18 48 31" />
          <path d="m100 47 12 18 12-9" />
          <path d="M13 105h45M151 108h47" />
        </svg>
      </div>

      <div className="parks-shell">
        <header className="parks-header">
          <div className="brand-mark" aria-label="Parks scorer home">
            <span className="brand-seal">
              <TreePine size={18} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span className="brand-copy">
              <span className="brand-name">Parks scorer</span>
              <span className="brand-subtitle">field notes for game night</span>
            </span>
          </div>
          <div className="header-note">
            <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
            <span>Somewhere worth going</span>
          </div>
        </header>

        <section className="hero-grid" aria-labelledby="welcome-heading">
          <div className="hero-copy">
            <div className="eyebrow">A new trail begins</div>
            <h1 id="welcome-heading" className="hero-title">
              Gather your
              <br />
              <em>park crew.</em>
            </h1>
            <p className="hero-description">
              Settle in, name your fellow hikers, and make room for the
              little moments that make game night worth remembering.
            </p>
            <div className="field-note">
              <span className="field-note-line" />
              <Compass size={17} strokeWidth={1.5} aria-hidden="true" />
              <span><strong>First, a small ritual.</strong> Tell us who&apos;s along.</span>
            </div>
          </div>

          <section className="setup-card" aria-labelledby="setup-heading">
            <div className="card-inner">
              <div className="card-heading">
                <div>
                  <div className="eyebrow">Trip register / 01</div>
                  <h2 id="setup-heading">Who&apos;s hiking?</h2>
                </div>
                <div className="player-count" data-testid="text-player-count">
                  <span className="player-count-dot" />
                  {players.length} {playerLabel}
                </div>
              </div>

              <div className="players-list" aria-label="Players">
                {players.map((player, index) => (
                  <div
                    className="player-row"
                    key={player.id}
                    style={{ animationDelay: `${index * 70}ms` }}
                    data-testid={`row-player-${player.id}`}
                  >
                    <span className="player-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <input
                      className="player-input"
                      value={player.name}
                      onChange={(event) => updatePlayer(player.id, event.target.value)}
                      aria-label={`Name for player ${index + 1}`}
                      data-testid={`input-player-name-${player.id}`}
                      maxLength={24}
                    />
                    <button
                      className="remove-player"
                      type="button"
                      onClick={() => removePlayer(player.id)}
                      disabled={players.length <= 2}
                      aria-label={`Remove ${player.name || `player ${index + 1}`}`}
                      data-testid={`button-remove-player-${player.id}`}
                    >
                      <X size={16} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="add-player"
                type="button"
                onClick={addPlayer}
                disabled={players.length >= 5}
                aria-label="Add another player"
                data-testid="button-add-player"
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                <span>{players.length >= 5 ? 'Trail party is full' : 'Add another hiker'}</span>
              </button>

              <button
                className="continue-button"
                type="button"
                onClick={continueToScoring}
                data-testid="button-continue-to-scoring"
              >
                <span>{isReady ? 'Trip register updated' : 'Continue to the trailhead'}</span>
                <span className="continue-arrow">
                  {isReady ? (
                    <Check size={19} strokeWidth={2.2} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={19} strokeWidth={2} aria-hidden="true" />
                  )}
                </span>
              </button>

              <p className="card-footnote">
                <span className="footnote-mark" aria-hidden="true" /> You can change names any time
                before scoring.
              </p>

              {isReady && (
                <div className="confirmation" role="status" data-testid="status-trip-ready">
                  <Check size={17} strokeWidth={2.1} aria-hidden="true" />
                  <div>
                    <strong>The trailhead is ready.</strong> {players.length} {playerLabel} logged for
                    this outing.
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>

        <footer className="footer-meta">
          <span>Take only memories. Leave only footprints.</span>
          <span>Session 001 / Parks scorer</span>
        </footer>
      </div>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;