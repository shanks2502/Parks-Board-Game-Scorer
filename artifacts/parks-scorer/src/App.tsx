import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Compass,
  MapPin,
  Minus,
  Plus,
  TreePine,
  X,
} from 'lucide-react';
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

type BaseScores = {
  parks: number;
  passion: number;
  photos: number;
};

const initialScores = (): BaseScores => ({ parks: 0, passion: 0, photos: 0 });

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-mark" aria-label="Parks scorer home">
      <span className="brand-seal">
        <TreePine size={18} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="brand-copy">
        <span className="brand-name">Parks scorer</span>
        {!compact && <span className="brand-subtitle">field notes for game night</span>}
      </span>
    </div>
  );
}

function TrailArt() {
  return (
    <div className="trail-art" aria-hidden="true">
      <div className="trail-line" />
      <svg className="mountain" viewBox="0 0 240 140">
        <path d="M-4 125 52 59l22 27 38-57 94 96" />
        <path d="m77 125 38-52 34 39 20-18 48 31" />
        <path d="m100 47 12 18 12-9" />
        <path d="M13 105h45M151 108h47" />
      </svg>
    </div>
  );
}

function SetupPage({
  players,
  onPlayersChange,
  onStart,
}: {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onStart: () => void;
}) {
  const allNamesEntered = players.every((player) => player.name.trim().length > 0);

  const updatePlayer = (id: number, name: string) => {
    onPlayersChange(players.map((player) => (player.id === id ? { ...player, name } : player)));
  };

  const removePlayer = (id: number) => {
    if (players.length <= 2) return;
    onPlayersChange(players.filter((player) => player.id !== id));
  };

  const addPlayer = () => {
    if (players.length >= 5) return;
    const nextId = Math.max(...players.map((player) => player.id), 0) + 1;
    onPlayersChange([...players, { id: nextId, name: '' }]);
  };

  const playerLabel = players.length === 1 ? 'player' : 'players';

  return (
    <main className="parks-app">
      <TrailArt />
      <div className="parks-shell">
        <header className="parks-header">
          <Brand />
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
              Settle in, name your fellow hikers, and make room for the little
              moments that make game night worth remembering.
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
                    <span className="player-number" aria-hidden="true">0{index + 1}</span>
                    <input
                      className="player-input"
                      value={player.name}
                      placeholder={`Hiker ${index + 1}`}
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
                onClick={onStart}
                disabled={!allNamesEntered}
                data-testid="button-continue-to-scoring"
              >
                <span>Start the hike</span>
                <span className="continue-arrow">
                  <ArrowRight size={19} strokeWidth={2} aria-hidden="true" />
                </span>
              </button>

              <p className="card-footnote">
                <span className="footnote-mark" aria-hidden="true" /> You can change names any time
                before scoring.
              </p>
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

function ScoreStepper({
  value,
  onChange,
  testId,
}: {
  value: number;
  onChange: (value: number) => void;
  testId: string;
}) {
  return (
    <div className="score-stepper">
      <button
        className="step-button"
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        aria-label="Decrease score"
        data-testid={`${testId}-decrease`}
      >
        <ArrowDown size={15} strokeWidth={2.1} aria-hidden="true" />
      </button>
      <input
        className="score-value"
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          onChange(Number.isFinite(nextValue) ? Math.max(0, nextValue) : 0);
        }}
        aria-label="Edit score"
        data-testid={`${testId}-value`}
      />
      <button
        className="step-button"
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase score"
        data-testid={`${testId}-increase`}
      >
        <ArrowUp size={15} strokeWidth={2.1} aria-hidden="true" />
      </button>
    </div>
  );
}

function ScoreRowLabel({ label, helper }: { label: string; helper?: string }) {
  return (
    <span className="row-label">
      <span>
        {label}
        {helper && <span className="row-helper">{helper}</span>}
      </span>
    </span>
  );
}

