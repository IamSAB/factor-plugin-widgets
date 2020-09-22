<template>
  <dashboard-panel title="Menu">
    <div class="items">
      <vue-nestable v-model="items" key-prop="_id">
        <template #default="{ item }">
          <div class="item">
            <div class="handle">
              <vue-nestable-handle :item="item">
                <factor-icon icon="fas fa-bars fa-lg" />
              </vue-nestable-handle>
            </div>
            <div class="buttons">
              <div class="edit">
                <factor-btn @click="remove(item)" size="tiny">
                  <factor-icon icon="fas fa-times" />
                </factor-btn>
                <factor-btn @click="modal(EditTreeMode.EditItem, item)" size="tiny">
                  <factor-icon icon="fas fa-pen" />
                </factor-btn>
              </div>
              <div class="add">
                <factor-btn @click="modal(EditTreeMode.Successor, item)" size="tiny">
                  <factor-icon icon="fas fa-plus" />
                  <factor-icon icon="fas fa-long-arrow-alt-down" />
                </factor-btn>
                <factor-btn @click="modal(EditTreeMode.Child, item)" size="tiny">
                  <factor-icon icon="fas fa-plus" />
                  <factor-icon icon="fas fa-level-down-alt" />
                </factor-btn>
              </div>
            </div>
            <div>
              <div class="item">
                <b>
                  <factor-icon v-if="item.icon" :icon="item.icon" />
                  {{ item.label }}
                </b>
                <em v-if="item.desc">
                  <small>{{ item.desc }}</small>
                </em>
              </div>
              <div class="link">
                <span>{{ item.path }}</span>
              </div>
            </div>
          </div>
        </template>
        <template #placeholder>
          <span>No menu items</span>
          <factor-btn @click="modal(EditTreeMode.Child, root)" size="small">
            Add
            <factor-icon icon="fas fa-plus" />
          </factor-btn>
        </template>
      </vue-nestable>
    </div>
    <factor-modal :vis.sync="editTreeMode > EditTreeMode.NotEditing">
      <factor-form class="form" @submit="save()">
        <input-link v-model="item" />
        <factor-input-submit>Save</factor-input-submit>
      </factor-form>
    </factor-modal>
  </dashboard-panel>
</template>

<script lang="ts">
import { VueNestable, VueNestableHandle } from "vue-nestable";
import { stored, storeItem } from "@factor/api";
import {
  dashboardPanel,
  dashboardInput,
  factorBtn,
  factorIcon,
  factorInputSubmit,
  factorModal
} from "@factor/ui";
import { randomToken } from "@factor/api/utils";
import { factorForm } from "@factor/ui";
import { factorInputWrap } from "@factor/ui";
import inputLink from "./input-link.vue";
import { cloneDeep } from "lodash-es";
import { MenuItem, TargetType, LinkType } from "./types";

enum EditTreeMode {
  NotEditing,
  Successor,
  Child,
  EditItem
}

const menuItem: MenuItem = {
  _id: "",
  _linkType: LinkType.Post,
  _postType: "page",
  target: TargetType.Default,
  children: []
};

