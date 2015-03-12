/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This file is built as a standalone module, linked to mozcrt19.dll,
// so that it can test the invalid parameter handler and pure
// virtual call handler from the CRT. Unfortunately, we need to be
// linked to the same CRT as our host process, hence this accessory lib.
// I don't want to link the main component directly to mozcrt19.dll,
// since it would no longer work with non-jemalloc builds, which would
// limit its usefulness.

#include <stdio.h>

extern "C" __declspec(dllexport) void crashme_crash_invalid_parameter()
{
  // triggers the invalid parameter handler
  printf(NULL);
}

/*
 * This pure virtual call example is from MSDN
 */
class A;

void fcn( A* );

class A
{
public:
  virtual void f() = 0;
  A() { fcn( this ); }
};

class B : A
{
  void f() { }
};

void fcn( A* p )
{
  p->f();
}

extern "C" __declspec(dllexport) void crashme_crash_pure_virtual()
{
  // generates a pure virtual function call
  B b;
}
