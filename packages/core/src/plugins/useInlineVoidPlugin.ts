import castArray from 'lodash/castArray';
import { SlatePlugin } from '../types/SlatePlugin/SlatePlugin';
import { WithOverride } from '../types/SlatePlugin/WithOverride';
import { getSlatePluginWithOverrides } from '../utils/getSlatePluginWithOverrides';

export interface WithInlineVoidOptions {
  plugins?: SlatePlugin[];
  inlineTypes?: string[];
  voidTypes?: string[];
}

/**
 * Merge and register all the inline types and void types from the plugins and options,
 * using `editor.isInline` and `editor.isVoid`
 */
export const withInlineVoid = ({
  plugins = [],
  inlineTypes = [],
  voidTypes = [],
}: WithInlineVoidOptions): WithOverride => (editor) => {
  const { isInline } = editor;
  const { isVoid } = editor;

  let allInlineTypes = [...inlineTypes];
  let allVoidTypes = [...voidTypes];

  plugins.forEach((plugin) => {
    if (plugin.inlineTypes) {
      allInlineTypes = allInlineTypes.concat(
        castArray(plugin.inlineTypes(editor))
      );
    }

    if (plugin.voidTypes) {
      allVoidTypes = allVoidTypes.concat(castArray(plugin.voidTypes(editor)));
    }
  });

  editor.isInline = (element) => {
    return allInlineTypes.includes(element.type as string)
      ? true
      : isInline(element);
  };

  editor.isVoid = (element) =>
    allVoidTypes.includes(element.type as string) ? true : isVoid(element);

  return editor;
};

/**
 * @see {@link withInlineVoid}
 */
export const useInlineVoidPlugin = getSlatePluginWithOverrides(withInlineVoid);