import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { GreetingCard } from '../components/GreetingCard';
import { IconButton } from '../components/IconButton';
import { LeafIcon, MenuIcon, SearchIcon } from '../components/Icons';
import { BookshelfIllustration } from '../components/BookshelfIllustration';

export default function Shelf() {
  const navigate = useNavigate();
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
            <span>Mi Estantería</span>
            <LeafIcon className="text-accent-cool" size={18} />
          </>
        }
        right={
          <IconButton label="Buscar">
            <SearchIcon />
          </IconButton>
        }
      />
      <GreetingCard />

      <div
        className="relative mx-3 mb-3 mt-3 flex-1 overflow-hidden"
        onDoubleClick={() => navigate('/book/principito')}
      >
        <BookshelfIllustration />
      </div>
    </div>
  );
}
