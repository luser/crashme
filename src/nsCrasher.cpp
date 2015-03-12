/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "nscore.h"
#ifdef XP_WIN32
#include <windows.h>
#endif

const int CRASH_NULL_POINTER_DEREF  = 0;
const int CRASH_NULL_POINTER_FNCALL = 1;
const int CRASH_DIVIDE_BY_ZERO      = 2;
const int CRASH_STACK_OVERFLOW      = 3;
const int CRASH_PURE_VIRTUAL_CALL   = 4;
const int CRASH_INVALID_CRT_PARAM   = 5;
const int CRASH_OBJC_EXCEPTION      = 6;

// Defined in nsCrasherObjC.mm
#ifdef XP_MACOSX
void ThrowObjCException();
#endif

bool callAccessory(const char* accessory_func)
{
#ifdef XP_WIN32
  // Need to get a full path to load accessory.dll
  HMODULE hSelf = LoadLibraryW(L"crashme.dll");
  wchar_t accessory_path[MAX_PATH] = L"\0";
  if (!hSelf || !GetModuleFileNameW(hSelf, accessory_path, MAX_PATH))
    return false;

  wchar_t* s = wcsrchr(accessory_path, '\\');
  if (s) {
    s++;
    wcscpy(s, L"accessory.dll");
  }

  // accessory.dll is linked to mozcrt19.dll, so this load
  // will fail if our host build is not built with jemalloc.
  HMODULE hAccessory = LoadLibraryW(accessory_path);
  if (hAccessory) {
    typedef void (*accessory_ptr)();
    accessory_ptr myfunc = (accessory_ptr)GetProcAddress(hAccessory,
                                                         accessory_func);
    if (myfunc) {
      myfunc();
      return true; // not reached
    }
  }
#endif
  return false;
}

extern "C"
NS_EXPORT bool Crash(int how)
{
  switch (how) {
  case CRASH_NULL_POINTER_DEREF: {
    int* foo = (int *)NULL;
    *foo = 5; // boom
    break;
  }
  case CRASH_NULL_POINTER_FNCALL: {
    typedef void (*fn)(void);
    fn ouch = NULL;
    ouch();
    break;
  }
  case CRASH_DIVIDE_BY_ZERO: {
    volatile int foo = 0;
    foo = 5 / foo;
    break;
  }
  case CRASH_STACK_OVERFLOW:
    Crash(CRASH_STACK_OVERFLOW);
    break;
  case CRASH_PURE_VIRTUAL_CALL:
    return callAccessory("crashme_crash_pure_virtual");
  case CRASH_INVALID_CRT_PARAM:
    return callAccessory("crashme_crash_invalid_parameter");
  case CRASH_OBJC_EXCEPTION: {
#ifdef XP_MACOSX
    ThrowObjCException();
    break;
#else
    return false;
#endif
  }
  }

  return true; // not reached
}
