// Rubicon fork whole file
class GlyphDimension {
  Glyph;

  Width;

  Height;

  X;

  Y;

  Transform;

  IsPlaceHolder;

  constructor(glyph, width, height, x, y, transform, isPlaceHolder) {
    this.Glyph = glyph;
    this.Width = width;
    this.Height = height;
    this.X = x;
    this.Y = y;
    this.Transform = transform;
    this.IsPlaceHolder = isPlaceHolder;
  }

  static evaluatorPushWhiteSpacesHook(textContent, width, height, transform) {
    const currentTextContentItem = textContent.items.at(-1);
    if (!currentTextContentItem.glyphDimensions) {
      currentTextContentItem.glyphDimensions = [];
    }

    const glyphDimension = new GlyphDimension(
      " ",
      width,
      height,
      0,
      0,
      transform,
      false
    );

    currentTextContentItem.glyphDimensions.push(glyphDimension);
  }

  static evaluatorBuildTextContentItemHook(
    glyphUnicode,
    scaledDim,
    textChunk,
    font,
    textState,
    glyph
  ) {
    const glyphDimension = new GlyphDimension(
      glyphUnicode,
      scaledDim * textChunk.textAdvanceScale,
      textChunk.prevTransform[0] +
        Math.abs(font.descent * textState.fontSize) +
        font.ascent,
      (textChunk.width - scaledDim) * textChunk.textAdvanceScale,
      textChunk.prevTransform[5] -
        (Math.abs(font.descent * textState.fontSize) + font.ascent),
      textChunk.transform,
      false
    );
    textChunk.glyphDimensions.push(glyphDimension);

    if (glyph.unicode.length > 1) {
      for (let i = 0; i < glyph.unicode.length - 1; i++) {
        const placeholderDimesion = new GlyphDimension(
          glyphUnicode,
          -1,
          -1,
          -1,
          -1,
          textChunk.transform,
          true
        );
        textChunk.glyphDimensions.push(placeholderDimesion);
      }
    }
  }

  static evaluatorAddFakeSpacesHook(width, textContentItem, textState) {
    const glyphDimension = new GlyphDimension(
      " ",
      width * textContentItem.textAdvanceScale,
      textContentItem.transform[0] +
        Math.abs(textState.font.descent * textState.fontSize) +
        textState.font.ascent,
      textContentItem.width * textContentItem.textAdvanceScale,
      textContentItem.transform[5] -
        (Math.abs(textState.font.descent * textState.fontSize) +
          textState.font.ascent),
      textContentItem.transform,
      false
    );

    textContentItem.glyphDimensions.push(glyphDimension);
  }
}

export { GlyphDimension };