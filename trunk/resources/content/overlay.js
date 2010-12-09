/*
 * Copyright (c) 2008 Ted Mielczarek
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * */

var crashme = {
  onMenuItemCommand: function(e, how) {
    if (how == undefined || how == null)
      how = Crasher.CRASH_NULL_POINTER_DEREF;
    // You asked for it...
    Crasher.crash(how);
  },
  crashContentProcess: function(e) {
    //XXX: is this fennec-specific?
    // First load a tab, because if there aren't any remote
    // tabs open, then we can't get a messageManager to do anything useful
    var tab = Browser.addTab("http://www.mozilla.org/", true);
    tab.browser.messageManager.loadFrameScript('chrome://crashme/content/contentscript.js', true);
  }
};
Components.utils.import("resource://crashme/Crasher.jsm");
