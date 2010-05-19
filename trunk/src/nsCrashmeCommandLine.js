const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const Timer = Components.Constructor("@mozilla.org/timer;1", "nsITimer", "initWithCallback");

function nsCrashmeCLH() { }

function DoCrash()
{
  let crasher = Cc["@ted.mielczarek.org/crashme;1"].createInstance(Ci.nsICrasher);
  crasher.crash(Ci.nsICrasher.CRASH_NULL_POINTER_DEREF);
}

nsCrashmeCLH.prototype = {
  _timer: null,

  //
  // nsICommandLineHandler
  //
  handle: function fs_handle(cmdLine) {
    if (cmdLine.handleFlag("crash", false)) {
      this._timer = new Timer(DoCrash, 5000, Ci.nsITimer.TYPE_ONE_SHOT);
    }
  },

  helpInfo: "    -crash                 Crash your browser in 5 seconds\n",

  // QI
  QueryInterface: XPCOMUtils.generateQI([Ci.nsICommandLineHandler]),

  // XPCOMUtils factory
  classDescription: "Crash Me Now! Commandline Component",
  contractID: "@ted.mielczarek.org/crashme/commandline;1",
  classID: Components.ID("{347b1196-acc9-4efa-abf5-9b0e9e2c9e2c}"),
  _xpcom_categories: [{ category: "command-line-handler", entry: "00-crashme" }]
};

var components = [ nsCrashmeCLH ];

function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule(components);
}
