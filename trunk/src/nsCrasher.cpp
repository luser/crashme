#include "nsCrasher.h"
#include <stdio.h>
#ifdef XP_WIN32
#include <windows.h>
#endif

nsresult
NS_NewCrasher(nsICrasher** aResult)
{
    nsICrasher* crasher = new nsCrasher();
    if (!crasher)
        return NS_ERROR_OUT_OF_MEMORY;

    NS_ADDREF(*aResult = crasher);
    return NS_OK;
}

NS_IMPL_ISUPPORTS1(nsCrasher, nsICrasher)

nsresult callAccessory(const char* accessory_func)
{
#ifdef XP_WIN32
  // Need to get a full path to load accessory.dll
  HMODULE hSelf = LoadLibraryW(L"crashme.dll");
  wchar_t accessory_path[MAX_PATH] = L"\0";
  if (!hSelf || !GetModuleFileNameW(hSelf, accessory_path, MAX_PATH))
    return NS_ERROR_FAILURE;

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
    if (myfunc)
      myfunc();
  }
#endif
  return NS_ERROR_NOT_IMPLEMENTED;
}

/* void crash (in short how); */
NS_IMETHODIMP nsCrasher::Crash(PRInt16 how)
{
  switch (how) {
  case nsICrasher::CRASH_NULL_POINTER_DEREF: {
    int* foo = (int *)NULL;
    *foo = 5; // boom
    break;
  }
  case nsICrasher::CRASH_NULL_POINTER_FNCALL: {
    typedef void (*fn)(void);
    fn ouch = NULL;
    ouch();
    break;
  }
  case nsICrasher::CRASH_DIVIDE_BY_ZERO: {
    volatile int foo = 0;
    foo = 5 / foo;
    break;
  }
  case nsICrasher::CRASH_STACK_OVERFLOW:
    Crash(nsICrasher::CRASH_STACK_OVERFLOW);
    break;
  case nsICrasher::CRASH_PURE_VIRTUAL_CALL:
    return callAccessory("crashme_crash_pure_virtual");
  case nsICrasher::CRASH_INVALID_CRT_PARAM:
    return callAccessory("crashme_crash_invalid_parameter");
  }

  return NS_OK;
}
