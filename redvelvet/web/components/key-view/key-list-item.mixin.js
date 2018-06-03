const keyListItemMixin = {
  computed: {
    sortedChildren: function() {
      return Object.values(this.tree.children).sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }
  }
};
