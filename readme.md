# Origami Diagrams

[![Build Status](https://travis-ci.org/robbykraft/origami-diagrams.svg?branch=master)](https://travis-ci.org/robbykraft/origami-diagrams)

convert a [FOLD object](https://github.com/edemaine/fold) into origami diagrams.

# FOLD

*see example.fold inside `/tests` as a reference.*

presently, this program is reading a FOLD file in this way:

```
{
  "file_spec": 1.1,
  "file_author": "Robby Kraft",
  "file_title": "African Elephant",
  "file_description": "a complex 3D African elephant with color changing tusks",
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

The top level contains only "**file_**" entries (ignoring any geometry). **file_frames** contains the ordered list of steps to be diagrammed.

```
  "file_frames": [{
    "frame_classes": ["diagrams"],
    "re:diagrams": {
      ...
    },
    ...
  }, {
    "frame_classes": ["diagrams"]
    "re:diagrams": {
      ...
    },
    ...
  }, {
```
Somewhere we need to allow the ability to include additional information such as the finished crease pattern or folded form meant to be printed in places other than the diagram steps, like in the page header. Presently, these are included in **file_frames**, requiring the need to differentiate between diagram steps, and non-diagram steps.

1. If a frame is meant to be a step in the diagram it should have some kind of class ("diagrams") inside **frame_classes**.
2. alternatively the inclusion of a frame is implied by the presence of **re:diagrams** key. although, this gives the key a dual purpose (layout instructions, and inclusion-in-diagram), which could lead to confusion.

# FOLD Extensions

all keys not standard to the FOLD format currently use the [Rabbit Ear](https://rabbitear.org) namespace, **"re:"**

each diagram step (entry in the **file_frames**) contains the FOLD geometry for the origami (vertices_coords, faces_vertices), as well as instructions to the renderer regarding diagramming. the **re:diagrams** frame is laid out like this:

```
"re:diagrams": [{
  "re:diagram_lines": [
    {
      "re:diagram_line_classes": ["valley"],
      "re:diagram_line_coords": [[0.5, 0], [1, 0.5]]
    }
  ],
  "re:diagram_arrows":[
    {
      "re:diagram_arrow_classes": [],
      "re:diagram_arrow_coords": [[1, 0], [0.5, 0.5]]
    }
  ],
  "re:diagram_instructions": {
    "en": "valley fold",
    "es": "doblez de valle",
    "zh": "谷摺"
  },
  "re:diagram_step": "1"
}]
```

**re:diagrams** is an array, sometimes diagram steps contain multiple steps inside ("reverse fold the beak, crimp the feet"). also, both arrow and line definitions are arrays making room for multiple arrows or lines per step.

**re:diagram_lines**

contains an array of lines to represent crease lines, like dashed lines or solid marks. line is defined by two endpoints **re:diagram_line_coords**, and **diagram_arrow_classes** are directions to the rendering engine to describe the line style.

**re:diagram_arrows**

an array containing definitions for arrows. **re:diagram_arrow_coords** are the two endpoints, ordered start to end. **re:diagram_arrow_classes** are directions to the rendering engine to describe the arrow style.

**re:diagram_instructions**

written instructions, typically these are printed under each step. this is an object with each string under a key matching the ISO language codes.

**re:diagram_step**

making it possible to have steps with custom names: 1, 2, 3a, 3b, 4...

# License

MIT
