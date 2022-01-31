import React, { useEffect, useRef } from 'react';

const getPixelRatio = ctx => {
    const backingStore =
    ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

    return (window.devicePixelRatio || 1) / backingStore;
}

const Canvas = props => {
    const { draw, setup, width, height } = props
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let requestId, frameCount = 0;
        let ratio = getPixelRatio(context);
        let width = getComputedStyle(canvas)
            .getPropertyValue('width')
            .slice(0, -2);
        let height = getComputedStyle(canvas)
            .getPropertyValue('height')
            .slice(0, -2);

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const render = () => {
            frameCount += 5;
            draw(context, frameCount);
            requestId = requestAnimationFrame(render);
        }

        setup();
        requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(requestId);
        }
    }, [draw]);

    return <canvas width={width} height={height} ref={canvasRef}/>;
}

export default Canvas;