export function setCanvasFontSize(ctx, size) {
    ctx.font = ctx.font.replace(/\d+px/, size);
}

export function playAudio(url) {
    new Audio(url).play();
}