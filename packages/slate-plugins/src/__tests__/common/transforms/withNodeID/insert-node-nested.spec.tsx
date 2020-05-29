/** @jsx jsx */

import { jsx } from '__test-utils__/jsx';
import { idCreatorFixture } from '__tests__/common/transforms/withNodeID/fixtures';
import { withNodeID } from 'common/transforms/node-id';
import { Editor } from 'slate';
import { withHistory } from 'slate-history';

const input = ((
  <editor>
    <hp>
      test
      <cursor />
    </hp>
  </editor>
) as any) as Editor;

const output = (
  <editor>
    <hp>test</hp>
    <hli id={1}>
      <hp id={2}>inserted</hp>
    </hli>
  </editor>
) as any;

it('should add an id to the new elements', () => {
  const editor = withNodeID({ idCreator: idCreatorFixture })(
    withHistory(input)
  );

  editor.insertNode(
    (
      <hli>
        <hp>inserted</hp>
      </hli>
    ) as any
  );

  editor.undo();
  editor.redo();

  expect(input.children).toEqual(output.children);
});