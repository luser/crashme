var EXPORTED_SYMBOLS = [
"CRASH_NULL_POINTER_DEREF",
"CRASH_NULL_POINTER_FNCALL",
"CRASH_DIVIDE_BY_ZERO",
"CRASH_STACK_OVERFLOW",
"CRASH_PURE_VIRTUAL_CALL",
"CRASH_INVALID_CRT_PARAM",
"CRASH_OBJC_EXCEPTION",
"crash"
];

const CRASH_NULL_POINTER_DEREF  = 0;
const CRASH_NULL_POINTER_FNCALL = 1;
const CRASH_DIVIDE_BY_ZERO      = 2;
const CRASH_STACK_OVERFLOW      = 3;
const CRASH_PURE_VIRTUAL_CALL   = 4;
const CRASH_INVALID_CRT_PARAM   = 5;
const CRASH_OBJC_EXCEPTION      = 6;

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
}
var lib = ctypes.open(file.path);
var crash = lib.declare("Crash", ctypes.default_abi, ctypes.bool, ctypes.int32_t);
