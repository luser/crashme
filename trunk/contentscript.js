// Just a sanity check
let appInfo = Components.classes["@mozilla.org/xre/app-info;1"];
if (appInfo && appInfo.getService(Components.interfaces.nsIXULRuntime)
    .processType != Components.interfaces.nsIXULRuntime.PROCESS_TYPE_DEFAULT) {
  Components.utils.import("resource://gre/modules/ctypes.jsm");
  var zero = new ctypes.intptr_t(8);
  var badptr = ctypes.cast(zero, ctypes.PointerType(ctypes.int32_t));
  var crash = badptr.contents;
}
