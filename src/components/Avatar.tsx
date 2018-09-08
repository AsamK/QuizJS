import React from 'react';

import './Avatar.css';

interface IAvatarProps {
    avatarCode: string | null;
}

function Avatar({ avatarCode }: IAvatarProps): React.ReactElement<IAvatarProps> {
    return <span className="qd-avatar">
        {avatarCode == null ? '🙂' : <span className="qd-avatar_code">{avatarCode}</span>}
    </span>;
}

export default Avatar;
