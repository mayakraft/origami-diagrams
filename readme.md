# Origami Diagrams

[![Build Status](https://travis-ci.org/robbykraft/origami-digrams.svg?branch=master)](https://travis-ci.org/robbykraft/origami-digrams)

convert a fold file into origami diagrams. presently, this program is reading a fold file in this way:

```
{
  "file_spec": 1.1,
  "file_author": "Robby Kraft",
  "file_title": "African Elephant",
  "file_description": "a complex 3D African elephant with tusks",
  "file_classes": ["digrams"],
  "file_frames": [{
    ...
  }, {
    ...
  }, {
    ...
  }]
}
```

The top level contains only "**file_**" entries (no geometry). **file_frames** contains, among other things, the ordered list of steps to be diagrammed.

```
  "file_frames": [{
    "frame_classes": ["diagrams"],
    "re:diagrams": {
      ...
    },
    ...
  }, {
    "frame_classes": ["diagrams"]
    ...
  }, {
```
It's possible to include frames not meant for diagramming. We need a way to separate these two. 

1. If one of the frames is meant to be a step in the diagram it should have some kind of class ("diagrams") associated with it. This way, **file_frames** could potentially include additional frames such as the finished crease pattern or folded form, meant to be printed in places other than the diagram steps like in the introduction header. These frames should *not* include the designated indicator in their **frame_classes**.
2. alternatively the inclusion of a frame is implied by the presence of "re:diagrams" key. but this gives the key a dual purpose (layout instructions, and inclusion-in-diagram) which might be not good.

## extensions to entries in file_frames

each diagram step (each entry in the **file_frames**) contains its own instructions to the renderer. the **re:diagrams** frame is laid out like this:

```
"re:diagrams": [{
  "re:diagram_lines": [{
    "re:diagram_line_classes": ["valley"],
    "re:diagram_line_coords": [[0.5,0], [1,0.5]]
  }],
  "re:diagram_arrows":[
    {
      "re:diagram_arrow_classes": [],
      "re:diagram_arrow_coords": [[1,0],[0.5,0.5]]
    }
  ],
  "re:diagram_instructions": {
    "en": "valley fold"
  },
  "re:diagram_step": "1"
}]
```

**re:diagram_lines**

contains an array of lines to represent crease lines, like dashed lines or solid marks. line is defined by two endpoints **re:diagram_line_coords**, and **diagram_arrow_classes** are directions to the rendering engine to describe the line style.

**re:diagram_arrows**

an array containing definitions for arrows. **re:diagram_arrow_coords** are the two endpoints, ordered start to end. **re:diagram_arrow_classes** are directions to the rendering engine to describe the arrow style.

**re:diagram_instructions**

written instructions, typically these are printed under each step. this is an object with each string under a key matching the ISO language codes.

**re:diagram_step**

making it possible to have steps with custom names: 1, 2, 3a, 3b, 4...
