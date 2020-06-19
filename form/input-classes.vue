<template>
  <div class="factor-input tag-input" @keydown.stop>
    <div v-if="list" class="the-input">
      <input-select
        ref="selectField"
        v-model="addedText"
        :list="parsedList"
        :disabled="classNumber >= max ? true : false"
        @input="addClass()"
      />
    </div>
    <div v-else class="the-input">
      <factor-input-text
        ref="textField"
        v-model="addedText"
        :disabled="classNumber >= max ? true : false"
        type="text"
        placeholder="Enter Class"
        @keydown.prevent.enter="addClass($event)"
      />
      <factor-btn btn="default" :disabled="classNumber >= max" @click="addClass()">Add Class</factor-btn>
    </div>
    <div v-if="classes.length > 0" class="the-tags">
      <div v-for="(c, index) in classes" :key="index" class="tag">
        <span class="tx">{{ list ? getListItemName(c) : c }}</span>

        <span class="rm" @click="removeClass(index)">
          <factor-icon icon="fas fa-times" />
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorBtn, factorIcon, factorInputText } from "@factor/ui";
import { isEqual, toLabel, parseList, emitEvent } from "@factor/api";
import inputSelect from "./input-select.vue";

export default {
  components: { factorBtn, factorIcon, factorInputText, inputSelect },
  props: {
    value: { type: Array, default: () => [] },
    list: { type: Array, default: undefined }, // undefined by default
    min: { type: [Number, String], default: 0 },
    max: { type: [Number, String], default: 10 }
  },
  data() {
    return {
      classes: [],
      addedText: ""
    };
  },
  computed: {
    classNumber(this: any) {
      return this.classes.length;
    },
    addedClass(this: any) {
      /* https://stackoverflow.com/questions/10619126/make-sure-string-is-a-valid-css-id-name */
      return this.addedText
        .toLowerCase()
        .replace(/[^a-z0-9_\s-:]/g, "")
        .replace(/[\s-]+/, " ")
        .replace(/[\s_]/, "-");
    },
    parsedList() {
      if (this.list) {
        return this.list.map(item => {
          if ("options" in item) {
            item.options = parseList(item.options);
            item.disabled = item.options.some(opt =>
              this.classes.includes(opt.value)
            );
            return item;
          } else {
            return (classes.includes(item.value) || item.disabled) ?? false;
          }
        });
      } else {
        return [];
      }
    }
  },
  mounted(this: any) {
    setTimeout(() => this.setValidity(), 500);
    this.$watch(
      "value",
      function(this: any, v: string[]) {
        if (v && !isEqual(v, this.classes)) {
          this.classes = v;
        }
      },
      { immediate: true, deep: true }
    );
  },
  methods: {
    toLabel,
    setValidity(this: any) {
      const wrapper = this.list ? this.$refs.selectField : this.$refs.textField;

      const el = wrapper?.$el;

      if (!el) return;

      if (this.classes.length < this.min) {
        const msg = `Minimum ${this.min} Needed (${this.classes.length} added)`;
        el.setCustomValidity(msg);
      } else {
        el.setCustomValidity("");
      }
    },
    getListItemName(this: any, value: string) {
      let label;
      let opt;
      this.parsedList.some(item => {
        if ("options" in item) {
          opt = item.options.find(opt => opt.value == value);
          if (!opt) {
            return false
          }
          label = `${item.label} : ${opt.label}`
          return true
        } else if (item.value == value) {
          label = item.label
          return true
        }
        return false
      });
      return label
    },
    addClass(this: any) {
      if (this.addedClass.length < 2) {
        emitEvent("notify", "Class require at least 2 characters");
        return;
      }
      if (this.addedClass && !this.classes.includes(this.addedClass)) {
        this.classes.push(this.addedClass);
        this.setValidity();
        this.$emit("input", this.classes);
      }
      this.addedText = "";
    },
    removeClass(this: any, index: number) {
      this.classes.splice(index, 1);
      this.$emit("input", this.classes);
    }
  }
};
</script>

<style lang="less">
.tag-input {
  .the-tags {
    margin-top: 0.5rem;
  }
  .tag {
    font-size: 0.8rem;
    display: inline-block;
    padding: 3px 0.5em;

    .tx {
      margin-right: 5px;
    }
    .rm {
      opacity: 0.3;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
  .the-input {
    display: flex;
    min-width: 12em;
    input[type="text"] {
      margin-right: 0.5em;
    }
  }
}
</style>
