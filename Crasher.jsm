var EXPORTED_SYMBOLS = ["Crasher"];

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

let Crasher = {
  CRASH_NULL_POINTER_DEREF: 0,
  CRASH_NULL_POINTER_FNCALL: 1,
  CRASH_DIVIDE_BY_ZERO: 2,
  CRASH_STACK_OVERFLOW: 3,
  CRASH_PURE_VIRTUAL_CALL: 4,
  CRASH_INVALID_CRT_PARAM: 5,
  CRASH_OBJC_EXCEPTION: 6,
};

XPCOMUtils.defineLazyGetter(Crasher, "crash", function () {
  Components.utils.import("resource://gre/modules/ctypes.jsm");
  var dir = __LOCATION__.parent.parent;
  for (var f of ["testcrasher", "crashme"]) {
    var file = dir.clone();
    file.append(ctypes.libraryName(f));
    if (!file.exists()) {
      // look in ABI dir
      file = dir.clone();
      let xr = Components.classes["@mozilla.org/xre/app-info;1"]
            .getService(Components.interfaces.nsIXULRuntime);
      file.append(xr.OS + "_" + xr.XPCOMABI);
      file.append(ctypes.libraryName(f));
      if (!file.exists()) {
        continue;
      }
    }
    var lib = ctypes.open(file.path);
    if (f == "crashme") {
      return lib.declare("Crash", ctypes.default_abi, ctypes.bool, ctypes.int32_t);
    } else {
      return lib.declare("Crash", ctypes.default_abi, ctypes.void_t, ctypes.int16_t);
    }
  }
});
