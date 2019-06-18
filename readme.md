# Origami Diagrams

convert a fold file into origami diagrams. presently, this program is reading a fold file in this way:

``` json
{
  "file_spec": 1.1,
  "file_author": "Robby Kraft",
  "file_title": "my origami",
  "file_description": "a simple flat-foldable origami piece",
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

``` json
  "file_frames": [{
    "frame_classes": ["diagrams"]
  }, {
    "frame_classes": ["diagrams"]
  }, {
  	...
```

If one of the frames is meant to be a step in the diagram it should have some kind of class ("diagrams") associated with it.

This way, **file_frames** could potentially include additional frames such as the finished crease pattern or folded form, meant to be printed in places other than the diagram steps like in the introduction header. These frames should *not* include the designated indicator in their **frame_classes**.

## extensions to entries in file_frames

```
  "frame_re:diagramStep": "1"
```

making it possible to have steps with custom names: 1, 2, 3a, 3b, 4...
