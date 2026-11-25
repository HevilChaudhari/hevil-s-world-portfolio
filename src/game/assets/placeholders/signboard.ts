import { PALETTE as C } from '../../config/constants';
import { FONT_HEIGHT, drawText, measureText } from '../pixelFont';
import { px, type Painter } from './types';

const PADDING_X = 4;
const PADDING_Y = 3;
const LINE_GAP = 2;
const POST_HEIGHT = 9;

/**
 * Building name board on two posts, generated from text (not a replaceable
 * placeholder: real art would replace the board style here).
 * Anchored bottom-centre; total height = board + posts.
 */
export function signboardPainter(lines: readonly string[]): Painter {
  return (g) => {
    const textWidth = Math.max(...lines.map(measureText));
    const width = textWidth + PADDING_X * 2;
    const boardHeight = lines.length * FONT_HEIGHT + (lines.length - 1) * LINE_GAP + PADDING_Y * 2;
    const height = boardHeight + POST_HEIGHT;

    // Posts
    px(g, C.woodDark, 3, boardHeight - 1, 2, POST_HEIGHT + 1);
    px(g, C.woodDark, width - 5, boardHeight - 1, 2, POST_HEIGHT + 1);
    // Board with frame
    px(g, C.woodDark, 0, 0, width, boardHeight);
    px(g, C.plaster, 1, 1, width - 2, boardHeight - 2);
    px(g, C.plasterShade, 1, boardHeight - 2, width - 2, 1);

    lines.forEach((line, i) => {
      const lineX = Math.floor((width - measureText(line)) / 2);
      drawText(g, line, lineX, PADDING_Y + i * (FONT_HEIGHT + LINE_GAP), C.ink);
    });
    return { width, height };
  };
}
