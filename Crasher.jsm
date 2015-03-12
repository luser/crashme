/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

function ctypes_crash() {
  Components.utils.import("resource://gre/modules/ctypes.jsm");
  var zero = new ctypes.intptr_t(8);
  var badptr = ctypes.cast(zero, ctypes.PointerType(ctypes.int32_t));
  var crash = badptr.contents;
}

XPCOMUtils.defineLazyGetter(Crasher, "crash", function () {
  Components.utils.import("resource://gre/modules/ctypes.jsm");
  var dir = __LOCATION__.parent.parent;
  var file = dir.clone();
  file.append(ctypes.libraryName("crashme"));
  if (!file.exists()) {
    // look in ABI dir
    file = dir.clone();
    let xr = Components.classes["@mozilla.org/xre/app-info;1"]
          .getService(Components.interfaces.nsIXULRuntime);
    file.append(xr.OS + "_" + xr.XPCOMABI);
    file.append(ctypes.libraryName("crashme"));
    if (!file.exists()) {
      // Fall back to a working implementation.
      return ctypes_crash;
    }
  }
  var lib = ctypes.open(file.path);
  return lib.declare("Crash", ctypes.default_abi, ctypes.bool, ctypes.int32_t);
});
