import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { IconButton } from '../components/IconButton';
import { Card } from '../components/Card';
import { BookCover } from '../components/BookCover';
import { StatusPill } from '../components/StatusPill';
import {
  ArrowLeftIcon,
  HeartFilledIcon,
  LeafIcon,
  MoreHorizontalIcon,
  QuoteIcon,
  StarFilledIcon,
  StarIcon,
} from '../components/Icons';
import { sampleBooks, STATUS_LABEL } from '../lib/sampleBooks';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = sampleBooks.find((b) => b.id === id) ?? sampleBooks[0]!;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TopBar
        left={
          <IconButton label="Volver" onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </IconButton>
        }
        title={null}
        right={
          <IconButton label="Más">
            <MoreHorizontalIcon />
          </IconButton>
        }
      />

      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-2">
        <div className="flex gap-4">
          <BookCover size="lg" />
          <div className="min-w-0 flex-1 self-center">
            <h2 className="font-display text-text-strong text-2xl leading-tight">{book.title}</h2>
            <p className="text-text-soft mt-1 text-sm">{book.author}</p>
            <div className="mt-3">
              <StatusPill active as="span">
                {STATUS_LABEL[book.status]}
              </StatusPill>
            </div>
            <div className="text-text-soft mt-3 flex items-center gap-1.5 text-xs">
              <Stars rating={book.rating} />
              <span className="ml-1">({book.ratings})</span>
            </div>
          </div>
        </div>

        {book.quote && (
          <Card className="relative flex items-start gap-3 p-4">
            <QuoteIcon className="text-accent-cool mt-0.5 shrink-0" size={22} />
            <p className="text-text-strong italic leading-snug">{book.quote}</p>
            <span
              aria-hidden
              className="bg-accent-cool/30 absolute -top-2 right-4 h-4 w-12 -rotate-3 rounded-[2px]"
            />
            <LeafIcon
              className="text-accent-cool absolute -bottom-1 right-2 opacity-70"
              size={28}
            />
          </Card>
        )}

        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-text-strong text-sm font-semibold">Notas</p>
            <HeartFilledIcon className="text-accent" size={18} />
          </div>
          <p className="text-text-soft text-sm">
            {book.note ?? 'Aún no has añadido notas. Toca aquí para escribir.'}
          </p>
        </Card>

        <Card variant="outline" className="p-4">
          <p className="text-text-soft mb-2 text-xs uppercase tracking-widest">Categoría</p>
          <p className="text-text-strong text-sm">{book.category}</p>
        </Card>
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75;
  return (
    <div className="text-accent flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <StarFilledIcon key={i} size={14} />;
        if (i === full && half)
          return (
            <span key={i} className="relative inline-block">
              <StarIcon size={14} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <StarFilledIcon size={14} />
              </span>
            </span>
          );
        return <StarIcon key={i} size={14} />;
      })}
    </div>
  );
}
