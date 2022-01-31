import React, { useState } from 'react';
import Canvas from './Canvas';

const Visual = props => {
    const { draw, setup, ...rest } = props
    const [play, setPlay] = useState(false);

    const onClick = (e) => {
        e.preventDefault();
        if(!play) {
            setPlay(!play);
        }
    }

    const onPlay = (ctx, frameCount) => {
        draw(ctx, frameCount, { play });
    }

    return (
        <div>
            <h1>Algo name</h1>
            <button onClick={onClick}>Play</button>
            <Canvas setup={setup} draw={onPlay} {...rest} />
        </div>
    )
}

export default Visual;