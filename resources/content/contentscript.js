// Just a sanity check
if (!Util.isParentProcess()) {
  Components.utils.import("resource://gre/modules/ctypes.jsm");
  //TODO: could load the crasher library and crash in other ways
  var zero = new ctypes.intptr_t(8);
  var badptr = ctypes.cast(zero, ctypes.PointerType(ctypes.int32_t));
  var crash = badptr.contents;
}
