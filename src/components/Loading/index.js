import React from 'react';

import LogoT from '../../svg/LogoT';
import LogoCheck from '../../svg/LogoCheck';

// Styles include animations, so this is uses default scss rather than scss modules.

const Loading = () => (
  <div className="loading__main">
    <div className="loading__logo">
      <span className="loading__t">
        <LogoT />
      </span>
      <span className="loading__check">
        <LogoCheck />
      </span>
    </div>
    <p className="loading__text">Loading...</p>
  </div>
);

export default Loading;
