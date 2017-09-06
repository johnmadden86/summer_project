/*
**  Selects previous inputs for drop-down menus when updating
*/

$(
    function () {
      const select = document.getElementsByTagName('select');
      const tag = document.getElementsByTagName('option');
      let i = 0;
      while (i < tag.length) {
        if (tag[i].value === select[0].title) {
          const selected = document.createAttribute('selected');
          tag[i].setAttributeNode(selected);
        }

        i++;
      }
    }
);