function ScoringPage({
  players,
  scores,
  setScores,
  seasonBonuses,
  setSeasonBonuses,
  firstPlayerId,
  setFirstPlayerId,
  onBack,
}: {
  players: Player[];
  scores: Record<number, BaseScores>;
  setScores: React.Dispatch<React.SetStateAction<Record<number, BaseScores>>>;
  seasonBonuses: Record<number, boolean>;
  setSeasonBonuses: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  firstPlayerId: number;
  setFirstPlayerId: (id: number) => void;
  onBack: () => void;
}) {
  const [showWinner, setShowWinner] = useState(false);

  const photoBonuses = useMemo(() => {
    const photoScores = players.map((player) => scores[player.id]?.photos ?? 0);
    const highest = Math.max(...photoScores);
    if (highest === 0) {
      return Object.fromEntries(players.map((player) => [player.id, 0])) as Record<number, number>;
    }
    const allTied = photoScores.every((score) => score === highest);
    const distinctBelowHighest = [...new Set(photoScores.filter((score) => score < highest))]
      .sort((a, b) => b - a);
    const secondHighest = distinctBelowHighest[0];

    return Object.fromEntries(players.map((player) => {
      const photoScore = scores[player.id]?.photos ?? 0;
      if (photoScore === highest) return [player.id, 4];
      if (!allTied && secondHighest !== undefined && photoScore === secondHighest) return [player.id, 2];
      return [player.id, 0];
    })) as Record<number, number>;
  }, [players, scores]);

  const finalScore = (player: Player) => {
    const base = scores[player.id] ?? initialScores();
    return base.parks
      + base.passion
      + base.photos
      + (photoBonuses[player.id] ?? 0)
      + (seasonBonuses[player.id] ? 3 : 0)
      + (firstPlayerId === player.id ? 1 : 0);
  };

  const winners = useMemo(() => {
    const highestFinalScore = Math.max(...players.map(finalScore));
    const finalScoreLeaders = players.filter(
      (player) => finalScore(player) === highestFinalScore,
    );
    const highestParksScore = Math.max(
      ...finalScoreLeaders.map((player) => scores[player.id]?.parks ?? 0),
    );

    return finalScoreLeaders.filter(
      (player) => (scores[player.id]?.parks ?? 0) === highestParksScore,
    );
  }, [players, scores, photoBonuses, seasonBonuses, firstPlayerId]);

  const updateScore = (playerId: number, field: keyof BaseScores, value: number) => {
    setScores((current) => ({
      ...current,
      [playerId]: { ...(current[playerId] ?? initialScores()), [field]: Math.max(0, value) },
    }));
  };

  return (
    <main className="scoring-page">
      <TrailArt />
      <div className="scoring-shell">
        <header className="scoring-header">
          <div className="scoring-kicker">
            <Brand compact />
            <button className="back-button" type="button" onClick={onBack} data-testid="button-edit-players">
              <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
              Edit players
            </button>
          </div>
          <div className="scoring-title-block">
            <div className="eyebrow">Trail register / 02</div>
            <h1 className="scoring-title" data-testid="text-scoring-title">Score the day.</h1>
          </div>
        </header>

        <section className="scoring-intro" aria-labelledby="scoring-heading">
          <div>
            <div className="eyebrow">Field notes / final tally</div>
            <p id="scoring-heading">
              Count what you found along the way. The little red markers show the
              rules that tally themselves.
            </p>
          </div>
          <div className="score-legend" data-testid="text-score-legend">
            <span className="legend-mark" />
            Arrow controls keep every score on trail
          </div>
        </section>

        <section className="ledger-frame" aria-label="Parks scoring ledger">
          <div className="ledger-scroll">
            <table className="score-table">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="mono-label">Scorecard</span>
                  </th>
                  {players.map((player, index) => (
                    <th scope="col" key={player.id} data-testid={`header-player-${player.id}`}>
                      <span className="player-column-number">Hiker 0{index + 1}</span>
                      <span className="player-column-name">{player.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ['parks', 'Parks', 'cards collected'],
                  ['passion', 'Passion', 'wildlife icons'],
                  ['photos', 'Photos', 'snapshots taken'],
                ] as const).map(([field, label, helper]) => (
                  <tr key={field}>
                    <th scope="row"><ScoreRowLabel label={label} helper={helper} /></th>
                    {players.map((player) => (
                      <td key={player.id}>
                        <ScoreStepper
                          value={scores[player.id]?.[field] ?? 0}
                          onChange={(value) => updateScore(player.id, field, value)}
                          testId={`score-${field}-${player.id}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <th scope="row"><ScoreRowLabel label="Photo bonus" helper="automatic" /></th>
                  {players.map((player) => (
                    <td key={player.id}>
                      <span
                        className={`readonly-score ${photoBonuses[player.id] ? 'highlight' : ''}`}
                        data-testid={`score-photo-bonus-${player.id}`}
                      >
                        {photoBonuses[player.id] ?? 0}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <th scope="row"><ScoreRowLabel label="Season bonus" helper="3 points" /></th>
                  {players.map((player) => (
                    <td key={player.id}>
                      <label className="season-toggle" data-testid={`toggle-season-bonus-${player.id}`}>
                        <input
                          type="checkbox"
                          checked={seasonBonuses[player.id] ?? false}
                          onChange={(event) => setSeasonBonuses((current) => ({
                            ...current,
                            [player.id]: event.target.checked,
                          }))}
                          aria-label={`${player.name} season bonus`}
                        />
                        <Check size={17} strokeWidth={2.3} aria-hidden="true" />
                      </label>
                    </td>
                  ))}
                </tr>

                <tr>
                  <th scope="row"><ScoreRowLabel label="First player token" helper="choose one" /></th>
                  {players.map((player) => (
                    <td key={player.id}>
                      <label className="token-radio" data-testid={`radio-first-player-${player.id}`}>
                        <input
                          type="radio"
                          name="first-player"
                          value={player.id}
                          checked={firstPlayerId === player.id}
                          onChange={() => setFirstPlayerId(player.id)}
                          aria-label={`${player.name} has the first player token`}
                        />
                      </label>
                    </td>
                  ))}
                </tr>

                <tr className="final-row">
                  <th scope="row"><ScoreRowLabel label="Final score" helper="total trail points" /></th>
                  {players.map((player) => (
                    <td key={player.id}>
                      <span className="readonly-score" data-testid={`score-final-${player.id}`}>
                        {finalScore(player)}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ledger-caption">
            <span><strong>Photo bonus</strong> awards 4 to the most photos, then 2 to the next distinct score.</span>
            <span>Scroll sideways on a narrow trail</span>
          </div>
        </section>

        <section className="winner-panel" aria-live="polite">
          <button
            className="winner-button"
            type="button"
            onClick={() => setShowWinner(true)}
            data-testid="button-show-winner"
          >
            <span>Show winner</span>
            <span className="winner-button-mark">
              <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </span>
          </button>
          {showWinner && (
            <div className="winner-message" role="status" data-testid="status-winner">
              <span className="winner-message-label">The trail belongs to</span>
              <strong>
                {winners.length === 1
                  ? `${winners[0].name} wins`
                  : `${winners.map((player) => player.name).join(', ')} win`}
              </strong>
            </div>
          )}
        </section>

        <footer className="scoring-footer">
          <span>Take only memories. Leave only footprints.</span>
          <span>{players.length} hikers / tally in progress</span>
        </footer>
      </div>
    </main>
  );
}

function Home() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
  ]);
  const [isScoring, setIsScoring] = useState(false);
  const [scores, setScores] = useState<Record<number, BaseScores>>({});
  const [seasonBonuses, setSeasonBonuses] = useState<Record<number, boolean>>({});
  const [firstPlayerId, setFirstPlayerId] = useState(1);

  const startHike = () => {
    if (!players.every((player) => player.name.trim().length > 0)) return;
    const trimmedPlayers = players.map((player) => ({ ...player, name: player.name.trim() }));
    setPlayers(trimmedPlayers);
    setScores((current) => Object.fromEntries(
      trimmedPlayers.map((player) => [player.id, current[player.id] ?? initialScores()]),
    ));
    setSeasonBonuses((current) => Object.fromEntries(
      trimmedPlayers.map((player) => [player.id, current[player.id] ?? false]),
    ));
    if (!trimmedPlayers.some((player) => player.id === firstPlayerId)) {
      setFirstPlayerId(trimmedPlayers[0].id);
    }
    setIsScoring(true);
  };

  return isScoring ? (
    <ScoringPage
      players={players}
      scores={scores}
      setScores={setScores}
      seasonBonuses={seasonBonuses}
      setSeasonBonuses={setSeasonBonuses}
      firstPlayerId={firstPlayerId}
      setFirstPlayerId={setFirstPlayerId}
      onBack={() => setIsScoring(false)}
    />
  ) : (
    <SetupPage players={players} onPlayersChange={setPlayers} onStart={startHike} />
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