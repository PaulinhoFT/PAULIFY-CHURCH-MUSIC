import { useNavigate } from 'react-router-dom';
import CoverImage from './CoverImage';
import './ArtistCard.css';

export const artistImagePath = (artistName) =>
  `/artists/${artistName.replace(/ /g, '_').replace(/\//g, '_')}.jpg`;

export const artistRoute = (artistName) => `/artista/${encodeURIComponent(artistName)}`;

const ArtistCard = ({ artist, songCount }) => {
  const navigate = useNavigate();

  return (
    <div className="artist-card" onClick={() => navigate(artistRoute(artist))} title={artist}>
      <div className="artist-circle">
        <CoverImage src={artistImagePath(artist)} alt={artist} className="artist-img-wrap" fallbackText={artist.charAt(0)} />
      </div>
      <p className="artist-name truncate">{artist}</p>
      {songCount !== undefined && <p className="artist-count text-subdued">{songCount} {songCount === 1 ? 'música' : 'músicas'}</p>}
    </div>
  );
};

export default ArtistCard;