export default {
  props: {
    widgetId: {
      type: String,
      required: true
    }
  },
  components: {
    VueNestable,
    VueNestableHandle,
    dashboardPanel,
    dashboardInput,
    factorForm,
    factorInputWrap,
    factorBtn,
    inputLink,
    factorInputSubmit,
    factorIcon,
    factorModal
  },
  data() {
    return {
      loading: false,
      showModal: false,
      EditTreeMode,
      editTreeMode: EditTreeMode.NotEditing,
      item: menuItem,
      relatedId: ""
    };
  },
  computed: {
    widget: {
      get(this: any) {
        return stored(this.widgetId) || {};
      },
      set(this: any, v): void {
        storeItem(this.widgetId, v);
      }
    },
    root() {
      return {
        _id: "root",
        children: this.items
      };
    },
    items: {
      get() {
        return this.widget.list || []
      },
      set(v) {
        console.log("set items")
        this.widget.list = v
      }
    }
  },
  methods: {
    editTreeItem(
      id: String,
      item: MenuItem,
      index: number | string | undefined,
      parent: MenuItem | undefined,
      callback: CallableFunction
    ): boolean {
      let edited = false;
      if (item._id == id) {
        callback(item, index, parent);
        return true;
      } else {
        for (let i in item.children) {
          edited = this.editTreeItem(id, item.children[i], i, item, callback);
          if (edited) break;
        }
        return edited;
      }
    },
    modal(editTreeMode: EditTreeMode, item: MenuItem) {
      console.log("EDIT");
      console.log(editTreeMode);
      console.log(item);
      this.editTreeMode = editTreeMode;
      this.relatedId = item._id;
      this.item = cloneDeep(
        editTreeMode < EditTreeMode.EditItem ? menuItem : item
      );
    },
    save() {
      console.log("SAVE");
      const addCallback = (item: MenuItem, index: number, parent: MenuItem) => {
        console.log("SAVE_ADD");
        let saveItem = cloneDeep({
          ...this.item,
          _id: randomToken(6)
        });
        if (this.editTreeMode == EditTreeMode.Successor) {
          parent.children.splice(index, 0, saveItem);
        } else if (this.editTreeMode == EditTreeMode.Child) {
          item.children.push(saveItem);
        }
      };
      const editCallback = (
        item: MenuItem,
        index: number,
        parent: MenuItem
      ) => {
        console.log("SAVE_EDIT");
        parent.children.splice(index, 1, cloneDeep(this.item));
      };

      this.editTreeItem(
        this.relatedId,
        this.root,
        undefined,
        undefined,
        this.editTreeMode < EditTreeMode.EditItem ? addCallback : editCallback
      );
      this.editTreeMode = EditTreeMode.NotEditing;
    },
    remove(item: MenuItem) {
      console.log("REMOVE");
      console.log(item._id);
      this.editTreeItem(
        item._id,
        this.root,
        undefined,
        undefined,
        (item: MenuItem, index: number, parent: MenuItem) => {
          console.log("REMOVE_DO");
          parent.children.splice(index, 1);
        }
      );
    }
  }
};
</script>

<style lang="postcss">
.items {
  .item {
    display: flex;
    .buttons {
      .edit button {
        margin-bottom: 0.2rem;
        .factor-icon {
          margin: 0 0.3rem;
        }
      }
      button + button {
        margin-left: 0.2rem;
      }
    }
    align-items: center;
    > * {
      margin-left: 1rem;
    }
  }
}

/*
* Style for nestable
*/
.nestable {
  position: relative;
}
.nestable-rtl {
  direction: rtl;
}
.nestable .nestable-list {
  margin: 0;
  padding: 0 0 0 40px;
  list-style-type: none;
}
.nestable-rtl .nestable-list {
  padding: 0 40px 0 0;
}
.nestable > .nestable-list {
  padding: 0;
}
.nestable-item,
.nestable-item-copy {
  margin: 10px 0 0;
}
.nestable-item:first-child,
.nestable-item-copy:first-child {
  margin-top: 0;
}
.nestable-item .nestable-list,
.nestable-item-copy .nestable-list {
  margin-top: 10px;
}
.nestable-item {
  position: relative;
}
.nestable-item.is-dragging .nestable-list {
  pointer-events: none;
}
.nestable-item.is-dragging * {
  opacity: 0;
  filter: alpha(opacity=0);
}
.nestable-item.is-dragging:before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(106, 127, 233, 0.274);
  border: 1px dashed rgb(73, 100, 241);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
.nestable-drag-layer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
}
.nestable-rtl .nestable-drag-layer {
  left: auto;
  right: 0;
}
.nestable-drag-layer > .nestable-list {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  background-color: rgba(106, 127, 233, 0.274);
}
.nestable-rtl .nestable-drag-layer > .nestable-list {
  padding: 0;
}
.nestable [draggable="true"] {
  cursor: move;
}
.nestable-handle {
  display: inline;
}
</style>