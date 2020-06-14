export default {
  widget: {
    positions: [
      {
        value: "navbar",
        name: "Navbar",
        desc: "Header of page centered in the navbar",
        layout: "grid"
      },
      {
        value: "top",
        name: "Top",
        desc: "Header of page below the navbar",
        layout: "grid"
      },
      {
        value: "bottom",
        name: "Bottom",
        desc: "Above footer of page below the main content",
        layout: "grid"
      },
      {
        value: "footer",
        name: "Footer",
        desc: "Footer of page center",
        layout: "grid"
      }
    ],
    components: {
      header: (): Promise<any> => import("./components/widget-header.vue")
    },
    settings: [
      {
        _id: "header",
        label: "Widget Header",
        input: "select",
        description: "Wether to show the widget header or what heading tag to render.",
        list: [
          {
            name:"Hide",
            value: 0,
          },
          ...Array.from({length: 5}, (_, n) => ({name: `Heading ${n}`, value: n})),
        ],
        _default: 0
      },
      {
        _id: "classes",
        label: "Classes",
        input: "tags",
        placeholder: "Enter classes",
        description: "CSS classes [class=\"\"] for the container"
      },
      {
        _id: "styles",
        label: "Inline Styles",
        input: "textarea",
        placeholder: "color: gray; font-weight: 700;",
        description: "CSS styles [style=\"\"] for the container"
      }
    ]
  },
};
