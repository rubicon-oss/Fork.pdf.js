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
      true
    );

    currentTextContentItem.glyphDimensions.push(glyphDimension);
  }

  static evaluatorBuildTextContentItemHook(
    glyphUnicode,
    width,
    textChunk,
    font,
    glyph
  ) {
    const glyphDimension = new GlyphDimension(
      glyphUnicode,
      width * textChunk.textAdvanceScale,
      textChunk.height * font.lineHeight,
      (textChunk.width - width) * textChunk.textAdvanceScale,
      textChunk.transform[5] + textChunk.height,
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
      textContentItem.height * textState.font.lineHeight,
      (textContentItem.width - width) * textContentItem.textAdvanceScale,
      textContentItem.transform[5] + textContentItem.height,
      textContentItem.transform,
      false
    );

    // In case we have an previous dimension we want the space to start at
    // the end of the previous
    if (textContentItem.glyphDimensions.length > 0) {
      const previous = textContentItem.glyphDimensions.at(-1);
      glyphDimension.X = previous.X + previous.Width;
    }

    textContentItem.glyphDimensions.push(glyphDimension);
  }
}

export { GlyphDimension };
