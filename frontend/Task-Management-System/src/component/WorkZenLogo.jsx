import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';

const WorkZenLogo = ({ showText = true, size = 'md' }) => {
  const markSize = size === 'sm' ? 28 : size === 'lg' ? 40 : 34;
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 17;

  return (
    <span className={`workzen-logo workzen-logo--${size}`}>
      <span
        className="workzen-logo__mark"
        style={{ width: markSize, height: markSize }}
        aria-hidden="true"
      >
        <Sparkles size={iconSize} strokeWidth={2.25} />
      </span>
      {showText && (
        <span className="workzen-logo__text">
          Work<span className="workzen-logo__accent">Zen</span>
        </span>
      )}
    </span>
  );
};

WorkZenLogo.propTypes = {
  showText: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default WorkZenLogo;
