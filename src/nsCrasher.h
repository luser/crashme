#include "nsICrasher.h"

class nsCrasher : public nsICrasher
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_NSICRASHER

  nsCrasher() {};

private:
  ~nsCrasher() {};
};
