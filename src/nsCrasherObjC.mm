#include <Foundation/Foundation.h>

void ThrowObjCException()
{
  [NSException raise:@"OMGWTF" format:@"Hay guise!"];
}
