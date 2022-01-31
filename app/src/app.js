import React from 'react';
import Visual from './components/Visual';
import { draw, setup, width, height } from './algorithms/maze/index';

const App = () => {
    /*const draw = (ctx, frameCount) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(frameCount, 100, 200, 100);
    }*/

    return (
        <Visual width={width} height={height} setup={setup} draw={draw}/>
    );
}

export default App;