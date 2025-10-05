/**
 * Base class for anything that can be drawn on the canvas.
 * Holds size/position, current image, and a cache for animation frames.
 * @file
 */

/**
 * Drawable object with basic sprite and helper utilities.
 * @class
 */
class DrawableObject {
  /**
   * Current HTML image to render.
   * @type {HTMLImageElement|undefined}
   */
  img;

  /**
   * Cache of preloaded images keyed by path.
   * @type {Record<string, HTMLImageElement>}
   */
  imageCache = {};

  /**
   * Current animation frame index.
   * @type {number}
   */
  currentImage = 0;

  /** X position (world coordinates). @type {number} */
  x = 120;

  /** Y position (world coordinates). @type {number} */
  y = 290;

  /** Render width. @type {number} */
  width = 100;

  /** Render height. @type {number} */
  height = 150;

  /**
   * Collision/frame offset to tweak hitboxes and debug frames.
   * @type {{ x:number, y:number, width:number, height:number }}
   */
  offset = { x: 0, y: 0, width: 0, height: 0 };

  /**
   * Load a single image into this.img.
   * @param {string} path - Image source path.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preload an array of images into the imageCache.
   * @param {string[]} arr - List of image paths to preload.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Advance animation by switching to the next cached image.
   * @param {string[]} images - Ordered list of frame paths.
   * @returns {void}
   */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    const path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Map a 0–100 value to a 0–5 frame index using fixed thresholds.
   * 0→0, 1–20→1, 21–40→2, 41–60→3, 61–80→4, 81–99→5, 100→5.
   * @param {number} value - Percentage value in [0,100].
   * @returns {number} Frame index in [0,5].
   */
  frameIndexFromValue(value) {
    if (value === 100) return 5;
    if (value > 80) return 4;
    if (value > 60) return 3;
    if (value > 40) return 2;
    if (value > 20) return 1;
    return 0;
  }

  /**
   * Draw the current image onto the given canvas context.
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
   * @returns {void}
   */
  draw(ctx) {
    if (!this.img) return;
    if (this.img.complete && this.img.naturalWidth > 0) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * (Debug) Draw the object's outer frame.
   * Controlled by a hardcoded flag inside.
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
   * @returns {void}
   */
  drawFrame(ctx) {
    if (false) {
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * (Debug) Draw the object's offset/collision frame.
   * Controlled by a hardcoded flag inside.
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
   * @returns {void}
   */
  drawOffsetFrame(ctx) {
    if (false) {
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'red';
      ctx.rect(
        this.x + this.offset.x,
        this.y + this.offset.y,
        this.width - this.offset.width,
        this.height - this.offset.height
      );
      ctx.stroke();
    }
  }
}
