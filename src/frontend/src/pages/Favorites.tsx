import { Link } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { IconButton } from '../components/IconButton';
import { Card } from '../components/Card';
import { HeartFilledIcon, LeafIcon, MenuIcon } from '../components/Icons';
import { sampleBooks } from '../lib/sampleBooks';

export default function Favorites() {
  // Placeholder: marcamos algunos como "favoritos".
  const favs = sampleBooks.filter((b) => b.status === 'done' || b.status === 'reading');
  return (
    <div className="flex h-full min-h-0 flex-col">
      <TopBar
        left={
          <IconButton label="Menú">
            <MenuIcon />
          </IconButton>
        }
        title={
          <>
            <span>Favoritos</span>
            <LeafIcon className="text-accent-cool" size={18} />
          </>
        }
      />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-3">
        {favs.map((b) => (
          <Link key={b.id} to={`/book/${b.id}`} className="block">
            <Card className="flex items-center gap-3 p-3">
              <div
                className="border-border/60 h-16 w-12 shrink-0 rounded-md border"
                style={{ background: b.coverColor }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-text-strong truncate text-sm font-semibold">{b.title}</p>
                <p className="text-text-soft truncate text-xs">{b.author}</p>
                <p className="text-accent-deep mt-1 text-[11px] uppercase tracking-wider">
                  {b.category}
                </p>
              </div>
              <HeartFilledIcon className="text-accent" size={20} />
            </Card>
          </Link>
        ))}
        {favs.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-soft text-sm">
              Aún no tienes favoritos. Marca un libro con corazón para verlo aquí.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
